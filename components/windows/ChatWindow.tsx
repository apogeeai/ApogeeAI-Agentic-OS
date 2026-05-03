import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';

export function ChatWindow() {
  const [message, setMessage] = useState('');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Chat</h2>
        <select className="text-sm border rounded px-2 py-1">
          <option>GPT-4</option>
          <option>Claude</option>
          <option>Gemini</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto space-y-4 mb-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg p-3">
            <p className="text-sm">Hello! I'm your AI assistant. How can I help you today?</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <div className="flex-1 bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
            <p className="text-sm">Can you analyze the latest workflow performance?</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg p-3">
            <p className="text-sm">I've analyzed your workflows. The research agent completed 45 tasks with 98% success rate. The creative agent processed 23 requests averaging 2.3s response time.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && setMessage('')}
        />
        <Button>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
