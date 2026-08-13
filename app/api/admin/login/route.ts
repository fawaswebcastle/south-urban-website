import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma, hasDatabase } from "@/lib/db";
import {
  SESSION_COOKIE,
  createSessionToken,
  isAuthConfigured,
  sessionCookieOptions,
} from "@/lib/auth";

export const runtime = "nodejs";

/** Same message whether the address is unknown or the password is wrong, so the
 *  form cannot be used to find out which accounts exist. */
const REJECTED = "That email and password do not match an account.";

export async function POST(request: Request) {
  if (!hasDatabase || !isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "The admin is not configured yet. Set DATABASE_URL and ADMIN_SESSION_SECRET, then create an account with `npm run admin:create`.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const user = await getPrisma().adminUser.findUnique({ where: { email } });

  // Hash even when there is no such user, so the response time does not reveal
  // whether the address exists.
  const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const ok = await bcrypt.compare(password, hash);

  if (!user || !ok) {
    return NextResponse.json({ error: REJECTED }, { status: 401 });
  }

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await getPrisma()
    .adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
    .catch(() => {});

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
