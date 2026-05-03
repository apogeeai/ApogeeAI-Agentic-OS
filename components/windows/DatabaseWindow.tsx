import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Table, Search } from 'lucide-react';

export function DatabaseWindow() {
  const tables = ['users', 'agents', 'workflows', 'tasks', 'logs'];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Database</h2>
        <Button size="sm">New Query</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline">Tables</Button>
        <Button size="sm" variant="outline">Queries</Button>
        <Button size="sm" variant="outline">Schema</Button>
        <Button size="sm" variant="outline">Backups</Button>
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        <div className="w-48 bg-gray-50 rounded-lg p-3 overflow-auto">
          <h3 className="text-xs font-semibold mb-2 text-gray-700 header-font">Tables</h3>
          <div className="space-y-1">
            {tables.map((table) => (
              <div key={table} className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer rounded text-sm">
                <Table className="w-4 h-4" />
                <span>{table}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <Card className="flex-1 p-4 overflow-auto">
            <h3 className="font-semibold mb-3 header-font">kanban_tasks</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 font-semibold header-font">id</th>
                  <th className="text-left p-2 font-semibold header-font">title</th>
                  <th className="text-left p-2 font-semibold header-font">status</th>
                  <th className="text-left p-2 font-semibold header-font">created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-mono text-xs">1</td>
                  <td className="p-2">Implement auth</td>
                  <td className="p-2">in_progress</td>
                  <td className="p-2 text-xs text-gray-600">2024-03-14</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono text-xs">2</td>
                  <td className="p-2">Deploy agents</td>
                  <td className="p-2">todo</td>
                  <td className="p-2 text-xs text-gray-600">2024-03-14</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <div className="mt-4 bg-gray-900 text-white rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 header-font">Query Console</h4>
            <div className="font-mono text-xs">
              <div className="text-gray-400">SELECT * FROM kanban_tasks WHERE status = 'in_progress';</div>
              <div className="mt-2 text-green-400">✓ Query executed successfully (2 rows)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
