"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Label } from "./Fields";

/** Mirrors `PostBlock` in data/site.ts — the shapes the article page renders. */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string; attribution?: string };

const KINDS: { kind: Block["kind"]; label: string; blank: Block }[] = [
  { kind: "p", label: "Paragraph", blank: { kind: "p", text: "" } },
  { kind: "h2", label: "Subheading", blank: { kind: "h2", text: "" } },
  { kind: "list", label: "Bulleted list", blank: { kind: "list", items: [""] } },
  { kind: "quote", label: "Pull quote", blank: { kind: "quote", text: "", attribution: "" } },
];

const inputClass =
  "w-full rounded-lg border border-rule bg-card px-3 py-2 text-[14px] text-ink outline-none transition-colors focus:border-green";

export function BlocksEditor({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: Block[];
  onChange: (next: Block[]) => void;
}) {
  const blocks = Array.isArray(value) ? value : [];

  function replace(index: number, next: Block) {
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      <Label help={help}>{label}</Label>

      <div className="mt-1.5 space-y-3">
        {blocks.map((block, i) => (
          <div key={i} className="rounded-xl border border-rule bg-paper/50 p-3.5">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <span className="label text-ink-muted">
                {KINDS.find((k) => k.kind === block.kind)?.label ?? block.kind}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move block up"
                  className="rounded p-1 text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-30"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === blocks.length - 1}
                  aria-label="Move block down"
                  className="rounded p-1 text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-30"
                >
                  <ChevronDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                  aria-label="Remove block"
                  className="rounded p-1 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {block.kind === "p" && (
              <textarea
                rows={4}
                className={`${inputClass} resize-y`}
                value={block.text}
                onChange={(e) => replace(i, { kind: "p", text: e.target.value })}
              />
            )}

            {block.kind === "h2" && (
              <input
                className={inputClass}
                value={block.text}
                onChange={(e) => replace(i, { kind: "h2", text: e.target.value })}
              />
            )}

            {block.kind === "list" && (
              <div className="space-y-2">
                {block.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="mt-2.5 text-ink-muted">•</span>
                    <textarea
                      rows={2}
                      className={`${inputClass} resize-y`}
                      value={item}
                      onChange={(e) =>
                        replace(i, {
                          kind: "list",
                          items: block.items.map((v, k) => (k === j ? e.target.value : v)),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        replace(i, { kind: "list", items: block.items.filter((_, k) => k !== j) })
                      }
                      aria-label="Remove list item"
                      className="mt-1.5 rounded p-1 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => replace(i, { kind: "list", items: [...block.items, ""] })}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-green hover:underline"
                >
                  <Plus size={12} />
                  Add bullet
                </button>
              </div>
            )}

            {block.kind === "quote" && (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  className={`${inputClass} resize-y`}
                  placeholder="Quotation"
                  value={block.text}
                  onChange={(e) => replace(i, { ...block, kind: "quote", text: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Attribution (optional)"
                  value={block.attribution ?? ""}
                  onChange={(e) =>
                    replace(i, { ...block, kind: "quote", attribution: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <p className="text-[12.5px] text-ink-muted">This article has no content yet.</p>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.kind}
            type="button"
            onClick={() => onChange([...blocks, structuredClone(k.blank)])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rule px-2.5 py-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-green hover:text-green"
          >
            <Plus size={13} />
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
