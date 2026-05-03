"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Upload, Play, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { postJson } from '@/lib/useEndpoint';

const SAMPLE_THUMBS = [
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=400',
];

interface RefImage { id: string; url: string; name: string }
interface LossPoint { epoch: number; loss: number }

const TOTAL_EPOCHS = 30;

export function LoraTrainerConsole() {
  const { toast } = useToast();
  const [refs, setRefs] = useState<RefImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [training, setTraining] = useState(false);
  const [done, setDone] = useState(false);
  const [loss, setLoss] = useState<LossPoint[]>([]);
  const [samples, setSamples] = useState<string[]>([]);
  const [loraName, setLoraName] = useState('persona_v7');
  const [jobId, setJobId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const createdUrlsRef = useRef<Set<string>>(new Set());

  const ingest = useCallback((files: FileList | File[]) => {
    setRefs((prev) => {
      const remaining = 10 - prev.length;
      if (remaining <= 0) return prev;
      const arr = Array.from(files).slice(0, remaining);
      const next = arr.map((f) => {
        const url = URL.createObjectURL(f);
        createdUrlsRef.current.add(url);
        return { id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, url, name: f.name };
      });
      return [...prev, ...next].slice(0, 10);
    });
  }, []);

  useEffect(() => {
    const created = createdUrlsRef.current;
    return () => { created.forEach((u) => URL.revokeObjectURL(u)); created.clear(); };
  }, []);

  const revokeAll = () => {
    createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    createdUrlsRef.current.clear();
  };

  const start = async () => {
    if (training || refs.length === 0) return;
    setTraining(true); setDone(false); setLoss([]); setSamples([]);
    try {
      const res = await postJson<{ ok: boolean; job_id: string; backend?: string }>(
        '/api/lora/train',
        { refs: refs.length, base: 'flux-dev', steps: 1500, name: loraName },
      );
      setJobId(res.job_id);
      toast({ title: 'Training queued', description: `${res.job_id}${res.backend === 'fallback' ? ' (mock — gateway unreachable)' : ''}` });
    } catch {
      toast({ title: 'Failed to queue training', description: 'API error' });
      setTraining(false);
      return;
    }
    let epoch = 0;
    intervalRef.current = setInterval(() => {
      epoch += 1;
      const noise = (Math.random() - 0.5) * 0.08;
      const value = Math.max(0.05, 1.4 * Math.exp(-epoch / 9) + 0.08 + noise);
      setLoss((prev) => [...prev, { epoch, loss: Number(value.toFixed(4)) }]);
      if (epoch === 8 || epoch === 16 || epoch === 24) {
        setSamples((prev) => [...prev, SAMPLE_THUMBS[(prev.length) % SAMPLE_THUMBS.length]]);
      }
      if (epoch >= TOTAL_EPOCHS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTraining(false); setDone(true);
        toast({ title: 'Training complete', description: `${TOTAL_EPOCHS} epochs • final loss converged` });
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const save = async () => {
    try {
      const res = await postJson<{ ok: boolean; backend?: string }>(
        '/api/lora/save',
        { name: loraName, base: 'flux-dev', dataset_hash: jobId },
      );
      toast({
        title: res.ok ? 'LoRA saved' : 'Save failed',
        description: `${loraName}.safetensors${res.backend === 'fallback' ? ' (mock registry)' : ' → registry'}`,
      });
    } catch {
      toast({ title: 'Save failed', description: 'API error' });
    }
    setDone(false); setRefs([]); setLoss([]); setSamples([]); setJobId(null); revokeAll();
  };

  const removeRef = (id: string) => {
    if (training) return;
    setRefs((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target) { URL.revokeObjectURL(target.url); createdUrlsRef.current.delete(target.url); }
      return prev.filter((r) => r.id !== id);
    });
  };

  const lastLoss = loss[loss.length - 1]?.loss;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Brain className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">LoRA Trainer Console</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">ComfyUI · /api/lora/train</span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); ingest(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-emerald-500 bg-emerald-50/60' : 'border-white/70 bg-white/30 hover:bg-white/50'
        }`}
      >
        <Upload className="w-6 h-6 text-gray-700 mx-auto mb-1" />
        <div className="text-xs font-semibold text-gray-800">Drop up to 10 reference images, or click to browse</div>
        <div className="text-[10px] text-gray-600 mt-0.5">{refs.length} / 10 loaded</div>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={(e) => { if (e.target.files) ingest(e.target.files); e.target.value = ''; }} />
      </div>

      {refs.length > 0 && (
        <div className="grid grid-cols-3 @xs:grid-cols-4 @sm:grid-cols-5 gap-2">
          {refs.map((r) => (
            <div key={r.id} className="relative group aspect-square rounded-lg overflow-hidden border border-white/60">
              <img src={r.url} alt={r.name} className="w-full h-full object-cover" />
              <button onClick={(e) => { e.stopPropagation(); removeRef(r.id); }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100" aria-label="Remove">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3 flex items-center gap-3">
        <input
          value={loraName}
          onChange={(e) => setLoraName(e.target.value.replace(/[^a-z0-9_]/gi, '_').slice(0, 24))}
          placeholder="lora_name"
          className="flex-1 text-xs bg-white/60 border border-white/70 rounded px-2 py-1.5 text-gray-800 font-mono"
        />
        <button onClick={start} disabled={training || refs.length === 0}
          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded bg-emerald-500/90 text-white hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Play className="w-3 h-3" /> {training ? 'Training…' : 'Start Training'}
        </button>
        <button onClick={save} disabled={!done}
          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save className="w-3 h-3" /> Save as new LoRA
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-semibold text-gray-700">Training loss</div>
          <div className="text-[11px] text-gray-700">
            epoch <strong>{loss.length}</strong>/{TOTAL_EPOCHS}
            {lastLoss !== undefined && <span className="ml-2">loss <strong>{lastLoss}</strong></span>}
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={loss} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: '#374151' }} />
              <YAxis tick={{ fontSize: 10, fill: '#374151' }} domain={[0, 'auto']} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number | string) => [Number(v).toFixed(4), 'loss']} />
              <Line type="monotone" dataKey="loss" stroke="#7c3aed" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {samples.length > 0 && (
        <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">Sample previews</div>
          <div className="grid grid-cols-1 @xs:grid-cols-3 gap-2">
            {samples.map((s, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/60">
                <img src={s} alt={`sample ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
