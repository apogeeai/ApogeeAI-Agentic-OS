"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Settings, Grid3x3, Chrome as Home, Radio, User, FileText, CirclePlay as PlayCircle, Bot, Workflow, Brain, Terminal, Code, Database, CloudCog, GitBranch, ChartLine as LineChart, MessagesSquare, Calendar, Folder, Clock, Zap, Maximize2, Minimize, Minus, X, Monitor, Image as ImageIcon, Square, Bell, Activity, Inbox, GitPullRequest, Cpu, DollarSign, TrendingUp, Package, Wrench, Users } from 'lucide-react';
import { WindowContent } from '@/components/windows/WindowContent';
import { Toaster } from '@/components/ui/toaster';

interface WindowState {
  id: string;
  title: string;
  icon: any;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  content: string;
  previousState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function Desktop() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(1);
  const [minimizedWindows, setMinimizedWindows] = useState<WindowState[]>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; windowId: string } | null>(null);
  const [greenNoiseEnabled, setGreenNoiseEnabled] = useState(false);
  const greenNoiseRef = useRef<HTMLAudioElement | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Dashboard': true,
    'Projects': true,
    'Development': true,
    'Collaboration': false,
    'System': false,
  });

  const backgrounds = [
    'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1229042/pexels-photo-1229042.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!greenNoiseRef.current) {
        greenNoiseRef.current = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAA=');
        greenNoiseRef.current.loop = true;
      }
    }
  }, []);

  useEffect(() => {
    if (greenNoiseRef.current) {
      if (greenNoiseEnabled) {
        greenNoiseRef.current.play().catch(() => {});
      } else {
        greenNoiseRef.current.pause();
      }
    }
  }, [greenNoiseEnabled]);

  const changeBg = () => {
    setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const sidebarSections = {
    'Dashboard': [
      { icon: Monitor, label: 'Desktop', active: true, href: '/' },
      { icon: Activity, label: 'Director Status', active: false, href: '#', content: 'director-status' },
      { icon: Bell, label: 'Notifications', active: false, href: '#', content: 'notifications' },
    ],
    'Projects': [
      { icon: FileText, label: 'Task Ledger', active: false, href: '#', content: 'task-ledger' },
      { icon: Inbox, label: 'Approval Inbox', active: false, href: '#', content: 'approval-inbox' },
      { icon: TrendingUp, label: 'Pipeline Flow', active: false, href: '#', content: 'pipeline-flow' },
      { icon: Grid3x3, label: 'Kanban', active: false, href: '#', content: 'kanban' },
      { icon: GitPullRequest, label: 'Wiggum Loop', active: false, href: '#', content: 'wiggum-loop' },
      { icon: DollarSign, label: 'Revenue Tracker', active: false, href: '#', content: 'revenue-tracker' },
    ],
    'Development': [
      { icon: Terminal, label: 'Terminal', active: false, href: '#', content: 'terminal' },
      { icon: Code, label: 'Code Editor', active: false, href: '#', content: 'code-editor' },
      { icon: Database, label: 'Database', active: false, href: '#', content: 'database' },
      { icon: GitBranch, label: 'Version Control', active: false, href: '#', content: 'version-control' },
      { icon: CloudCog, label: 'Cloud Services', active: false, href: '#', content: 'cloud-services' },
    ],
    'Collaboration': [
      { icon: MessagesSquare, label: 'Chat', active: false, href: '#', content: 'chat' },
      { icon: Calendar, label: 'Schedule', active: false, href: '#', content: 'schedule' },
      { icon: Folder, label: 'Files', active: false, href: '#', content: 'files' },
    ],
    'System': [
      { icon: Workflow, label: 'Workflows', active: false, href: '#', content: 'workflows' },
      { icon: Brain, label: 'AI Models', active: false, href: '#', content: 'ai-models' },
      { icon: Cpu, label: 'GPU Monitor', active: false, href: '#', content: 'gpu-monitor' },
      { icon: LineChart, label: 'Analytics', active: false, href: '#', content: 'analytics' },
      { icon: Clock, label: 'History', active: false, href: '#', content: 'history' },
      { icon: Zap, label: 'Automations', active: false, href: '#', content: 'automations' },
    ],
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const GRID_SIZE = 20;

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const openWindow = (item: typeof sidebarSections['Dashboard'][0]) => {
    if (item.href !== '#') return;

    const existingWindow = windows.find(w => w.content === item.content);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id);
      } else {
        bringToFront(existingWindow.id);
      }
      return;
    }

    const sidebarWidth = sidebarOpen ? 256 : 64;
    const TOP_RESERVE = 20;
    const SIDE_PAD = 16;
    const GAP = 16;
    const MIN_WINDOW_WIDTH = 320;
    const MIN_WINDOW_HEIGHT = 200;
    const TARGET_WINDOW_WIDTH = 480;
    const TARGET_WINDOW_HEIGHT = 320;
    const MIN_ROWS = 2;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const minZoneForRows = MIN_ROWS * MIN_WINDOW_HEIGHT + (MIN_ROWS - 1) * GAP + TOP_RESERVE;
    const maxZone = Math.max(MIN_WINDOW_HEIGHT + TOP_RESERVE, viewportHeight - 80);
    const topZoneHeight = Math.min(maxZone, Math.max(viewportHeight * 0.4, minZoneForRows));
    const availableWidth = Math.max(MIN_WINDOW_WIDTH, viewportWidth - sidebarWidth - SIDE_PAD);
    const availableHeight = Math.max(MIN_WINDOW_HEIGHT, topZoneHeight - TOP_RESERVE);

    const cols = Math.max(1, Math.floor((availableWidth + GAP) / (MIN_WINDOW_WIDTH + GAP)));
    const rawWindowWidth = (availableWidth - GAP * (cols - 1)) / cols;
    const widthCap = Math.max(1, viewportWidth - sidebarWidth - SIDE_PAD);
    const windowWidth = Math.max(1, Math.min(widthCap, TARGET_WINDOW_WIDTH, Math.max(MIN_WINDOW_WIDTH, rawWindowWidth)));

    const rows = Math.max(1, Math.floor((availableHeight + GAP) / (MIN_WINDOW_HEIGHT + GAP)));
    const rawWindowHeight = (availableHeight - GAP * (rows - 1)) / rows;
    const heightCap = Math.max(1, viewportHeight - TOP_RESERVE);
    const windowHeight = Math.max(1, Math.min(heightCap, TARGET_WINDOW_HEIGHT, Math.max(MIN_WINDOW_HEIGHT, rawWindowHeight)));

    const slotsPerZone = Math.max(1, cols * rows);
    const visibleCount = windows.filter(w => !w.isMinimized).length;
    const slotIndex = visibleCount % slotsPerZone;
    const col = slotIndex % cols;
    const row = Math.floor(slotIndex / cols);

    const finalWidth = Math.floor(windowWidth);
    const finalHeight = Math.floor(windowHeight);
    const rawX = sidebarWidth + col * (finalWidth + GAP);
    const rawY = TOP_RESERVE + row * (finalHeight + GAP);
    const maxX = Math.max(sidebarWidth, viewportWidth - finalWidth);
    const maxY = Math.max(TOP_RESERVE, viewportHeight - finalHeight);
    const snappedX = snapToGrid(Math.min(Math.max(sidebarWidth, rawX), maxX));
    const snappedY = snapToGrid(Math.min(Math.max(TOP_RESERVE, rawY), maxY));
    const finalX = Math.min(Math.max(0, snappedX), maxX);
    const finalY = Math.min(Math.max(0, snappedY), maxY);

    const newWindow: WindowState = {
      id: `window-${Date.now()}`,
      title: item.label,
      icon: item.icon,
      x: finalX,
      y: finalY,
      width: finalWidth,
      height: finalHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: highestZIndex + 1,
      content: item.content || 'default',
    };

    setWindows([...windows, newWindow]);
    setHighestZIndex(highestZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const restoreWindow = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(highestZIndex + 1);
  };

  const bringToFront = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(highestZIndex + 1);
  };

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => {
      if (w.id === id) {
        if (w.isMaximized) {
          return {
            ...w,
            isMaximized: false,
            x: w.previousState?.x || w.x,
            y: w.previousState?.y || w.y,
            width: w.previousState?.width || 800,
            height: w.previousState?.height || 500,
          };
        } else {
          const sidebarWidth = sidebarOpen ? 256 : 64;
          return {
            ...w,
            isMaximized: true,
            previousState: {
              x: w.x,
              y: w.y,
              width: w.width,
              height: w.height,
            },
            x: sidebarWidth,
            y: 0,
            width: window.innerWidth - sidebarWidth,
            height: window.innerHeight,
          };
        }
      }
      return w;
    }));
  };

  const handleContextMenu = (e: React.MouseEvent, windowId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, windowId });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url(${backgrounds[currentBgIndex]})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30" />

      <aside
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
        style={{
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRight: '1px solid rgba(209, 213, 219, 0.3)',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(209, 213, 219, 0.3)' }}>
            {sidebarOpen && (
              <h2 className="text-white font-bold text-lg header-font">Agent Tools</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/20 transition-all ml-auto"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-white" />
              ) : (
                <ChevronRight className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {Object.entries(sidebarSections).map(([section, items]) => (
              <div key={section} className="mb-1">
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  {sidebarOpen ? (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-wider">{section}</span>
                      {expandedSections[section] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-px bg-white/20 my-1" />
                  )}
                </button>

                {expandedSections[section] && items.map((item, index) => (
                  item.href === '#' ? (
                    <button
                      key={index}
                      onClick={() => openWindow(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-all ${
                        item.active ? 'bg-white/15 text-white' : ''
                      }`}
                      title={!sidebarOpen ? item.label : ''}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      key={index}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-all ${
                        item.active ? 'bg-white/15 text-white' : ''
                      }`}
                      title={!sidebarOpen ? item.label : ''}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  )
                ))}
              </div>
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

      <div className="fixed top-0 right-4 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-b-2xl px-6 py-3 shadow-lg">
        <div className="text-white text-center">
          <div className="text-lg font-semibold" suppressHydrationWarning>{currentTime ? formatTime(currentTime) : '--:-- --'}</div>
          <div className="text-xs text-white/80" suppressHydrationWarning>{currentTime ? formatDate(currentTime) : ''}</div>
        </div>
      </div>

      <div className={`relative h-screen transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        {windows.map((window) => (
          <Window
            key={window.id}
            window={window}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            bringToFront={bringToFront}
            setWindows={setWindows}
            windows={windows}
            onContextMenu={handleContextMenu}
          />
        ))}

        {windows.length > 0 && (
          <div
            className="fixed bottom-2 left-1/2 -translate-x-1/2 flex gap-2 rounded-2xl px-3 py-2 shadow-2xl"
            style={{
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              backgroundColor: 'rgba(255, 255, 255, 0.28)',
              border: '1px solid rgba(209, 213, 219, 0.3)',
            }}
          >
            {windows.map(w => (
              <motion.div
                key={w.id}
                className="relative"
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <button
                  onClick={() => {
                    if (w.isMinimized) {
                      restoreWindow(w.id);
                    } else {
                      bringToFront(w.id);
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, w.id)}
                  className="flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all group relative"
                  title={w.title}
                >
                  <w.icon className="w-12 h-12 text-white drop-shadow-lg" />
                  <span className="text-white text-[11px] font-medium mt-0.5 max-w-[64px] truncate drop-shadow">
                    {w.title}
                  </span>
                  {!w.isMinimized && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-lg" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {contextMenu && (
          <div
            className="fixed rounded-lg shadow-2xl py-1 z-[9999]"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 160),
              bottom: window.innerHeight - contextMenu.y + 10,
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(209, 213, 219, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                minimizeWindow(contextMenu.windowId);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Minimize className="w-4 h-4" />
              Minimize
            </button>
            <button
              onClick={() => {
                maximizeWindow(contextMenu.windowId);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Maximize
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => {
                closeWindow(contextMenu.windowId);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        )}

        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <motion.button
            onClick={changeBg}
            className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Change Background"
          >
            <ImageIcon className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={() => setGreenNoiseEnabled(!greenNoiseEnabled)}
            className={`p-4 backdrop-blur-xl border border-white/20 rounded-2xl transition-all shadow-lg ${
              greenNoiseEnabled ? 'bg-green-500/40' : 'bg-white/10 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Green Noise"
          >
            <Radio className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  bringToFront: (id: string) => void;
  setWindows: (windows: WindowState[]) => void;
  windows: WindowState[];
  onContextMenu: (e: React.MouseEvent, windowId: string) => void;
}

function Window({ window, onClose, onMinimize, onMaximize, bringToFront, setWindows, windows, onContextMenu }: WindowProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const GRID_SIZE = 20;

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    bringToFront(window.id);
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.width,
      height: window.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = snapToGrid(Math.max(400, resizeStart.width + deltaX));
        const newHeight = snapToGrid(Math.max(300, resizeStart.height + deltaY));

        setWindows(windows.map(w =>
          w.id === window.id ? { ...w, width: newWidth, height: newHeight } : w
        ));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, window.id, windows, setWindows]);

  if (window.isMinimized) return null;

  return (
    <motion.div
      drag={!window.isMaximized}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      onMouseDown={(e) => {
        if (!(e.target as HTMLElement).closest('.resize-handle')) {
          bringToFront(window.id);
        }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: window.x,
        y: window.y
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      onDragEnd={(event, info) => {
        if (!window.isMaximized) {
          const newX = snapToGrid(window.x + info.offset.x);
          const newY = snapToGrid(window.y + info.offset.y);
          setWindows(windows.map(w =>
            w.id === window.id ? { ...w, x: newX, y: newY } : w
          ));
        }
      }}
      className="fixed rounded-xl overflow-hidden shadow-xl"
      style={{
        width: `${window.width}px`,
        height: `${window.height}px`,
        zIndex: window.zIndex,
        position: 'relative',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.28)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}
    >

      <motion.div
        className="h-10 border-b flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none relative z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          borderBottom: '1px solid rgba(209, 213, 219, 0.3)',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="flex items-center gap-2 window-controls">
          <motion.button
            onClick={() => onClose(window.id)}
            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Close"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
          </motion.button>
          <motion.button
            onClick={() => onMinimize(window.id)}
            className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
          </motion.button>
          <motion.button
            onClick={() => onMaximize(window.id)}
            className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Maximize"
          >
            <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
          <window.icon className="w-4 h-4" />
          <span>{window.title}</span>
        </div>

        <div className="w-12" />
      </motion.div>

      <div
        className="p-6 h-[calc(100%-40px)] overflow-auto relative z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <WindowContent content={window.content} title={window.title} />
      </div>

      {!window.isMaximized && (
        <motion.div
          className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-30"
          onMouseDown={handleResizeMouseDown}
          whileHover={{ scale: 1.1 }}
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(100,100,100,0.5) 50%, rgba(100,100,100,0.5) 100%)',
            borderBottomRightRadius: '0.75rem',
          }}
        />
      )}
    </motion.div>
  );
}
