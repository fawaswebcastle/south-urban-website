"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, AlertTriangle, CheckCircle2, Loader2, Info } from "lucide-react";
import {
  checkImage,
  formatBytes,
  formatRatio,
  getSpec,
  type ImageCheck,
  type ImageSlot,
} from "@/lib/image-specs";

/**
 * Upload control for one image slot.
 *
 * The requirement is stated up front — ratio, pixel size, file types, weight —
 * rather than only after a bad upload, and the file is measured in the browser
 * so the feedback lands before anything is sent. The server re-checks it; see
 * app/api/admin/upload/route.ts.
 */
export function ImageField({
  slot,
  label,
  value,
  onChange,
  required,
  help,
}: {
  slot: ImageSlot;
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  help?: string;
}) {
  // `getSpec` widens to `ImageSpec`; indexing IMAGE_SPECS directly keeps the
  // literal type, where optional keys like `note` are absent from the union.
  const spec = getSpec(slot);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [check, setCheck] = useState<ImageCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setCheck(null);

    const measured = await measure(file).catch(() => null);
    if (!measured) {
      setError("That file could not be read as an image.");
      return;
    }

    const result = checkImage(slot, {
      width: measured.width,
      height: measured.height,
      size: file.size,
      type: file.type,
    });
    setCheck(result);
    if (result.level === "error") return;

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slot", slot);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "The upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("The upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label className="text-[13px] font-semibold text-ink">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
        <span className="font-mono text-[11.5px] text-ink-muted">
          {spec.ratioLabel} · {spec.recommended.width} × {spec.recommended.height} px
        </span>
      </div>

      {help && <p className="mt-1 text-[12.5px] text-ink-soft">{help}</p>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={`mt-2 flex gap-4 rounded-xl border border-dashed p-3 transition-colors ${
          dragging ? "border-green bg-green/5" : "border-rule bg-paper/60"
        }`}
      >
        {/* Preview, shown in the real aspect box the site will crop to */}
        <div
          className="relative shrink-0 overflow-hidden rounded-lg border border-rule bg-paper-deep"
          style={{ width: 108, aspectRatio: String(spec.ratio) }}
        >
          {value ? (
            <Image src={value} alt="" fill className="object-cover" sizes="108px" unoptimized />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[11px] text-ink-muted">
              No image
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-green px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-green-deep disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </button>

            {value && !busy && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setCheck(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-red-400 hover:text-red-600"
              >
                <X size={13} />
                Remove
              </button>
            )}

            <span className="text-[12px] text-ink-muted">or drop a file here</span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={spec.accept.join(",")}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />

          {/* The requirement, stated before anything is uploaded */}
          <dl className="mt-2.5 grid gap-x-4 gap-y-0.5 text-[12px] sm:grid-cols-2">
            <Req term="Ratio" value={spec.ratioLabel} />
            <Req term="Best size" value={`${spec.recommended.width} × ${spec.recommended.height} px`} />
            <Req term="Minimum width" value={`${spec.minWidth} px`} />
            <Req
              term="File"
              value={`${spec.accept.map((t) => t.replace("image/", "").toUpperCase()).join(", ")} · under ${formatBytes(spec.maxBytes)}`}
            />
          </dl>

          <p className="mt-1.5 flex gap-1.5 text-[12px] leading-relaxed text-ink-muted">
            <Info size={13} className="mt-px shrink-0" />
            <span>
              <span className="font-medium text-ink-soft">{spec.usedOn}.</span>
              {spec.note ? ` ${spec.note}` : ""}
            </span>
          </p>

          {value && (
            <p className="mt-1.5 truncate font-mono text-[11px] text-ink-muted" title={value}>
              {value}
            </p>
          )}

          {check && (
            <p
              className={`mt-2 flex gap-1.5 text-[12px] leading-relaxed ${
                check.level === "ok"
                  ? "text-green"
                  : check.level === "warn"
                    ? "text-amber-700"
                    : "text-red-600"
              }`}
            >
              {check.level === "ok" ? (
                <CheckCircle2 size={13} className="mt-px shrink-0" />
              ) : (
                <AlertTriangle size={13} className="mt-px shrink-0" />
              )}
              <span>{check.messages.join(" ")}</span>
            </p>
          )}

          {error && (
            <p className="mt-2 flex gap-1.5 text-[12px] text-red-600">
              <AlertTriangle size={13} className="mt-px shrink-0" />
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Req({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-ink-muted">{term}:</dt>
      <dd className="font-medium text-ink-soft">{value}</dd>
    </div>
  );
}

/** Real pixel dimensions, read in the browser before the file is sent. */
function measure(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    img.src = url;
  });
}

export { formatRatio };
