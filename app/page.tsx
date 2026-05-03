"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, PanInfo, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Settings, Grid3x3, Chrome as Home, Radio, User, FileText, CirclePlay as PlayCircle, Bot, Workflow, Brain, Terminal, Code, Database, CloudCog, GitBranch, ChartLine as LineChart, MessagesSquare, Calendar, Folder, Clock, Zap, Maximize2, Minimize, Minus, X, Monitor, Image as ImageIcon, Square, Bell, Activity, Inbox, GitPullRequest, Cpu, DollarSign, TrendingUp, Package, Wrench, Users, LayoutGrid, Receipt, Sparkles, AlertTriangle, CheckSquare, BarChart3, Gauge, Radar, TrendingDown, Film, Network, Briefcase } from 'lucide-react';
import { WindowContent } from '@/components/windows/WindowContent';
import { WindowErrorBoundary } from '@/components/windows/WindowErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

const DOCK_RESERVE = 80;

function clampWindowToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
  sidebarWidth: number,
  viewportWidth?: number,
  viewportHeight?: number,
  bottomReserve: number = 0,
) {
  const vw = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1280);
  const rawVh = viewportHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 800);
  const vh = Math.max(1, rawVh - bottomReserve);
  const PREF_MIN_W = 240;
  const PREF_MIN_H = 160;
  const availW = Math.max(1, vw - sidebarWidth);
  const availH = Math.max(1, vh);
  const targetMinW = Math.min(PREF_MIN_W, availW);
  const targetMinH = Math.min(PREF_MIN_H, availH);
  const clampedW = Math.max(targetMinW, Math.min(width, availW));
  const clampedH = Math.max(targetMinH, Math.min(height, availH));
  const maxX = Math.max(sidebarWidth, vw - clampedW);
  const maxY = Math.max(0, vh - clampedH);
  const clampedX = Math.min(Math.max(sidebarWidth, x), maxX);
  const clampedY = Math.min(Math.max(0, y), maxY);
  return { x: clampedX, y: clampedY, width: clampedW, height: clampedH };
}

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
    'Money': false,
    'Production': false,
    'Quality': false,
    'Intelligence': false,
    'Creative': false,
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
    'Money': [
      { icon: DollarSign, label: 'Revenue Ticker', active: false, href: '#', content: 'revenue-ticker' },
      { icon: TrendingUp, label: 'Empire P&L', active: false, href: '#', content: 'empire-pnl' },
      { icon: Receipt, label: 'Cost & Profit', active: false, href: '#', content: 'cost-profit' },
      { icon: Zap, label: 'Make Money', active: false, href: '#', content: 'make-money' },
    ],
    'Production': [
      { icon: Sparkles, label: 'Built Overnight', active: false, href: '#', content: 'overnight-reel' },
      { icon: ImageIcon, label: 'Digital Goods', active: false, href: '#', content: 'digital-goods' },
      { icon: GitBranch, label: 'Pipeline Heatmap', active: false, href: '#', content: 'pipeline-heatmap' },
      { icon: AlertTriangle, label: 'Dead-Letter Inbox', active: false, href: '#', content: 'dead-letter' },
    ],
    'Quality': [
      { icon: CheckSquare, label: 'Approval Queue', active: false, href: '#', content: 'approval-queue' },
      { icon: BarChart3, label: 'Tastemaker Scores', active: false, href: '#', content: 'tastemaker-histogram' },
      { icon: Gauge, label: 'Brand Drift', active: false, href: '#', content: 'brand-drift' },
    ],
    'Intelligence': [
      { icon: Radar, label: 'Trend Radar', active: false, href: '#', content: 'trend-radar' },
      { icon: LineChart, label: 'Revenue Simulator', active: false, href: '#', content: 'revenue-simulator' },
      { icon: Calendar, label: 'Best-Time Heatmap', active: false, href: '#', content: 'best-time-heatmap' },
      { icon: TrendingDown, label: 'Churn Forecast', active: false, href: '#', content: 'churn-forecast' },
    ],
    'Creative': [
      { icon: Brain, label: 'LoRA Trainer', active: false, href: '#', content: 'lora-trainer' },
      { icon: Film, label: 'Video Motion Lab', active: false, href: '#', content: 'video-motion-lab' },
    ],
    'System': [
      { icon: Network, label: 'Agent Swarm Grid', active: false, href: '#', content: 'agent-swarm-grid' },
      { icon: Cpu, label: 'GPU Telemetry', active: false, href: '#', content: 'gpu-telemetry' },
      { icon: Briefcase, label: 'C-Suite Standup', active: false, href: '#', content: 'c-suite-standup' },
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

  useEffect(() => {
    const reposition = () => {
      const sidebarWidth = sidebarOpen ? 256 : 64;
      setWindows(prev => prev.map(w => {
        if (w.isMaximized && !w.isMinimized) {
          return {
            ...w,
            x: sidebarWidth,
            y: 0,
            width: window.innerWidth - sidebarWidth,
            height: window.innerHeight,
          };
        }
        const c = clampWindowToViewport(w.x, w.y, w.width, w.height, sidebarWidth, undefined, undefined, DOCK_RESERVE);
        if (c.x === w.x && c.y === w.y && c.width === w.width && c.height === w.height) return w;
        return { ...w, x: c.x, y: c.y, width: c.width, height: c.height };
      }));
    };
    reposition();
    window.addEventListener('resize', reposition);
    return () => window.removeEventListener('resize', reposition);
  }, [sidebarOpen]);

  const computeGridLayout = (slotsNeeded: number = 1) => {
    const sidebarWidth = sidebarOpen ? 256 : 64;
    const TOP_RESERVE = 20;
    const SIDE_PAD = 16;
    const GAP = 16;
    const MIN_WINDOW_WIDTH = 240;
    const MIN_WINDOW_HEIGHT = 160;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const availableWidth = Math.max(MIN_WINDOW_WIDTH, viewportWidth - sidebarWidth - SIDE_PAD);
    const maxZoneHeight = Math.max(MIN_WINDOW_HEIGHT + TOP_RESERVE, viewportHeight - 80);
    const availableHeight = Math.max(MIN_WINDOW_HEIGHT, maxZoneHeight - TOP_RESERVE);

    const maxCols = Math.max(1, Math.floor((availableWidth + GAP) / (MIN_WINDOW_WIDTH + GAP)));
    const maxRows = Math.max(1, Math.floor((availableHeight + GAP) / (MIN_WINDOW_HEIGHT + GAP)));

    const need = Math.max(1, slotsNeeded);
    let cols = Math.min(maxCols, Math.ceil(Math.sqrt(need * (availableWidth / availableHeight))));
    cols = Math.max(1, Math.min(maxCols, cols));
    let rows = Math.max(1, Math.ceil(need / cols));
    if (rows > maxRows) {
      rows = maxRows;
      cols = Math.max(1, Math.min(maxCols, Math.ceil(need / rows)));
    }

    const rawWindowWidth = (availableWidth - GAP * (cols - 1)) / cols;
    const rawWindowHeight = (availableHeight - GAP * (rows - 1)) / rows;
    const finalWidth = Math.max(1, Math.floor(Math.min(rawWindowWidth, 800)));
    const finalHeight = Math.max(1, Math.floor(Math.min(rawWindowHeight, 500)));

    const slotsPerZone = Math.max(1, cols * rows);

    const slotPosition = (slotIndex: number) => {
      const wrapped = ((slotIndex % slotsPerZone) + slotsPerZone) % slotsPerZone;
      const col = wrapped % cols;
      const row = Math.floor(wrapped / cols);
      const rawX = sidebarWidth + col * (finalWidth + GAP);
      const rawY = TOP_RESERVE + row * (finalHeight + GAP);
      const maxX = Math.max(sidebarWidth, viewportWidth - finalWidth);
      const maxY = Math.max(TOP_RESERVE, viewportHeight - finalHeight);
      const snappedX = snapToGrid(Math.min(Math.max(sidebarWidth, rawX), maxX));
      const snappedY = snapToGrid(Math.min(Math.max(TOP_RESERVE, rawY), maxY));
      return {
        x: Math.min(Math.max(0, snappedX), maxX),
        y: Math.min(Math.max(0, snappedY), maxY),
      };
    };

    return { width: finalWidth, height: finalHeight, slotPosition, slotsPerZone };
  };

  const openWindow = (item: typeof sidebarSections['Money'][0]) => {
    if (item.href !== '#') return;
    const owningSection = (Object.keys(sidebarSections) as Array<keyof typeof sidebarSections>).find(
      (s) => sidebarSections[s].some((it) => 'content' in it && it.content === item.content),
    );
    if (owningSection) {
      setExpandedSections((prev) => ({ ...prev, [owningSection as string]: true }));
    }

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
    const CASCADE_STEP = 40;
    const TOP_RESERVE = 20;
    const TARGET_CASCADE_COUNT = 10;
    const PREFERRED_WIDTH = 880;
    const PREFERRED_HEIGHT = 520;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startX = sidebarWidth;
    const startY = TOP_RESERVE;

    const heightBudget = vh - DOCK_RESERVE - startY - (TARGET_CASCADE_COUNT - 1) * CASCADE_STEP;
    const widthBudget = vw - startX - (TARGET_CASCADE_COUNT - 1) * CASCADE_STEP;
    const targetHeight = Math.max(160, Math.min(PREFERRED_HEIGHT, heightBudget));
    const targetWidth = Math.max(240, Math.min(PREFERRED_WIDTH, widthBudget));
    const baseSize = clampWindowToViewport(startX, startY, targetWidth, targetHeight, sidebarWidth, vw, vh, DOCK_RESERVE);

    const bottomLimit = vh - DOCK_RESERVE;
    const rightLimit = vw;

    const newId = `window-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const nextZ = highestZIndex + 1;

    setWindows(prev => {
      const visibleWindows = prev.filter(w => !w.isMinimized);
      const last = visibleWindows[visibleWindows.length - 1];

      let rawX: number;
      let rawY: number;
      if (last) {
        const candidateX = last.x + CASCADE_STEP;
        const candidateY = last.y + CASCADE_STEP;
        const fitsBottom = candidateY + baseSize.height <= bottomLimit;
        const fitsRight = candidateX + baseSize.width <= rightLimit;
        if (fitsBottom && fitsRight) {
          rawX = candidateX;
          rawY = candidateY;
        } else {
          rawX = startX;
          rawY = startY;
        }
      } else {
        rawX = startX;
        rawY = startY;
      }

      let placed = clampWindowToViewport(rawX, rawY, baseSize.width, baseSize.height, sidebarWidth, vw, vh, DOCK_RESERVE);

      if (placed.y + placed.height > bottomLimit || placed.x + placed.width > rightLimit) {
        const safeWidth = Math.min(placed.width, rightLimit - startX);
        const safeHeight = Math.min(placed.height, bottomLimit - startY);
        placed = clampWindowToViewport(startX, startY, safeWidth, safeHeight, sidebarWidth, vw, vh, DOCK_RESERVE);
      }

      const newWindow: WindowState = {
        id: newId,
        title: item.label,
        icon: item.icon,
        x: placed.x,
        y: placed.y,
        width: placed.width,
        height: placed.height,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        content: item.content || 'default',
      };

      return [...prev, newWindow];
    });
    setHighestZIndex(nextZ);
  };

  const tidyWindows = () => {
    const hasVisible = windows.some(w => !w.isMinimized);
    if (!hasVisible) return;

    const visibleCount = windows.filter(w => !w.isMinimized).length;
    const { width, height, slotPosition } = computeGridLayout(visibleCount);
    let slot = 0;
    setWindows(windows.map(w => {
      if (w.isMinimized) return w;
      const { x, y } = slotPosition(slot++);
      return {
        ...w,
        x,
        y,
        width,
        height,
        isMaximized: false,
        previousState: undefined,
      };
    }));
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
    const sidebarWidth = sidebarOpen ? 256 : 64;
    setWindows(windows.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        return {
          ...w,
          isMinimized: false,
          zIndex: highestZIndex + 1,
          x: sidebarWidth,
          y: 0,
          width: window.innerWidth - sidebarWidth,
          height: window.innerHeight,
        };
      }
      const c = clampWindowToViewport(w.x, w.y, w.width, w.height, sidebarWidth, undefined, undefined, DOCK_RESERVE);
      return { ...w, isMinimized: false, zIndex: highestZIndex + 1, x: c.x, y: c.y, width: c.width, height: c.height };
    }));
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
          const sidebarWidth = sidebarOpen ? 256 : 64;
          const px = w.previousState?.x ?? w.x;
          const py = w.previousState?.y ?? w.y;
          const pw = w.previousState?.width ?? 800;
          const ph = w.previousState?.height ?? 500;
          const c = clampWindowToViewport(px, py, pw, ph, sidebarWidth, undefined, undefined, DOCK_RESERVE);
          return {
            ...w,
            isMaximized: false,
            x: c.x,
            y: c.y,
            width: c.width,
            height: c.height,
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
            sidebarOpen={sidebarOpen}
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
            onClick={tidyWindows}
            disabled={!windows.some(w => !w.isMinimized)}
            className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Tidy Windows"
          >
            <LayoutGrid className="w-6 h-6 text-white" />
          </motion.button>

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
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>;
  windows: WindowState[];
  onContextMenu: (e: React.MouseEvent, windowId: string) => void;
  sidebarOpen: boolean;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
};

const MIN_WIN_W = 320;
const MIN_WIN_H = 200;
const SPRING = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.9 };

function Window({ window: win, onClose, onMinimize, onMaximize, bringToFront, setWindows, windows, onContextMenu, sidebarOpen }: WindowProps) {
  const sidebarWidth = sidebarOpen ? 256 : 64;

  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);
  const width = useMotionValue(win.width);
  const height = useMotionValue(win.height);

  const isGesturingRef = useRef(false);
  const didMountRef = useRef(false);

  // Sync motion values from props (skip while user is dragging/resizing).
  // First mount: snap without animation. Subsequent prop changes: smooth spring.
  useEffect(() => {
    if (isGesturingRef.current) return;
    if (!didMountRef.current) {
      didMountRef.current = true;
      x.set(win.x);
      y.set(win.y);
      width.set(win.width);
      height.set(win.height);
      return;
    }
    const ax = animate(x, win.x, SPRING);
    const ay = animate(y, win.y, SPRING);
    const aw = animate(width, win.width, SPRING);
    const ah = animate(height, win.height, SPRING);
    return () => { ax.stop(); ay.stop(); aw.stop(); ah.stop(); };
  }, [win.x, win.y, win.width, win.height, x, y, width, height]);

  const startTitleDrag = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    bringToFront(win.id);
    isGesturingRef.current = true;

    const startCX = e.clientX;
    const startCY = e.clientY;
    const baseX = x.get();
    const baseY = y.get();
    const w = width.get();
    const h = height.get();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    let raf = 0;
    let nextX = baseX;
    let nextY = baseY;
    const flush = () => {
      x.set(nextX);
      y.set(nextY);
      raf = 0;
    };
    const onMove = (ev: MouseEvent) => {
      const c = clampWindowToViewport(baseX + (ev.clientX - startCX), baseY + (ev.clientY - startCY), w, h, sidebarWidth, vw, vh, DOCK_RESERVE);
      nextX = c.x;
      nextY = c.y;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) cancelAnimationFrame(raf);
      flush();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      isGesturingRef.current = false;
      const fx = x.get();
      const fy = y.get();
      setWindows((prev: WindowState[]) => prev.map(w2 => w2.id === win.id ? { ...w2, x: fx, y: fy } : w2));
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const startResize = (e: React.MouseEvent, dir: ResizeDir) => {
    if (win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    bringToFront(win.id);
    isGesturingRef.current = true;

    const startCX = e.clientX;
    const startCY = e.clientY;
    const baseX = x.get();
    const baseY = y.get();
    const baseW = width.get();
    const baseH = height.get();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bottomLimit = vh - DOCK_RESERVE;

    document.body.style.cursor = RESIZE_CURSORS[dir];
    document.body.style.userSelect = 'none';

    let raf = 0;
    let nx = baseX, ny = baseY, nw = baseW, nh = baseH;
    const flush = () => {
      x.set(nx); y.set(ny); width.set(nw); height.set(nh);
      raf = 0;
    };
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startCX;
      const dy = ev.clientY - startCY;
      let newX = baseX, newY = baseY, newW = baseW, newH = baseH;

      if (dir.includes('e')) {
        newW = Math.max(MIN_WIN_W, Math.min(baseW + dx, vw - baseX));
      }
      if (dir.includes('s')) {
        newH = Math.max(MIN_WIN_H, Math.min(baseH + dy, bottomLimit - baseY));
      }
      if (dir.includes('w')) {
        const desiredW = Math.max(MIN_WIN_W, Math.min(baseW - dx, baseX + baseW - sidebarWidth));
        newW = desiredW;
        newX = baseX + (baseW - desiredW);
      }
      if (dir.includes('n')) {
        const desiredH = Math.max(MIN_WIN_H, Math.min(baseH - dy, baseY + baseH));
        newH = desiredH;
        newY = baseY + (baseH - desiredH);
      }

      nx = newX; ny = newY; nw = newW; nh = newH;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onUp = () => {
      if (raf) cancelAnimationFrame(raf);
      flush();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      isGesturingRef.current = false;
      const fx = x.get(), fy = y.get(), fw = width.get(), fh = height.get();
      setWindows((prev: WindowState[]) => prev.map(w2 => w2.id === win.id ? { ...w2, x: fx, y: fy, width: fw, height: fh } : w2));
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  if (win.isMinimized) return null;

  return (
    <motion.div
      onMouseDown={() => bringToFront(win.id)}
      onContextMenu={(e) => onContextMenu(e, win.id)}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="fixed rounded-xl overflow-hidden shadow-xl"
      style={{
        x,
        y,
        width,
        height,
        top: 0,
        left: 0,
        zIndex: win.zIndex,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.28)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
        willChange: 'transform, width, height',
      }}
    >
      <div
        onMouseDown={startTitleDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) onMaximize(win.id);
        }}
        className="h-10 border-b flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none relative z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          borderBottom: '1px solid rgba(209, 213, 219, 0.3)',
        }}
      >
        <div className="flex items-center gap-2 window-controls">
          <motion.button
            onClick={() => onClose(win.id)}
            className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Close"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
          </motion.button>
          <motion.button
            onClick={() => onMinimize(win.id)}
            className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
          </motion.button>
          <motion.button
            onClick={() => onMaximize(win.id)}
            className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Maximize"
          >
            <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm pointer-events-none">
          <win.icon className="w-4 h-4" />
          <span>{win.title}</span>
        </div>

        <div className="w-12" />
      </div>

      <div
        className="p-6 h-[calc(100%-40px)] overflow-auto relative z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <WindowErrorBoundary title={win.title}>
          <WindowContent content={win.content} title={win.title} />
        </WindowErrorBoundary>
      </div>

      {!win.isMaximized && (
        <>
          <div onMouseDown={(e) => startResize(e, 'n')} className="absolute top-0 left-3 right-3 h-1.5 cursor-ns-resize z-30" />
          <div onMouseDown={(e) => startResize(e, 's')} className="absolute bottom-0 left-3 right-3 h-1.5 cursor-ns-resize z-30" />
          <div onMouseDown={(e) => startResize(e, 'w')} className="absolute left-0 top-3 bottom-3 w-1.5 cursor-ew-resize z-30" />
          <div onMouseDown={(e) => startResize(e, 'e')} className="absolute right-0 top-3 bottom-3 w-1.5 cursor-ew-resize z-30" />
          <div onMouseDown={(e) => startResize(e, 'nw')} className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-40" />
          <div onMouseDown={(e) => startResize(e, 'ne')} className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-40" />
          <div onMouseDown={(e) => startResize(e, 'sw')} className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-40" />
          <div
            onMouseDown={(e) => startResize(e, 'se')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-40"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, transparent 55%, rgba(100,100,100,0.45) 55%, rgba(100,100,100,0.45) 100%)',
              borderBottomRightRadius: '0.75rem',
            }}
          />
        </>
      )}
    </motion.div>
  );
}
