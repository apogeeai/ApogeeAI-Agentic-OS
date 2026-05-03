import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function TerminalWindow() {
  const [activeTab, setActiveTab] = useState('openclaw');

  const tabs = [
    { id: 'openclaw', label: 'OpenClaw VM' },
    { id: 'worker', label: 'Worker Node' },
    { id: 'gpu', label: 'GPU Monitor' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400 rounded-lg overflow-hidden">
      <div className="flex gap-1 bg-gray-800 p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            size="sm"
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className="text-xs header-font"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        <div className="space-y-1">
          <div className="text-gray-400">$ cd /workspace</div>
          <div className="text-gray-400">$ ls -la</div>
          <div className="text-green-400">
            drwxr-xr-x 5 user user 4096 Mar 14 12:00 agents/<br/>
            drwxr-xr-x 3 user user 4096 Mar 14 12:00 workflows/<br/>
            -rw-r--r-- 1 user user 1234 Mar 14 12:00 config.yml
          </div>
          <div className="text-gray-400">$ ./deploy-agent.sh</div>
          <div className="text-blue-400">Deploying agent to production...</div>
          <div className="text-green-400">✓ Agent deployed successfully</div>
          <div className="mt-4 flex items-center">
            <span className="text-yellow-400">user@agentic-os</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~/workspace</span>
            <span className="text-white">$ </span>
            <span className="animate-pulse">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}
