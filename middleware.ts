import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware that gates every /api/* route.
 *
 * Identity model (single-operator dashboard):
 *   - The dashboard runs as the configured `OPENCLAW_USER` (default: apogeeai).
 *   - If `DASHBOARD_API_TOKEN` is set, every API call must present it via
 *     the `X-Dashboard-Token` header or the `dash_token` cookie. Calls
 *     without the token are rejected with 401.
 *   - On success the validated user identity is forwarded to API route
 *     handlers via the `x-dash-user` request header (handlers read it via
 *     `requireAuth` from `lib/api-auth.ts`). Clients cannot spoof this
 *     header — middleware unconditionally overwrites it.
 *
 * In a multi-tenant deployment this would verify a signed session JWT
 * instead and derive `x-dash-user` from the verified claims.
 */
const USER = process.env.OPENCLAW_USER || 'apogeeai';
const REQUIRE_TOKEN = process.env.DASHBOARD_API_TOKEN;

export function middleware(req: NextRequest) {
  if (REQUIRE_TOKEN) {
    const provided =
      req.headers.get('x-dashboard-token') ?? req.cookies.get('dash_token')?.value ?? null;
    if (provided !== REQUIRE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }
  const headers = new Headers(req.headers);
  headers.set('x-dash-user', USER);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: '/api/:path*' };
