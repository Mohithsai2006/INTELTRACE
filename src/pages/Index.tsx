import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';

type SystemStatus = 'ACTIVE' | 'IDLE' | 'ANALYSING';

const Index = () => {
  const [status, setStatus] = useState<SystemStatus>('ACTIVE');

  return (
    <div className="h-screen flex flex-col tactical-grid">
      <Header status={status} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <ChatInterface onStatusChange={setStatus} />
        </main>
      </div>
    </div>
  );
};

export default Index;
