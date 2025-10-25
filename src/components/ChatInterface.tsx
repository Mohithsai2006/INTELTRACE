import { useState } from 'react';
import { Send, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  segmentationMask?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim() && !uploadedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      image: uploadedImage || undefined,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setUploadedImage(null);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Analyzing imagery for potential threats and suspicious patterns. The segmentation mask highlights regions of interest based on your query. This is a demonstration response - connect to backend for real analysis.',
        timestamp: new Date(),
        segmentationMask: uploadedImage || undefined,
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 rounded-lg bg-card border border-border mb-4">
                <Upload className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">IntelTrace Surveillance Assistant</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload satellite or drone imagery and describe what you're looking for using natural language. 
                The AI will analyze and segment regions of interest.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto p-4">
          {uploadedImage && (
            <div className="mb-3 relative inline-block">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="h-24 rounded border-2 border-primary"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => setUploadedImage(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div 
            className={`relative flex gap-2 ${isDragging ? 'opacity-50' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="relative flex-1">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe what you're looking for in the imagery..."
                className="min-h-[60px] pr-12 resize-none bg-background border-border focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <label htmlFor="image-upload" className="absolute bottom-3 right-3 cursor-pointer">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Upload className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </label>
            </div>
            
            <Button 
              onClick={handleSend} 
              size="icon"
              className="h-[60px] w-[60px] bg-primary hover:bg-primary/90 glow-primary"
              disabled={!inputValue.trim() && !uploadedImage}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
