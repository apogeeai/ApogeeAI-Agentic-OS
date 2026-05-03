import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Settings } from 'lucide-react';

export function AutomationsWindow() {
  const automations = [
    { name: 'Daily Research Agent', status: 'active', trigger: 'Scheduled', lastRun: '2h ago', nextRun: '22h' },
    { name: 'Content Pipeline', status: 'active', trigger: 'Webhook', lastRun: '5m ago', nextRun: 'On trigger' },
    { name: 'Social Posting', status: 'paused', trigger: 'Scheduled', lastRun: '2d ago', nextRun: 'Paused' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Automations</h2>
        <Button size="sm">New Automation</Button>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {automations.map((auto, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold header-font">{auto.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={auto.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {auto.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{auto.trigger}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost">
                  {auto.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Last run:</span> {auto.lastRun}
              </div>
              <div>
                <span className="text-gray-600">Next run:</span> {auto.nextRun}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 p-4 bg-blue-50">
        <h3 className="font-semibold text-sm mb-2 header-font">Automation Editor</h3>
        <div className="space-y-2 text-xs">
          <div><span className="font-medium">Trigger:</span> Schedule (daily at 9:00 AM)</div>
          <div><span className="font-medium">Action:</span> Run workflow → Send notification</div>
        </div>
      </Card>
    </div>
  );
}
