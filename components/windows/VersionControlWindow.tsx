import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GitBranch, GitCommitVertical as GitCommit, Upload, Download } from 'lucide-react';

export function VersionControlWindow() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Version Control</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-1" />Pull</Button>
          <Button size="sm"><Upload className="w-4 h-4 mr-1" />Push</Button>
        </div>
      </div>

      <div className="mb-4">
        <select className="w-full p-2 border rounded text-sm">
          <option>main</option>
          <option>develop</option>
          <option>feature/new-agents</option>
        </select>
      </div>

      <Card className="flex-1 p-4 overflow-auto">
        <h3 className="font-semibold mb-3 header-font">Commit History</h3>
        <div className="space-y-3">
          {[
            { hash: 'a3f2c1d', message: 'Add new workflow automation', author: 'User', time: '2h ago' },
            { hash: '8b4e9f2', message: 'Update AI model configs', author: 'User', time: '5h ago' },
            { hash: 'c7d1a3b', message: 'Fix database migration', author: 'User', time: '1d ago' },
          ].map((commit) => (
            <div key={commit.hash} className="flex items-start gap-3 pb-3 border-b">
              <GitCommit className="w-4 h-4 text-gray-500 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-sm">{commit.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-mono">{commit.hash}</span> · {commit.author} · {commit.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
