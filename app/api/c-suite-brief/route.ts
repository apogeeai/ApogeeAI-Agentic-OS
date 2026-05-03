import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let text = '';
  try {
    const body = await req.json();
    text = typeof body?.text === 'string' ? body.text : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ ok: false, error: 'empty_brief' }, { status: 400 });
  }

  const id = `brief-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return NextResponse.json({ ok: true, id, queued: 'c-suite.briefs', preview: text.slice(0, 120) });
}
