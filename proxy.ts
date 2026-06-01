import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Server-side route gate (Next.js 16 "proxy" — the renamed middleware). MUST
 * live at the project root (or src/) — a file inside app/ is silently ignored.
 *
 * Edge-safe: this runs on the Edge runtime, which has no Node crypto,
 * so we can't use `jsonwebtoken` here. We only DECODE the JWT payload (base64)
 * to read role + exp for a fast gate. Real signature verification still happens
 * server-side in app/api/graphql/route.ts on every request — so a forged token
 * can pass this gate but cannot actually do anything privileged.
 */

type Payload = { role?: string; exp?: number };

// Decode a JWT's payload without verifying the signature (Edge-compatible).
function decodeJwt(token: string): Payload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    // base64url → base64, then atob (available on the Edge runtime).
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    return JSON.parse(json) as Payload;
  } catch {
    return null;
  }
}

function isExpired(p: Payload): boolean {
  return typeof p.exp === "number" && p.exp * 1000 < Date.now();
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the admin login page through.
  if (pathname === "/admin/login") return NextResponse.next();

  // ── Admin area: require an admin/superadmin token ────────────────────────
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    const payload = token ? decodeJwt(token) : null;
    if (!payload || isExpired(payload) || !["admin", "superadmin"].includes(payload.role ?? "")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // ── Customer dashboard: require any logged-in user ───────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("user_token")?.value;
    const payload = token ? decodeJwt(token) : null;
    if (!payload || isExpired(payload)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Run only on the protected areas.
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
