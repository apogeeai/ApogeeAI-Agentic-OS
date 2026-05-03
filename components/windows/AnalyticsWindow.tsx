import { Card } from '@/components/ui/card';
import { TrendingUp, Activity, CircleCheck as CheckCircle, DollarSign } from 'lucide-react';

export function AnalyticsWindow() {
  return (
    <div className="h-full flex flex-col overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 header-font">Analytics</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold header-font">247</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">GPU Usage</p>
              <p className="text-2xl font-bold header-font">67%</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agent Activity</p>
              <p className="text-2xl font-bold header-font">12</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold header-font">$4.2k</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Card className="flex-1 p-4">
        <h3 className="font-semibold mb-3 header-font">Activity Over Time</h3>
        <div className="h-32 bg-gradient-to-t from-blue-100 to-transparent rounded flex items-end justify-around px-4">
          {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
            <div
              key={idx}
              className="w-8 bg-blue-500 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
