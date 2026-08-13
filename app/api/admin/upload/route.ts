import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSessionUser } from "@/lib/session";
import { getPrisma, hasDatabase } from "@/lib/db";
import { readImageDimensions } from "@/lib/image-dimensions";
import { IMAGE_SPECS, checkImage, type ImageSlot } from "@/lib/image-specs";

export const runtime = "nodejs";

/** Hard ceiling regardless of slot, so a bad request cannot buffer something huge. */
const ABSOLUTE_MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured. Add BLOB_READ_WRITE_TOKEN from your Vercel Blob store to the environment.",
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "That upload could not be read." }, { status: 400 });
  }

  const file = form.get("file");
  const slot = String(form.get("slot") ?? "") as ImageSlot;
  const alt = form.get("alt");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was included." }, { status: 400 });
  }
  if (!(slot in IMAGE_SPECS)) {
    return NextResponse.json({ error: `Unknown image slot "${slot}".` }, { status: 400 });
  }
  if (file.size > ABSOLUTE_MAX_BYTES) {
    return NextResponse.json(
      { error: `That file is larger than the ${ABSOLUTE_MAX_BYTES / 1024 / 1024} MB limit.` },
      { status: 413 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = readImageDimensions(bytes);
  if (!dimensions) {
    return NextResponse.json(
      { error: "That file is not a readable PNG, JPEG, WebP or GIF image." },
      { status: 400 }
    );
  }

  // Re-run the same checks the browser ran, because a direct POST skips those.
  const check = checkImage(slot, {
    width: dimensions.width,
    height: dimensions.height,
    size: file.size,
    type: file.type,
  });
  if (check.level === "error") {
    return NextResponse.json({ error: check.messages.join(" ") }, { status: 422 });
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
  const blob = await put(`site/${slot}/${Date.now()}-${safeName || "image"}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  if (hasDatabase) {
    try {
      await getPrisma().mediaAsset.create({
        data: {
          url: blob.url,
          pathname: blob.pathname,
          filename: file.name,
          contentType: file.type,
          size: file.size,
          width: dimensions.width,
          height: dimensions.height,
          slot,
          alt: typeof alt === "string" && alt ? alt : null,
          uploadedBy: user.email,
        },
      });
    } catch (error) {
      // The upload itself succeeded; losing the library row must not fail it.
      console.error("[upload] could not record media asset:", error);
    }
  }

  return NextResponse.json({
    url: blob.url,
    width: dimensions.width,
    height: dimensions.height,
    size: file.size,
    check,
  });
}
