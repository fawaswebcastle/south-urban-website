import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hasDatabase } from "@/lib/db";
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

export async function POST() {
  return NextResponse.json(
    { error: "Admin login is disabled because no database is configured." },
    { status: 503 }
  );
}
