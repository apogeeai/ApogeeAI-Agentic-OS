import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

export function ScheduleWindow() {
  const events = [
    { time: '09:00', title: 'Run Research Workflow', type: 'workflow' },
    { time: '12:00', title: 'Publish Content', type: 'automation' },
    { time: '15:00', title: 'Data Scrape', type: 'task' },
    { time: '18:00', title: 'Generate Reports', type: 'workflow' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Schedule</h2>
        <Button size="sm">New Event</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline">Day</Button>
        <Button size="sm" variant="outline">Week</Button>
        <Button size="sm" variant="outline">Month</Button>
      </div>

      <Card className="flex-1 p-4 overflow-auto">
        <h3 className="font-semibold mb-3 header-font">Today's Schedule</h3>
        <div className="space-y-3">
          {events.map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {event.time}
              </div>
              <div className="flex-1">
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-gray-500 capitalize">{event.type}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
        <h4 className="font-semibold mb-2 header-font">Automation Rules</h4>
        <p className="text-xs text-gray-700">Cron: 0 9,12,15,18 * * *</p>
        <p className="text-xs text-gray-600">Repeat: Daily</p>
      </div>
    </div>
  );
}
