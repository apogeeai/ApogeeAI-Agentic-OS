import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Square, Upload, Download } from 'lucide-react';

export function WorkflowsWindow() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Workflows</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button size="sm">
            <Play className="w-4 h-4 mr-1" />
            Run Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 @xs:grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm header-font">Research Agent</h3>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm header-font">Creative Agent</h3>
              <p className="text-xs text-gray-500">Idle</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm header-font">Builder Agent</h3>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
        <h3 className="font-semibold mb-3 header-font">Workflow Canvas</h3>
        <div className="text-sm text-gray-600">
          <p className="mb-2">Design multi-agent pipelines by connecting nodes:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Research Agent → Creative Agent → Builder Agent</li>
            <li>ComfyUI Render → Publish Content</li>
            <li>Configure triggers, inputs, and outputs</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-gray-900 text-white rounded-lg p-3">
        <h4 className="text-xs font-semibold mb-2 header-font">Execution Log</h4>
        <div className="text-xs font-mono space-y-1">
          <div className="text-green-400">[12:34:56] Workflow started</div>
          <div className="text-blue-400">[12:35:01] Research agent processing...</div>
          <div className="text-green-400">[12:35:15] Task completed successfully</div>
        </div>
      </div>
    </div>
  );
}
