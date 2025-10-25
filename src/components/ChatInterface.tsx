import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, X, Download, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  segmentationMask?: string;
}

interface ChatInterfaceProps {
  onStatusChange?: (status: 'ACTIVE' | 'IDLE' | 'ANALYSING') => void;
}

const ChatInterface = ({ onStatusChange }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [intelMode, setIntelMode] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim() && !uploadedImage) return;

    onStatusChange?.('ANALYSING');

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
      onStatusChange?.('ACTIVE');
    }, 2000);
  };

  const handleExport = () => {
    const exportData = {
      session: {
        timestamp: new Date().toISOString(),
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
          hasImage: !!m.image,
          hasSegmentation: !!m.segmentationMask,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inteltrace-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Session Exported',
      description: 'Intelligence session data saved successfully.',
    });
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
      {/* Toolbar */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="intel-mode" 
                checked={intelMode}
                onCheckedChange={setIntelMode}
              />
              <Label htmlFor="intel-mode" className="text-xs font-mono cursor-pointer">
                <Layers className="w-3 h-3 inline mr-1" />
                INTEL MODE
              </Label>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={messages.length === 0}
            className="gap-2 font-mono text-xs"
          >
            <Download className="w-3 h-3" />
            EXPORT SESSION
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-block p-4 rounded-lg bg-card border border-border mb-4 glow-primary">
                <Upload className="w-12 h-12 text-primary mx-auto" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2 tracking-wide">IntelTrace Surveillance Assistant</h2>
              <p className="text-muted-foreground max-w-md mx-auto font-tactical">
                Upload satellite or drone imagery and describe what you're looking for using natural language. 
                The AI will analyze and segment regions of interest.
              </p>
            </motion.div>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-3 relative inline-block"
            >
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="h-24 rounded border-2 border-primary glow-primary"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => setUploadedImage(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
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
