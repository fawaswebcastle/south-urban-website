"use server";

import { updateTag } from "next/cache";
import { getPrisma, hasDatabase } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getSchema } from "@/lib/content-schema";
import { CONTENT_TAG } from "@/lib/content";

type Result = { ok: true } | { ok: false; error: string };

async function guard(): Promise<{ email: string } | { error: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Your session has expired. Sign in again." };
  if (!hasDatabase) {
    return { error: "No database is configured. Set DATABASE_URL to save changes." };
  }
  return { email: user.email };
}

/** Persist one singleton content block. */
export async function saveSection(key: string, data: unknown): Promise<Result> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };

  if (!getSchema(key)) return { ok: false, error: `Unknown section "${key}".` };
  if (!data || typeof data !== "object") {
    return { ok: false, error: "That content could not be read." };
  }

  try {
    const payload = data as object;
    await getPrisma().section.upsert({
      where: { key },
      create: { key, data: payload, updatedBy: auth.email },
      update: { data: payload, updatedBy: auth.email },
    });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    console.error("[admin] saveSection failed:", error);
    return { ok: false, error: "Could not save. The database rejected the change." };
  }
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

  try {
    const client = getPrisma();
    const model = client[collection] as unknown as {
      create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
      update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<{ id: string }>;
    };
    const row = id
      ? await model.update({ where: { id }, data })
      : await model.create({ data });
    updateTag(CONTENT_TAG);
    return { ok: true, id: row.id };
  } catch (error) {
    console.error(`[admin] saveRecord(${collection}) failed:`, error);
    const message =
      error instanceof Error && error.message.includes("Unique")
        ? "Another entry already uses that slug. Choose a different one."
        : "Could not save. The database rejected the change.";
    return { ok: false, error: message };
  }
}

export async function deleteRecord(collection: CollectionName, id: string): Promise<Result> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };

  try {
    const client = getPrisma();
    const model = client[collection] as unknown as { delete: (args: { where: { id: string } }) => Promise<unknown> };
    await model.delete({ where: { id } });
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    console.error(`[admin] deleteRecord(${collection}) failed:`, error);
    return { ok: false, error: "Could not delete that entry." };
  }
}

/** Persist a new order for a collection after a drag or arrow move. */
export async function reorder(collection: CollectionName, ids: string[]): Promise<Result> {
  const auth = await guard();
  if ("error" in auth) return { ok: false, error: auth.error };

  try {
    const client = getPrisma();
    const model = client[collection] as unknown as {
      update: (args: { where: { id: string }; data: { order: number } }) => Promise<unknown>;
    };
    await Promise.all(ids.map((id, index) => model.update({ where: { id }, data: { order: index } })));
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (error) {
    console.error(`[admin] reorder(${collection}) failed:`, error);
    return { ok: false, error: "Could not save the new order." };
  }
}
