import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, DollarSign, Activity } from 'lucide-react';

export function CloudServicesWindow() {
  const services = [
    { name: 'AWS', status: 'Active', usage: '45%', cost: '$234' },
    { name: 'Supabase', status: 'Active', usage: '23%', cost: '$89' },
    { name: 'Stripe', status: 'Active', usage: '12%', cost: '$45' },
    { name: 'OpenAI', status: 'Active', usage: '67%', cost: '$567' },
  ];

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 header-font">Cloud Services</h2>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-auto">
        {services.map((service) => (
          <Card key={service.name} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold header-font">{service.name}</h3>
                  <Badge className="text-xs bg-green-100 text-green-800">{service.status}</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Usage
                </span>
                <span className="font-semibold">{service.usage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Cost
                </span>
                <span className="font-semibold">{service.cost}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
