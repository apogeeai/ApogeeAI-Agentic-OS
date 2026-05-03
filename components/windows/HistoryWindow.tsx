import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Bot, Database, Code } from 'lucide-react';

export function HistoryWindow() {
  const events = [
    { time: '12:45 PM', type: 'workflow', title: 'Research Agent completed', icon: Play },
    { time: '12:30 PM', type: 'agent', title: 'Creative Agent triggered', icon: Bot },
    { time: '11:15 AM', type: 'deployment', title: 'Model deployed to GPU 0', icon: Code },
    { time: '10:00 AM', type: 'database', title: 'Migration applied', icon: Database },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">History</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Filter</Button>
        </div>
      </div>

      <Card className="flex-1 p-4 overflow-auto">
        <div className="space-y-3">
          {events.map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                event.type === 'workflow' ? 'bg-blue-100' :
                event.type === 'agent' ? 'bg-purple-100' :
                event.type === 'deployment' ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <event.icon className={`w-4 h-4 ${
                  event.type === 'workflow' ? 'text-blue-600' :
                  event.type === 'agent' ? 'text-purple-600' :
                  event.type === 'deployment' ? 'text-green-600' : 'text-orange-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-gray-500 mt-1">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
