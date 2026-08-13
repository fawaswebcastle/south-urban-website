"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import type { CollectionSchema } from "@/lib/collection-schema";
import { FieldControl } from "./Fields";
import { deleteRecord, reorder, saveRecord } from "@/app/admin/actions";

type Row = Record<string, unknown> & { id: string };

/**
 * List and editor for one collection. Rows are held client-side because these
 * sets are small — ten people, a handful of posts — so editing, reordering and
 * publishing all happen without a round trip until Save.
 */
export function CollectionManager({
  schema,
  initial,
}: {
  schema: CollectionSchema;
  initial: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [editing, setEditing] = useState<Row | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function beginCreate() {
    setStatus(null);
    setEditing({ id: "", ...schema.blank } as Row);
  }

  function persist(row: Row) {
    startTransition(async () => {
      const { id, ...data } = row;
      const payload = normalise(schema, data);
      const result = await saveRecord(schema.model, id || null, payload);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      const saved = { ...row, id: result.id ?? id } as Row;
      setRows((current) =>
        id ? current.map((r) => (r.id === id ? saved : r)) : [...current, saved]
      );
      setEditing(null);
      setStatus({ kind: "ok", message: `Saved. The site has been updated.` });
    });
  }

  function remove(row: Row) {
    const name = String(row[schema.titleKey] || `this ${schema.singular}`);
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteRecord(schema.model, row.id);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      setRows((current) => current.filter((r) => r.id !== row.id));
      setStatus({ kind: "ok", message: "Deleted." });
    });
  }

  function shift(index: number, to: number) {
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(to, 0, item);
    setRows(next);
    startTransition(async () => {
      const result = await reorder(schema.model, next.map((r) => r.id));
      if (!result.ok) setStatus({ kind: "error", message: result.error });
    });
  }

  if (editing) {
    return (
      <RecordForm
        schema={schema}
        row={editing}
        pending={pending}
        status={status}
        onChange={setEditing}
        onCancel={() => {
          setEditing(null);
          setStatus(null);
        }}
        onSave={() => persist(editing)}
      />
    );
  }

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-rule pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {schema.title}
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-soft">{schema.where}</p>
        </div>
        <button
          type="button"
          onClick={beginCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green px-3.5 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-green-deep"
        >
          <Plus size={15} />
          Add {schema.singular}
        </button>
      </header>

      {schema.description && (
        <p className="mt-4 rounded-lg bg-paper-deep px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-soft">
          {schema.description}
        </p>
      )}

      {status && <Status status={status} />}

      <ul className="mt-5 divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-card">
        {rows.map((row, i) => (
          <li key={row.id} className="flex items-center gap-3 px-3 py-3">
            {schema.orderable && (
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => shift(i, i - 1)}
                  disabled={i === 0 || pending}
                  aria-label="Move up"
                  className="rounded p-0.5 text-ink-muted hover:text-ink disabled:opacity-30"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => shift(i, i + 1)}
                  disabled={i === rows.length - 1 || pending}
                  aria-label="Move down"
                  className="rounded p-0.5 text-ink-muted hover:text-ink disabled:opacity-30"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {schema.thumbKey && (
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-rule bg-paper-deep">
                {typeof row[schema.thumbKey] === "string" && row[schema.thumbKey] ? (
                  <Image
                    src={row[schema.thumbKey] as string}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                    unoptimized
                  />
                ) : null}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setStatus(null);
                setEditing(row);
              }}
              className="min-w-0 flex-1 text-left"
            >
              <span className="flex items-center gap-2">
                <span className="truncate text-[14px] font-medium text-ink">
                  {String(row[schema.titleKey] || `Untitled ${schema.singular}`)}
                </span>
                {row.published === false && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded bg-paper-deep px-1.5 py-0.5 text-[10.5px] font-medium text-ink-muted">
                    <EyeOff size={10} />
                    Hidden
                  </span>
                )}
              </span>
              {schema.subtitleKey && (
                <span className="mt-0.5 block truncate text-[12.5px] text-ink-muted">
                  {String(row[schema.subtitleKey] ?? "")}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => remove(row)}
              disabled={pending}
              aria-label={`Delete ${String(row[schema.titleKey] ?? schema.singular)}`}
              className="shrink-0 rounded p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}

        {rows.length === 0 && (
          <li className="px-4 py-8 text-center text-[13px] text-ink-muted">
            No {schema.singular}s yet. The site is showing its built-in copy until you add some.
          </li>
        )}
      </ul>
    </div>
  );
}

function RecordForm({
  schema,
  row,
  pending,
  status,
  onChange,
  onCancel,
  onSave,
}: {
  schema: CollectionSchema;
  row: Row;
  pending: boolean;
  status: { kind: "ok" | "error"; message: string } | null;
  onChange: (next: Row) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-green"
      >
        <ArrowLeft size={14} />
        All {schema.title.toLowerCase()}
      </button>

      <h1 className="font-display mt-3 border-b border-rule pb-5 text-2xl font-semibold tracking-tight text-ink">
        {row.id ? String(row[schema.titleKey] || `Edit ${schema.singular}`) : `New ${schema.singular}`}
      </h1>

      {status?.kind === "error" && <Status status={status} />}

      <div className="space-y-6 py-6">
        {schema.fields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={row[field.key]}
            onChange={(next) => onChange({ ...row, [field.key]: next })}
          />
        ))}
      </div>

      <div className="sticky bottom-0 -mx-6 flex items-center gap-3 border-t border-rule bg-card/95 px-6 py-3.5 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-green-deep disabled:opacity-50"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-rule px-4 py-2 text-[13.5px] font-medium text-ink-soft transition-colors hover:border-ink-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Status({ status }: { status: { kind: "ok" | "error"; message: string } }) {
  return (
    <p
      className={`mt-4 inline-flex items-center gap-1.5 text-[13px] ${
        status.kind === "ok" ? "text-green" : "text-red-600"
      }`}
    >
      {status.kind === "ok" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
      {status.message}
    </p>
  );
}

/** Coerce form values into the column types Prisma expects. */
function normalise(schema: CollectionSchema, data: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...data };

  // Fields the form never shows but the table has.
  delete out.updatedAt;
  delete out.order;

  for (const field of schema.fields) {
    const value = out[field.key];
    if (field.kind === "boolean") out[field.key] = Boolean(value);
    if (field.kind === "text" && value === undefined) out[field.key] = "";
  }

  if (schema.model === "post") {
    // The form edits a plain YYYY-MM-DD string; the column is a timestamp.
    const raw = typeof out.date === "string" ? out.date : "";
    const parsed = raw ? new Date(`${raw}T00:00:00Z`) : new Date();
    out.date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    if (!Array.isArray(out.body)) out.body = [];
  }

  return out;
}
