import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Download, Trash2, Folder, FileText } from 'lucide-react';

export function FilesWindow() {
  const files = [
    { name: 'workflow-config.json', type: 'file', size: '2.3 KB', modified: '2h ago' },
    { name: 'agents', type: 'folder', size: '5 items', modified: '1d ago' },
    { name: 'research-data.csv', type: 'file', size: '145 KB', modified: '3h ago' },
    { name: 'models', type: 'folder', size: '12 items', modified: '2d ago' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Files</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline"><Upload className="w-4 h-4 mr-1" />Upload</Button>
          <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-1" />Download</Button>
        </div>
      </div>

      <div className="mb-3 text-sm text-gray-600">
        <span className="font-medium">Path:</span> /workspace/
      </div>

      <Card className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left p-3 font-semibold header-font">Name</th>
              <th className="text-left p-3 font-semibold header-font">Size</th>
              <th className="text-left p-3 font-semibold header-font">Modified</th>
              <th className="text-left p-3 font-semibold header-font">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {file.type === 'folder' ? (
                      <Folder className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-500" />
                    )}
                    <span>{file.name}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-600">{file.size}</td>
                <td className="p-3 text-gray-600">{file.modified}</td>
                <td className="p-3">
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
