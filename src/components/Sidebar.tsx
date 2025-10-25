import { Plus, MessageSquare, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

const Sidebar = () => {
  const conversations: Conversation[] = [
    { id: '1', title: 'Satellite imagery analysis - Urban sector', timestamp: new Date() },
    { id: '2', title: 'Drone feed threat detection', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Camouflage pattern recognition', timestamp: new Date(Date.now() - 172800000) },
  ];

  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h1 className="font-bold text-lg">IntelTrace</h1>
            <p className="text-xs text-muted-foreground">Defence AI Assistant</p>
          </div>
        </div>
        
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90" size="sm">
          <Plus className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            Recent Sessions
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-colors group"
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-0.5 text-primary opacity-60 group-hover:opacity-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {conv.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
