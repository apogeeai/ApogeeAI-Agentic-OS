"use client";

import { useState } from 'react';
import { Film, Play, Loader2, Check, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type JobStatus = 'pending' | 'running' | 'done';

interface Job {
  id: string;
  title: string;
  tenant: string;
  status: JobStatus;
  progress?: number;
  duration?: string;
  before: string;
  after: string;
  frames: string[];
}

const FRAME_BASES = [
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1', title: 'Persona V6 — neon walk', tenant: 'Digital Influencer', status: 'done', duration: '4.8s',
    before: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: Array.from({ length: 8 }).map((_, i) => `${FRAME_BASES[i % FRAME_BASES.length]}&v=${i}`),
  },
  {
    id: 'j2', title: 'Album cover — slow zoom', tenant: 'Synaptive Sounds', status: 'done', duration: '6.1s',
    before: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: Array.from({ length: 8 }).map((_, i) => `${FRAME_BASES[(i + 1) % FRAME_BASES.length]}&v=a${i}`),
  },
  {
    id: 'j3', title: 'Etsy listing — orbit cam', tenant: 'Digital Products', status: 'running', progress: 62,
    before: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: [],
  },
  {
    id: 'j4', title: 'Ad cutdown — push-in', tenant: 'LocalBiz', status: 'pending',
    before: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: [],
  },
  {
    id: 'j5', title: 'Reel — handheld parallax', tenant: 'Digital Influencer', status: 'pending',
    before: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: [],
  },
];

const STATUS_BADGE: Record<JobStatus, string> = {
  pending: 'bg-gray-500/80',
  running: 'bg-blue-500/80',
  done: 'bg-emerald-500/80',
};

function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/60 select-none">
        <img src={before} alt="before" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <img
          src={after}
          alt="after"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          draggable={false}
        />
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md" style={{ left: `${pos}%` }} />
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BEFORE</div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AFTER</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="w-full mt-2 accent-emerald-600"
      />
    </div>
  );
}

export function VideoMotionLab() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['j1']));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const regenerate = (j: Job) => {
    // TODO: POST to ltx2/regenerate { jobId, motion_only: true }
    setJobs((prev) => prev.map((x) => x.id === j.id ? { ...x, status: 'running', progress: 0 } : x));
    toast({ title: 'Regenerating motion', description: `${j.title} • motion-only pass` });
  };

  const counts = {
    pending: jobs.filter((j) => j.status === 'pending').length,
    running: jobs.filter((j) => j.status === 'running').length,
    done: jobs.filter((j) => j.status === 'done').length,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Film className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Video Motion Lab</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">LTX2 / Wan • Mock</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(['pending', 'running', 'done'] as JobStatus[]).map((s) => (
          <div key={s} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-gray-600">{s}</div>
            <div className="text-lg font-bold text-gray-900">{counts[s]}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {jobs.map((j) => {
          const isOpen = expanded.has(j.id);
          const StatusIcon = j.status === 'done' ? Check : j.status === 'running' ? Loader2 : Play;
          return (
            <div key={j.id} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden">
              <button
                onClick={() => toggle(j.id)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/40 text-left"
              >
                {isOpen ? <ChevronDown className="w-4 h-4 text-gray-700" /> : <ChevronRight className="w-4 h-4 text-gray-700" />}
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${STATUS_BADGE[j.status]}`}>
                  <StatusIcon className={`w-3 h-3 ${j.status === 'running' ? 'animate-spin' : ''}`} />
                  {j.status}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">{j.title}</div>
                  <div className="text-[10px] text-gray-600">{j.tenant}{j.duration ? ` • ${j.duration}` : ''}</div>
                </div>
                {j.status === 'running' && j.progress !== undefined && (
                  <div className="w-24 bg-white/60 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${j.progress}%` }} />
                  </div>
                )}
              </button>

              {isOpen && (
                <div className="border-t border-white/50 p-3 space-y-3">
                  {j.status === 'done' && j.frames.length > 0 && (
                    <>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">Frames</div>
                        <div className="flex gap-1 overflow-x-auto pb-1">
                          {j.frames.map((f, i) => (
                            <div key={i} className="relative shrink-0">
                              <img src={f} alt={`frame ${i}`} className="w-16 h-12 object-cover rounded border border-white/60" />
                              <div className="absolute bottom-0 left-0 bg-black/70 text-white text-[8px] px-1 rounded-tr">
                                {String(i + 1).padStart(2, '0')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <BeforeAfter before={j.before} after={j.after} />
                      <button
                        onClick={() => regenerate(j)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded bg-violet-600 text-white hover:bg-violet-700"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate motion only
                      </button>
                    </>
                  )}
                  {j.status !== 'done' && (
                    <div className="text-[11px] text-gray-700 italic">
                      {j.status === 'running' ? 'Sampling motion frames…' : 'Queued — waiting for GPU slot.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
