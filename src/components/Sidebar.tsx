import { motion } from 'framer-motion';
import { Plus, MessageSquare, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded bg-primary/10 border border-primary/30 glow-primary">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider">IntelTrace</h1>
            <p className="text-xs text-muted-foreground font-tactical">Defence AI Assistant</p>
          </div>
        </div>
        
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 font-mono text-xs tracking-wide" size="sm">
          <Plus className="w-4 h-4" />
          NEW_ANALYSIS
        </Button>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <div className="px-3 py-2 text-xs font-mono text-muted-foreground tracking-wider">
            [RECENT_SESSIONS]
          </div>
          {conversations.map((conv, i) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-colors group"
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-0.5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-tactical font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {conv.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2 font-mono text-xs" size="sm">
          <Settings className="w-4 h-4" />
          SETTINGS
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
