import { Button } from '@/components/ui/button';
import { Play, Save } from 'lucide-react';

export function CodeEditorWindow() {
  return (
    <div className="h-full flex">
      <div className="w-48 bg-gray-100 border-r overflow-auto p-2">
        <h3 className="text-xs font-semibold mb-2 text-gray-700 header-font">Project Files</h3>
        <div className="text-xs space-y-1">
          <div className="p-1 hover:bg-gray-200 cursor-pointer rounded">📁 agents/</div>
          <div className="pl-4 p-1 hover:bg-gray-200 cursor-pointer rounded">📄 research.py</div>
          <div className="pl-4 p-1 hover:bg-gray-200 cursor-pointer rounded">📄 creative.py</div>
          <div className="p-1 hover:bg-gray-200 cursor-pointer rounded">📁 workflows/</div>
          <div className="p-1 hover:bg-gray-200 cursor-pointer rounded bg-blue-100">📄 main.py</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-gray-100 border-b px-4 py-2">
          <div className="flex gap-2">
            <span className="text-sm font-medium header-font">main.py</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-gray-50">
          <pre className="text-gray-800">
{`import os
from agents import ResearchAgent, CreativeAgent

class AgenticPipeline:
    def __init__(self):
        self.research = ResearchAgent()
        self.creative = CreativeAgent()

    async def run(self, query):
        # Research phase
        data = await self.research.gather(query)

        # Creative phase
        result = await self.creative.generate(data)

        return result

if __name__ == "__main__":
    pipeline = AgenticPipeline()
    pipeline.run("Build next feature")`}
          </pre>
        </div>

        <div className="bg-gray-900 text-white p-3 border-t">
          <h4 className="text-xs font-semibold mb-1 header-font">Build Output</h4>
          <div className="text-xs font-mono">
            <div className="text-green-400">✓ No errors detected</div>
            <div className="text-blue-400">Ready to run</div>
          </div>
        </div>
      </div>
    </div>
  );
}
