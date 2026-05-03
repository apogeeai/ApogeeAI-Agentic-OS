"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Trash2, Settings, ChevronLeft, ChevronRight, Bell, Grid3x3, Chrome as Home, Radio, User, FileText, CirclePlay as PlayCircle, Bot, Workflow, Brain, Terminal, Code, Database, CloudCog, GitBranch, ChartLine as LineChart, MessagesSquare, Calendar, Folder, Clock, Zap, Search, CreditCard as Edit2, ArrowUpDown, Filter } from 'lucide-react';
import { supabase, KanbanTask } from '@/lib/supabase';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

type SortBy = 'manual' | 'title' | 'created';
type SortDir = 'asc' | 'desc';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in_progress' | 'done' | 'backlog'>('backlog');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  const [draggedOverTask, setDraggedOverTask] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('manual');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [reorderMode, setReorderMode] = useState(false);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    fetchTasks();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

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
      console.error('Error fetching tasks:', error);
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
        description: "Failed to create task",
        variant: "destructive",
      });
      console.error('Error adding task:', error);
    } else {
      setTasks([...tasks, data!]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully",
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
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done' | 'backlog') => {
    const tasksInColumn = tasks.filter(t => t.status === newStatus);
    const maxPosition = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => t.position))
      : -1;

    const { error } = await supabase
      .from('kanban_tasks')
      .update({
        status: newStatus,
        position: maxPosition + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      console.error('Error updating task:', error);
    } else {
      fetchTasks();
    }
  };

  const handleDragStart = (task: KanbanTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, taskId?: string) => {
    e.preventDefault();
    if (taskId) {
      setDraggedOverTask(taskId);
    }
  };

  const handleDrop = async (status: 'todo' | 'in_progress' | 'done' | 'backlog', targetTaskId?: string) => {
    if (!draggedTask) return;

    if (targetTaskId && draggedTask.id !== targetTaskId) {
      const targetTask = tasks.find(t => t.id === targetTaskId);
      if (targetTask && targetTask.status === draggedTask.status) {
        await reorderTasksWithinColumn(draggedTask.id, targetTaskId, draggedTask.status);
      } else if (targetTask) {
        await updateTaskStatus(draggedTask.id, targetTask.status);
      }
    } else if (draggedTask.status !== status) {
      await updateTaskStatus(draggedTask.id, status);
    }

    setDraggedTask(null);
    setDraggedOverTask(null);
  };

  const reorderTasksWithinColumn = async (draggedId: string, targetId: string, status: KanbanTask['status']) => {
    const columnTasks = tasks.filter(t => t.status === status).sort((a, b) => a.position - b.position);
    const draggedIndex = columnTasks.findIndex(t => t.id === draggedId);
    const targetIndex = columnTasks.findIndex(t => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const reordered = [...columnTasks];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const updates = reordered.map((task, index) =>
      supabase
        .from('kanban_tasks')
        .update({ position: index })
        .eq('id', task.id)
    );

    await Promise.all(updates);
    await fetchTasks();
  };

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done' | 'backlog') => {
    let filtered = tasks.filter(task => task.status === status);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query) ?? false)
      );
    }

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'manual':
          cmp = a.position - b.position;
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'created':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return filtered;
  };

  const startEdit = (task: KanbanTask) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const saveEdit = async () => {
    if (!editingTask || !editTitle.trim()) return;

    const { error } = await supabase
      .from('kanban_tasks')
      .update({
        title: editTitle,
        description: editDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingTask);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } else {
      setTasks(tasks.map(t =>
        t.id === editingTask
          ? { ...t, title: editTitle, description: editDescription }
          : t
      ));
      setEditingTask(null);
      setEditTitle('');
      setEditDescription('');
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
  };

  const moveTask = async (taskId: string, direction: 'up' | 'down') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const columnTasks = getTasksByStatus(task.status).sort((a, b) => a.position - b.position);
    const currentIndex = columnTasks.findIndex(t => t.id === taskId);

    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === columnTasks.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reordered = [...columnTasks];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];

    const updates = reordered.map((t, index) =>
      supabase
        .from('kanban_tasks')
        .update({ position: index })
        .eq('id', t.id)
    );

    await Promise.all(updates);
    await fetchTasks();

    const newTask = taskRefs.current.get(taskId);
    newTask?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!reorderMode || !focusedTaskId) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveTask(focusedTaskId, 'up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveTask(focusedTaskId, 'down');
      } else if (e.key === 'Escape') {
        setReorderMode(false);
        setFocusedTaskId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reorderMode, focusedTaskId]);

  const columns = [
    { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
    { id: 'todo', title: 'To Do', status: 'todo' as const },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
    { id: 'done', title: 'Done', status: 'done' as const },
  ];

  const sidebarItems = [
    { icon: Bot, label: 'Agents', active: false, href: '/' },
    { icon: Grid3x3, label: 'Kanban', active: true, href: '/kanban' },
    { icon: Grid3x3, label: 'Desktop', active: false, href: '/desktop' },
    { icon: Workflow, label: 'Workflows', active: false, href: '#' },
    { icon: Brain, label: 'AI Models', active: false, href: '#' },
    { icon: Terminal, label: 'Terminal', active: false, href: '#' },
    { icon: Code, label: 'Code Editor', active: false, href: '#' },
    { icon: Database, label: 'Database', active: false, href: '#' },
    { icon: CloudCog, label: 'Cloud Services', active: false, href: '#' },
    { icon: GitBranch, label: 'Version Control', active: false, href: '#' },
    { icon: LineChart, label: 'Analytics', active: false, href: '#' },
    { icon: MessagesSquare, label: 'Chat', active: false, href: '#' },
    { icon: Calendar, label: 'Schedule', active: false, href: '#' },
    { icon: Folder, label: 'Files', active: false, href: '#' },
    { icon: Clock, label: 'History', active: false, href: '#' },
    { icon: Zap, label: 'Automations', active: false, href: '#' },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden min-w-[430px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/450035/pexels-photo-450035.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      <aside
        className={`fixed left-0 top-0 h-full bg-white/10 backdrop-blur-xl border-r border-white/20 z-20 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            {sidebarOpen && (
              <h2 className="text-white font-bold text-lg">Agent Tools</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all ml-auto"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-white" />
              ) : (
                <ChevronRight className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all ${
                  item.active ? 'bg-white/15 text-white' : ''
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-white/20">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-all rounded-lg`}
              title={!sidebarOpen ? 'Settings' : ''}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">Settings</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      <div className={`relative z-10 min-h-screen p-4 md:p-6 lg:p-8 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        <header className="flex flex-col gap-4 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    Kanban Board
                  </h1>
                  <p className="text-white/80 text-sm md:text-base drop-shadow-md">
                    Manage your tasks with drag and drop
                  </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Add Task</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-white/80 mb-2 block">Title</label>
                        <Input
                          placeholder="Task title"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/80 mb-2 block">Description</label>
                        <Textarea
                          placeholder="Task description"
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/80 mb-2 block">Status</label>
                        <select
                          value={newTaskStatus}
                          onChange={(e) => setNewTaskStatus(e.target.value as 'todo' | 'in_progress' | 'done' | 'backlog')}
                          className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                      <Button
                        onClick={addTask}
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        Create Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:w-auto lg:max-w-[700px]">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 shadow-xl row-span-2">
                <p className="text-white/60 text-xs mb-1">Revenue Today</p>
                <p className="text-white text-2xl font-bold">$198</p>
                <p className="text-white/50 text-xs mt-1">$1,824 This Month</p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 shadow-xl">
                <p className="text-white/60 text-xs mb-1">Active Tasks</p>
                <p className="text-white text-2xl font-bold">{tasks.filter(t => t.status === 'in_progress').length}</p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 shadow-xl">
                <p className="text-white/60 text-xs mb-1">Completed</p>
                <p className="text-white text-2xl font-bold">{tasks.filter(t => t.status === 'done').length}</p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 shadow-xl">
                <p className="text-white/60 text-xs mb-1">Backlog</p>
                <p className="text-white text-2xl font-bold">{tasks.filter(t => t.status === 'backlog').length}</p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 shadow-xl">
                <p className="text-white/60 text-xs mb-1">To Do</p>
                <p className="text-white text-2xl font-bold">{tasks.filter(t => t.status === 'todo').length}</p>
              </Card>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <Search className="w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder:text-white/50 outline-none text-sm w-48"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-3 py-2 text-sm"
            >
              <option value="manual">Manual Order</option>
              <option value="title">Sort by Title</option>
              <option value="created">Sort by Date</option>
            </select>

            {sortBy !== 'manual' && (
              <button
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                title={`Sort ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
              >
                <ArrowUpDown className={`w-4 h-4 text-white ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            )}

            <button
              onClick={() => setReorderMode(!reorderMode)}
              className={`px-4 py-2 rounded-xl transition-colors text-sm ${
                reorderMode
                  ? 'bg-indigo-500/50 text-white border-2 border-indigo-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
              disabled={sortBy !== 'manual'}
            >
              {reorderMode ? 'Exit Reorder' : 'Reorder Mode'}
            </button>

            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/20">
                Total: {tasks.length}
              </Badge>
            </div>
          </div>

          {reorderMode && (
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-white text-sm">
              Reorder mode active. Click a task to focus, then use ↑/↓ arrows to move it. Press Escape to exit.
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-32">
          {columns.map((column) => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.status)}
              className="flex flex-col"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 mb-4 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-2">{column.title}</h2>
                <p className="text-white/60 text-sm">{getTasksByStatus(column.status).length} tasks</p>
              </Card>

              <div className="space-y-3 flex-1 min-h-[200px]">
                {getTasksByStatus(column.status).map((task) => {
                  const isEditing = editingTask === task.id;
                  const isDragging = draggedTask?.id === task.id;
                  const isDraggedOver = draggedOverTask === task.id;

                  return (
                    <Card
                      key={task.id}
                      ref={(el) => {
                        if (el) taskRefs.current.set(task.id, el);
                      }}
                      draggable={!isEditing && sortBy === 'manual'}
                      onDragStart={() => handleDragStart(task)}
                      onDragOver={(e) => handleDragOver(e, task.id)}
                      onDrop={() => handleDrop(task.status, task.id)}
                      tabIndex={reorderMode ? 0 : -1}
                      onFocus={() => setFocusedTaskId(task.id)}
                      onBlur={() => setFocusedTaskId(null)}
                      className={`bg-white/10 backdrop-blur-xl border-white/20 p-4 shadow-xl transition-all group ${
                        !isEditing && sortBy === 'manual' ? 'cursor-move' : ''
                      } ${isDragging ? 'opacity-50' : ''} ${
                        isDraggedOver ? 'border-indigo-400 border-2' : ''
                      } ${reorderMode && focusedTaskId === task.id ? 'ring-2 ring-indigo-400' : ''} ${
                        !isEditing ? 'hover:bg-white/15' : ''
                      }`}
                    >
                      {!isEditing ? (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              {sortBy === 'manual' && (
                                <GripVertical className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                              )}
                              <h3 className="text-white font-semibold">{task.title}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(task)}
                                className="p-1 hover:bg-white/20 rounded"
                                title="Edit task"
                              >
                                <Edit2 className="w-4 h-4 text-white/70" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 hover:bg-white/20 rounded"
                                title="Delete task"
                              >
                                <Trash2 className="w-4 h-4 text-white/70 hover:text-red-400" />
                              </button>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-white/70 text-sm pl-7">{task.description}</p>
                          )}
                          <div className="flex gap-1 mt-3 pl-7">
                            {[0, 1, 2].map(i => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white/80' : 'bg-white/30'}`} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="Task title"
                            autoFocus
                          />
                          <Textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="Task description"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={saveEdit}
                              size="sm"
                              className="bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}

                {getTasksByStatus(column.status).length === 0 && (
                  <div className="text-center py-8 text-white/50 text-sm">
                    {searchQuery ? 'No matching tasks' : 'Drop tasks here'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>


        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="flex gap-2 bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2.5 border border-white/20 shadow-2xl">
            {[
              { icon: Home, active: false, href: '/' },
              { icon: Grid3x3, active: true, href: '/kanban' },
              { icon: Radio, active: false, href: '#' },
              { icon: User, active: false, href: '#' },
              { icon: FileText, active: false, href: '#' },
              { icon: PlayCircle, active: false, href: '#' },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`p-2.5 rounded-xl transition-all ${
                  item.active
                    ? 'bg-white/20 text-white shadow-lg scale-110'
                    : 'text-white/50 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
