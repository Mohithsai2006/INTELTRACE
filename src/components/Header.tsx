import { Shield, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">IntelTrace</h1>
            <p className="text-xs text-muted-foreground">Reasoning-Based Tactical Surveillance</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5 border-primary/50 text-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          System Active
        </Badge>
        
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
