"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import { getPath, setPath, type SectionSchema } from "@/lib/content-schema";
import { FieldControl } from "./Fields";
import { saveSection } from "@/app/admin/actions";

/**
 * Renders any section schema as a form. Every content block in the admin uses
 * this — there are no per-section forms — so a new field is one entry in
 * `lib/content-schema.ts`.
 */
export function SectionForm({
  schema,
  initial,
  previewHref,
}: {
  schema: SectionSchema;
  initial: Record<string, unknown>;
  previewHref?: string;
}) {
  const [value, setValue] = useState<Record<string, unknown>>(initial);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);

  function update(path: string, next: unknown) {
    setValue((current) => setPath(current, path, next));
    setDirty(true);
    setStatus(null);
  }

  function submit() {
    startTransition(async () => {
      const result = await saveSection(schema.key, value);
      if (result.ok) {
        setDirty(false);
        setStatus({ kind: "ok", message: "Saved. The site has been updated." });
      } else {
        setStatus({ kind: "error", message: result.error });
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <header className="border-b border-rule pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              {schema.title}
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-soft">{schema.where}</p>
          </div>
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-3 py-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-green hover:text-green"
            >
              View on site
              <ExternalLink size={13} />
            </a>
          )}
        </div>
        {schema.description && (
          <p className="mt-3 rounded-lg bg-paper-deep px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-soft">
            {schema.description}
          </p>
        )}
      </header>

      <div className="space-y-6 py-6">
        {schema.fields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={getPath(value, field.key)}
            onChange={(next) => update(field.key, next)}
          />
        ))}
      </div>

      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t border-rule bg-card/95 px-6 py-3.5 backdrop-blur">
        <button
          type="submit"
          disabled={pending || !dirty}
          className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-green-deep disabled:opacity-50"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {pending ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </button>

        {status && (
          <span
            className={`inline-flex items-center gap-1.5 text-[13px] ${
              status.kind === "ok" ? "text-green" : "text-red-600"
            }`}
          >
            {status.kind === "ok" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {status.message}
          </span>
        )}

        {dirty && !status && (
          <span className="text-[12.5px] text-ink-muted">Unsaved changes</span>
        )}
      </div>
    </form>
  );
}
