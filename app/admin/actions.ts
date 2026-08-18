"use server";

import { updateTag } from "next/cache";
import { hasDatabase } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getSchema } from "@/lib/content-schema";
import { CONTENT_TAG } from "@/lib/content";

type Result = { ok: true } | { ok: false; error: string };

async function guard(): Promise<{ email: string } | { error: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Your session has expired. Sign in again." };
  if (!hasDatabase) {
    return { error: "No database is configured." };
  }
  return { email: user.email };
}

/** Persist one singleton content block. */
export async function saveSection(key: string, data: unknown): Promise<Result> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };
  return { ok: false, error: "Database operations disabled." };
}

type CollectionName = "person" | "post" | "service" | "notification" | "galleryItem";

/** Create or update one row in a collection. */
export async function saveRecord(
  collection: CollectionName,
  id: string | null,
  data: Record<string, unknown>
): Promise<Result & { id?: string }> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };
  return { ok: false, error: "Database operations disabled." };
}

export async function deleteRecord(collection: CollectionName, id: string): Promise<Result> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };
  return { ok: false, error: "Database operations disabled." };
}

/** Persist a new order for a collection after a drag or arrow move. */
export async function reorder(collection: CollectionName, ids: string[]): Promise<Result> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };
  return { ok: false, error: "Database operations disabled." };
}

