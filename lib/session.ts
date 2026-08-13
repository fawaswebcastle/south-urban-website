import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken, type SessionUser } from "./auth";

/** The signed-in admin, or null. Safe to call from any server component. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Same, but sends anonymous visitors to the login page. Middleware already
 * blocks unauthenticated requests to /admin; this is the second gate, so a
 * missing matcher entry cannot quietly expose a page.
 */
export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
