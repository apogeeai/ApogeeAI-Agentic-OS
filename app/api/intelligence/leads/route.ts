import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;
  return NextResponse.json(await getLeads());
}
