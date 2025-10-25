import { Shield, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type SystemStatus = 'ACTIVE' | 'IDLE' | 'ANALYSING';

interface HeaderProps {
  status?: SystemStatus;
}

const Header = ({ status = 'ACTIVE' }: HeaderProps) => {
  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'ANALYSING':
        return 'border-accent/50 text-accent';
      case 'IDLE':
        return 'border-muted-foreground/50 text-muted-foreground';
      default:
        return 'border-primary/50 text-primary';
    }
  };

  const getStatusDot = (status: SystemStatus) => {
    switch (status) {
      case 'ANALYSING':
        return 'bg-accent';
      case 'IDLE':
        return 'bg-muted-foreground';
      default:
        return 'bg-primary';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 glow-primary">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold tracking-wider">IntelTrace</h1>
            <p className="text-xs text-muted-foreground font-tactical">Reasoning-Based Tactical Surveillance</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className={`gap-1.5 font-mono text-xs tracking-wider ${getStatusColor(status)}`}>
          <div className={`w-2 h-2 rounded-full ${getStatusDot(status)} ${status === 'ANALYSING' ? 'animate-pulse' : ''}`} />
          [{status}]
        </Badge>
        
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
