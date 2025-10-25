import { User, Bot, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  segmentationMask?: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-4 animate-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "flex flex-col gap-2 max-w-2xl",
        isUser && "items-end"
      )}>
        <div className={cn(
          "rounded-lg p-4 border",
          isUser 
            ? "bg-primary/10 border-primary/30" 
            : "bg-card border-border"
        )}>
          {message.image && (
            <div className="mb-3 relative group">
              <img 
                src={message.image} 
                alt="Uploaded" 
                className="max-w-md rounded border border-border"
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-background/90 border border-primary/50 text-xs text-primary flex items-center gap-1">
                <Crosshair className="w-3 h-3" />
                Analyzing
              </div>
            </div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {message.segmentationMask && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-primary font-medium">
                <Crosshair className="w-4 h-4" />
                Segmentation Result
              </div>
              <div className="relative group">
                <img 
                  src={message.segmentationMask} 
                  alt="Segmentation mask" 
                  className="max-w-md rounded border border-primary/50"
                />
                <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity rounded" />
              </div>
            </div>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
