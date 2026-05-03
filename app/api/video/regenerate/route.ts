import { NextResponse } from 'next/server';
import { postVideoRegenerate } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const jobId = typeof b.jobId === 'string' ? b.jobId : '';

  if (!jobId) return NextResponse.json({ ok: false, error: 'no_job_id' }, { status: 400 });
  return NextResponse.json(await postVideoRegenerate(jobId));
}
