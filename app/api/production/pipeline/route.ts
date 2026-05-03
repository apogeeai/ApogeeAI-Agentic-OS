import { NextResponse } from 'next/server';
import { getPipelineDepth } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;
  return NextResponse.json(await getPipelineDepth());
}
