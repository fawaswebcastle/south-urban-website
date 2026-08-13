import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Gate on /admin. Runs on the edge runtime, so it only verifies the signed
 * session cookie — no database and no password hashing here. Server components
 * call `requireSessionUser()` as a second check, so a gap in the matcher below
 * cannot silently expose a page.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token).catch(() => null) : null;

  if (pathname === "/admin/login") {
    if (user) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!user) {
    const login = new URL("/admin/login", request.url);
    // Come back to whatever was asked for after signing in.
    if (pathname !== "/admin") login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
