const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors'); // We will configure this
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');

const connectDB = require('./config/db.js');
const authRoutes = require('./routes/auth.js');
const conversationRoutes = require('./routes/conversations.js');

const User = require('./models/User.js');
const Conversation = require('./models/Conversation.js');
const Message = require('./models/Message.js');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json({ limit: '10mb' }));

// --- CORS CONFIGURATION ---
// This is the fix. We are now allowing your Vercel URL.
const corsOptions = {
  origin: [
    'http://localhost:5173', // For local dev
    'https://inteltrace-delta.vercel.app' // Your live frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions)); // <-- UPDATED
// --- END OF CORS ---


// --- PASSPORT MIDDLEWARE ---
app.use(passport.initialize());
require('./config/passport')(passport);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);

// Serve static upload files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// --- Socket.io Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions, // <-- UPDATED (use the same options)
});

// Socket.io Authentication Middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found.'));
    }
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Token is invalid.'));
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username} (${socket.id})`);

  // Join a room based on user ID to send private updates
  socket.join(socket.user._id.toString());

  socket.on('sendMessage', async (data) => {
    const { content, image, conversationId } = data;

    try {
      let convoId = conversationId;
      let isNewConversation = false;

      // 1. Find or Create Conversation
      if (!convoId) {
        const newConvo = new Conversation({
          user: socket.user._id,
          title: content.substring(0, 30) + '...',
        });
        const savedConvo = await newConvo.save();
        convoId = savedConvo._id;
        isNewConversation = true;
        // Notify sidebar to update
        io.to(socket.user._id.toString()).emit('newConversation', savedConvo);
      } else {
        // Update conversation timestamp
        await Conversation.findByIdAndUpdate(convoId, { updatedAt: Date.now() });
      }

      // 2. Handle Image Upload (if exists)
      let imageUrl = null;
      if (image) {
        // Image is base64 string, e.g., "data:image/jpeg;base64,..."
        const base64Data = image.split(';base64,').pop();
        const fileExtension = image.substring("data:image/".length, image.indexOf(";base64"));
        const filename = `${uuidv4()}.${fileExtension}`;
        const filepath = path.join(uploadsDir, filename);
        
        fs.writeFileSync(filepath, base64Data, { encoding: 'base64' });
        imageUrl = `/uploads/${filename}`; // URL path to be stored in DB
      }

      // 3. Save User's Message
      const userMessage = new Message({
        conversation: convoId,
        role: 'user',
        content: content,
        image: imageUrl,
      });
      const savedUserMessage = await userMessage.save();

      // 4. Emit User's Message back to them
      io.to(socket.user._id.toString()).emit('messageReceived', savedUserMessage);

      // 5. === MOCK LLM/SEGMENTATION LOGIC ===
      // (Replace this with your actual FastAPI/LLM call)
      setTimeout(async () => {
        const assistantMessage = new Message({
          conversation: convoId,
          role: 'assistant',
          content: `[MOCK RESPONSE] Analysis complete for query: "${content}". Reasoning-based segmentation identifies 3 high-priority threats.`,
          // If you generated a mask, save it and add the path here
          segmentationMask: imageUrl, // For demo, just re-using user image as mask
        });
        const savedAssistantMessage = await assistantMessage.save();

        // 6. Emit Assistant's Message
        io.to(socket.user._id.toString()).emit('messageReceived', savedAssistantMessage);
      }, 2500); // Simulate 2.5 second analysis

    } catch (error) {
      console.error('Error handling message:', error);
      io.to(socket.user._id.toString()).emit('messageError', { message: 'Failed to send message.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});