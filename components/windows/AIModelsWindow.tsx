import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Settings } from 'lucide-react';

export function AIModelsWindow() {
  const models = [
    { name: 'Qwen Coder 80B', type: 'Local', status: 'Active', gpu: 'GPU 0', tokensPerSec: '45' },
    { name: 'Claude API', type: 'API', status: 'Active', gpu: 'N/A', tokensPerSec: '120' },
    { name: 'Gemini Flash', type: 'API', status: 'Active', gpu: 'N/A', tokensPerSec: '200' },
    { name: 'Z-Image Turbo', type: 'Image', status: 'Idle', gpu: 'GPU 1', tokensPerSec: 'N/A' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">AI Models</h2>
        <Button size="sm">Add Model</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline">Local Models</Button>
        <Button size="sm" variant="outline">API Models</Button>
        <Button size="sm" variant="outline">Image Models</Button>
        <Button size="sm" variant="outline">Embeddings</Button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left p-3 font-semibold header-font">Model Name</th>
              <th className="text-left p-3 font-semibold header-font">Type</th>
              <th className="text-left p-3 font-semibold header-font">Status</th>
              <th className="text-left p-3 font-semibold header-font">GPU</th>
              <th className="text-left p-3 font-semibold header-font">Tokens/sec</th>
              <th className="text-left p-3 font-semibold header-font">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-medium">{model.name}</td>
                <td className="p-3">
                  <Badge variant="outline">{model.type}</Badge>
                </td>
                <td className="p-3">
                  <Badge className={model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {model.status}
                  </Badge>
                </td>
                <td className="p-3">{model.gpu}</td>
                <td className="p-3">{model.tokensPerSec}</td>
                <td className="p-3">
                  <Button size="sm" variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="mt-4 p-4 bg-blue-50">
        <h3 className="font-semibold text-sm mb-2 header-font">Model Configuration</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-medium text-gray-700">Temperature</label>
            <input type="range" min="0" max="2" step="0.1" className="w-full" />
          </div>
          <div>
            <label className="font-medium text-gray-700">Max Tokens</label>
            <input type="number" className="w-full border rounded px-2 py-1" defaultValue="2048" />
          </div>
        </div>
      </Card>
    </div>
  );
}
