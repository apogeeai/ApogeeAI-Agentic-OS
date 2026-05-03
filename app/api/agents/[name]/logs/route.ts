import { NextResponse } from 'next/server';
import { getAgentLogs } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: Request, { params }: { params: { name: string } }) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;
  // Whitelist: agent names are alphanumeric + underscore, max 32 chars.
  if (!/^[A-Za-z0-9_]{1,32}$/.test(params.name)) {
    return NextResponse.json({ ok: false, error: 'invalid_agent_name' }, { status: 400 });
  }
  return NextResponse.json(await getAgentLogs(params.name));
}
