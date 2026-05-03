"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Trash2, CreditCard as Edit2 } from 'lucide-react';
import { supabase, KanbanTask } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function KanbanWindow() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in_progress' | 'done' | 'backlog'>('backlog');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('kanban_tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    const tasksInColumn = tasks.filter(t => t.status === newTaskStatus);
    const maxPosition = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => t.position))
      : -1;

    const { data, error } = await supabase
      .from('kanban_tasks')
      .insert([{
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
        position: maxPosition + 1,
      }])
      .select()
      .maybeSingle();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    } else if (data) {
      setTasks([...tasks, data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('kanban_tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } else {
      setTasks(tasks.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done' | 'backlog') => {
    const { error } = await supabase
      .from('kanban_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  const handleDragStart = (task: KanbanTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: 'todo' | 'in_progress' | 'done' | 'backlog') => {
    if (draggedTask) {
      updateTaskStatus(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-100 text-gray-800';
      case 'todo': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
    { id: 'todo', title: 'To Do', status: 'todo' as const },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
    { id: 'done', title: 'Done', status: 'done' as const },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 header-font">Task Board</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="header-font">Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
              <select
                className="w-full p-2 border rounded"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as any)}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <Button onClick={addTask} className="w-full">Add Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4 flex-1 overflow-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col bg-gray-50 rounded-lg p-3"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
          >
            <h3 className="font-semibold text-sm mb-3 text-gray-700 header-font">{column.title}</h3>
            <div className="space-y-2 overflow-y-auto flex-1">
              {tasks
                .filter(task => task.status === column.status)
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="p-3 cursor-move hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 mb-1 truncate header-font">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <Badge className={`mt-2 text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
