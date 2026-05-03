import { NextResponse } from 'next/server';
import { TENANTS, type TenantId } from './openclaw';

const ALLOWED_TENANTS: ReadonlySet<TenantId> = new Set<TenantId>(TENANTS);

export interface AuthContext {
  user: string;
  allowedTenants: ReadonlySet<TenantId>;
}

/**
 * Read the user identity injected by `middleware.ts` (which verifies the
 * dashboard token). Returns null if the header is missing — meaning the
 * request bypassed middleware (should not happen in production).
 */
export function getAuth(req: Request): AuthContext | null {
  const user = req.headers.get('x-dash-user');
  if (!user) return null;
  return { user, allowedTenants: ALLOWED_TENANTS };
}

export type AuthResult = { ok: true; ctx: AuthContext } | { ok: false; res: NextResponse };

export function requireAuth(req: Request): AuthResult {
  const ctx = getAuth(req);
  if (!ctx) {
    return { ok: false, res: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }) };
  }
  return { ok: true, ctx };
}

export type TenantResult = { ok: true; tenant: TenantId } | { ok: false; res: NextResponse };

export function requireTenant(
  ctx: AuthContext,
  tenant: string | null | undefined,
  { allowMissing }: { allowMissing?: boolean } = {},
): TenantResult {
  if (!tenant) {
    if (allowMissing) return { ok: true, tenant: 'apogee_dashboard' };
    return {
      ok: false,
      res: NextResponse.json({ ok: false, error: 'tenant_required' }, { status: 400 }),
    };
  }
  if (!ctx.allowedTenants.has(tenant as TenantId)) {
    return {
      ok: false,
      res: NextResponse.json({ ok: false, error: 'forbidden_tenant', tenant }, { status: 403 }),
    };
  }
  return { ok: true, tenant: tenant as TenantId };
}
