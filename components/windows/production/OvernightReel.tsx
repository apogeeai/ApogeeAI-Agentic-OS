"use client";

import { useState } from 'react';
import { Sparkles, X, Play, Music, FileText, Image as ImageIcon } from 'lucide-react';
import { OVERNIGHT_ARTIFACTS, TENANT_LABEL, TENANT_COLOR, type Artifact } from './mockData';

const TYPE_ICON = {
  image: ImageIcon,
  audio: Music,
  video: Play,
  text: FileText,
};

export function OvernightReel() {
  const [preview, setPreview] = useState<Artifact | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Built Overnight</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {OVERNIGHT_ARTIFACTS.length} artifacts • 12am–8am • Mock
        </span>
      </div>

      <div className="overflow-x-auto pb-3 -mx-1 px-1">
        <div className="flex gap-3 min-w-max">
          {OVERNIGHT_ARTIFACTS.map((a) => {
            const Icon = TYPE_ICON[a.type];
            return (
              <button
                key={a.id}
                onClick={() => setPreview(a)}
                className="w-44 flex-shrink-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden text-left hover:scale-[1.03] transition-transform"
              >
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  <img src={a.thumb} alt={a.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-1.5 left-1.5 ${TENANT_COLOR[a.tenant]} text-white text-[9px] font-bold px-1.5 py-0.5 rounded`}>
                    {TENANT_LABEL[a.tenant]}
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Icon className="w-2.5 h-2.5" />
                    {a.builtAt}
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-800 truncate">{a.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-600">Tastemaker</span>
                    <span className={`text-xs font-bold ${a.score >= 0.85 ? 'text-emerald-700' : a.score >= 0.75 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {a.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white/90 rounded-2xl border border-white/60 p-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-bold text-gray-900">{preview.title}</div>
                <div className="text-xs text-gray-600">{TENANT_LABEL[preview.tenant]} • built {preview.builtAt}</div>
              </div>
              <button onClick={() => setPreview(null)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={preview.thumb} alt={preview.title} className="w-full rounded-lg" />
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-700">Type: <strong>{preview.type}</strong></span>
              <span className="text-emerald-700 font-bold">Tastemaker: {preview.score.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
