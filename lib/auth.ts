/**
 * Admin sessions.
 *
 * A signed JWT in an httpOnly cookie. `jose` is used rather than a Node-only JWT
 * library because `middleware.ts` runs on the edge runtime and has to verify the
 * same token; password hashing stays in Node-runtime route handlers only.
 *
 * There is no sign-up flow by design. The first account is created from the
 * command line with `npm run admin:create`, which reads the password from the
 * operator rather than from anything in this repo.
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "su_admin_session";
const SESSION_HOURS = 12;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function secret(): Uint8Array {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set a random string of at least 32 characters — `openssl rand -base64 32` produces one."
    );
  }
  return new TextEncoder().encode(value);
}

/** True when the session secret is configured, without throwing. */
export function isAuthConfigured(): boolean {
  const value = process.env.ADMIN_SESSION_SECRET;
  return Boolean(value && value.length >= 32);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payloadToUser(payload);
  } catch {
    return null;
  }
}

function payloadToUser(payload: JWTPayload): SessionUser | null {
  const { sub, email, name, role } = payload as JWTPayload & {
    email?: unknown;
    name?: unknown;
    role?: unknown;
  };
  if (typeof sub !== "string" || typeof email !== "string") return null;
  return {
    id: sub,
    email,
    name: typeof name === "string" ? name : email,
    role: typeof role === "string" ? role : "editor",
  };
}

export const SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
