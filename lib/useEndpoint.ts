'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Tiny SWR-style fetcher with optional polling. Avoids pulling in the SWR /
 * react-query dep weight just to wire the dashboard windows to the API layer.
 */
export interface UseEndpointResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useEndpoint<T>(
  url: string | null,
  opts: { intervalMs?: number; initialData?: T } = {},
): UseEndpointResult<T> {
  const { intervalMs, initialData } = opts;
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(!initialData);
  const aliveRef = useRef(true);
  const tickRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!url) return;
    const myTick = ++tickRef.current;
    try {
      const r = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = (await r.json()) as T;
      if (!aliveRef.current || tickRef.current !== myTick) return;
      setData(json);
      setError(null);
    } catch (e) {
      if (!aliveRef.current) return;
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    aliveRef.current = true;
    void refresh();
    if (!intervalMs) return () => { aliveRef.current = false; };
    const t = setInterval(refresh, intervalMs);
    return () => { aliveRef.current = false; clearInterval(t); };
  }, [refresh, intervalMs]);

  return { data, error, isLoading, refresh };
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    let detail = `HTTP ${r.status}`;
    try {
      const data = (await r.json()) as { error?: string };
      if (data?.error) detail = data.error;
    } catch { /* ignore */ }
    throw new Error(detail);
  }
  return (await r.json()) as T;
}
