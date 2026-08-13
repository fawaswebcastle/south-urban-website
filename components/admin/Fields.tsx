"use client";

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { ICON_CHOICES, type Field } from "@/lib/content-schema";
import { ImageField } from "./ImageField";
import { BlocksEditor, type Block } from "./BlocksEditor";

const inputClass =
  "w-full rounded-lg border border-rule bg-card px-3 py-2 text-[14px] text-ink outline-none transition-colors focus:border-green";

export function Label({
  children,
  required,
  help,
}: {
  children: React.ReactNode;
  required?: boolean;
  help?: string;
}) {
  return (
    <>
      <label className="block text-[13px] font-semibold text-ink">
        {children}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {help && <p className="mt-0.5 mb-1.5 text-[12.5px] leading-relaxed text-ink-soft">{help}</p>}
    </>
  );
}

/** Renders one field of any kind against a plain object value. */
export function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  switch (field.kind) {
    case "text":
    case "url":
    case "email":
    case "tel":
      return (
        <div>
          <Label required={field.required} help={field.help}>
            {field.label}
          </Label>
          <input
            type={field.kind === "text" ? "text" : field.kind}
            className={`${inputClass} mt-1.5`}
            value={typeof value === "string" ? value : ""}
            placeholder={"placeholder" in field ? field.placeholder : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label required={field.required} help={field.help}>
            {field.label}
          </Label>
          <textarea
            rows={field.rows ?? 3}
            className={`${inputClass} mt-1.5 resize-y`}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "boolean":
      return (
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[var(--su-green)]"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>
            <span className="block text-[13px] font-semibold text-ink">{field.label}</span>
            {field.help && <span className="block text-[12.5px] text-ink-soft">{field.help}</span>}
          </span>
        </label>
      );

    case "icon":
      return (
        <div>
          <Label help={field.help}>{field.label}</Label>
          <select
            className={`${inputClass} mt-1.5`}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">No icon</option>
            {ICON_CHOICES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      );

    case "image":
      return (
        <ImageField
          slot={field.slot}
          label={field.label}
          help={field.help}
          required={field.required}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      );

    case "stringList":
      return (
        <StringListEditor
          field={field}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );

    case "list":
      return (
        <ListEditor
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
        />
      );

    case "blocks":
      return (
        <BlocksEditor
          label={field.label}
          help={field.help}
          value={Array.isArray(value) ? (value as Block[]) : []}
          onChange={onChange}
        />
      );
  }
}

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowControls({
  index,
  count,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        aria-label={`Move ${label} up`}
        className="rounded p-1 text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-30"
      >
        <ChevronUp size={15} />
      </button>
      <button
        type="button"
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label={`Move ${label} down`}
        className="rounded p-1 text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-30"
      >
        <ChevronDown size={15} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded p-1 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function StringListEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "stringList" }>;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <Label help={field.help}>{field.label}</Label>
      <div className="mt-1.5 space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2.5 font-mono text-[11px] text-ink-muted">{i + 1}</span>
            {field.multiline ? (
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={item}
                onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
              />
            ) : (
              <input
                className={inputClass}
                value={item}
                onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
              />
            )}
            <RowControls
              index={i}
              count={value.length}
              label={field.itemLabel}
              onMove={(to) => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-[12.5px] text-ink-muted">No {field.itemLabel}s yet.</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-rule px-2.5 py-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-green hover:text-green"
      >
        <Plus size={13} />
        Add {field.itemLabel}
      </button>
    </div>
  );
}

function ListEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Record<string, unknown>[];
  onChange: (next: Record<string, unknown>[]) => void;
}) {
  return (
    <div>
      <Label help={field.help}>{field.label}</Label>
      <div className="mt-1.5 space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-rule bg-paper/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-rule pb-2.5">
              <span className="flex min-w-0 items-center gap-2">
                <GripVertical size={14} className="shrink-0 text-ink-muted" />
                <span className="truncate text-[13px] font-semibold text-ink">
                  {String(item[field.titleKey] || `Untitled ${field.itemLabel}`)}
                </span>
              </span>
              <RowControls
                index={i}
                count={value.length}
                label={field.itemLabel}
                onMove={(to) => onChange(move(value, i, to))}
                onRemove={() => onChange(value.filter((_, j) => j !== i))}
              />
            </div>
            <div className="space-y-4">
              {field.fields.map((sub) => (
                <FieldControl
                  key={sub.key}
                  field={sub}
                  value={item[sub.key]}
                  onChange={(next) =>
                    onChange(value.map((v, j) => (j === i ? { ...v, [sub.key]: next } : v)))
                  }
                />
              ))}
            </div>
          </div>
        ))}
        {value.length === 0 && (
          <p className="text-[12.5px] text-ink-muted">No {field.itemLabel}s yet.</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, {}])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-rule px-2.5 py-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-green hover:text-green"
      >
        <Plus size={13} />
        Add {field.itemLabel}
      </button>
    </div>
  );
}
