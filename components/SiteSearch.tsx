"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";
import { NAV_LINKS as NAV_LINKS_DEFAULT, SERVICES as SERVICES_DEFAULT } from "@/data/site";
import type { NavLink, Service } from "@/lib/content-types";

type Target = { label: string; group: string; href: string };

export function SiteSearch({
  tone = "ink",
  navLinks: NAV_LINKS = NAV_LINKS_DEFAULT,
  services: SERVICES = SERVICES_DEFAULT,
}: {
  tone?: "ink" | "paper";
  navLinks?: readonly NavLink[];
  services?: readonly Service[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Built from props rather than module scope, so admin edits apply.
  const targets: Target[] = useMemo(
    () => [
      ...NAV_LINKS.map((l) => ({ label: l.label, group: "Section", href: l.href })),
      { label: "Contact Us", group: "Section", href: "#contact" },
      ...SERVICES.map((s) => ({ label: s.title, group: "Service", href: "#services" })),
    ],
    [NAV_LINKS, SERVICES]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return targets.slice(0, 6);
    return targets.filter((t) => t.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, targets]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search this site"
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
          tone === "paper"
            ? "border-white/20 text-white hover:bg-white/10"
            : "border-rule text-ink-soft hover:border-green hover:text-green hover:bg-paper-deep/50"
        )}
      >
        <Search size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[16vh] backdrop-blur-xs"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search this site"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-xl bg-card border border-rule shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) go(results[0].href);
              }}
              className="flex items-center gap-3 border-b border-rule px-4 py-3.5"
            >
              <Search size={17} className="shrink-0 text-ink-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections and services..."
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted/70 sm:text-[14.5px]"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="shrink-0 text-ink-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </form>

            {results.length === 0 ? (
              <p className="px-4 py-5 text-[13.5px] text-ink-soft">
                Nothing matches “{query}”. Try searching for a service or section.
              </p>
            ) : (
              <ul className="max-h-[44vh] overflow-y-auto py-1.5">
                {results.map((r) => (
                  <li key={`${r.group}-${r.label}`}>
                    <button
                      onClick={() => go(r.href)}
                      className="flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors hover:bg-paper-deep/60"
                    >
                      <span className="text-[14px] font-medium text-ink">{r.label}</span>
                      <span className="label shrink-0 text-ink-muted/60">{r.group}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

