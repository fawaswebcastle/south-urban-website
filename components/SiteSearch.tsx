"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft, FileText, Layers, PhoneCall } from "lucide-react";
import clsx from "clsx";
import { NAV_LINKS as NAV_LINKS_DEFAULT, SERVICES as SERVICES_DEFAULT } from "@/data/site";
import type { NavLink, Service } from "@/lib/content-types";

type Target = {
  label: string;
  category: "Pages" | "Services" | "Quick Links";
  href: string;
  desc?: string;
};

const STATIC_SEARCH_TARGETS: Target[] = [
  {
    label: "About Us",
    category: "Pages",
    href: "/about",
    desc: "Constituted under the MSCS Act 2002 — vision, mission, and legacy",
  },
  {
    label: "Blogs & Insights",
    category: "Pages",
    href: "/blog",
    desc: "Articles, market news, and insights from South Urban's team of agri-experts",
  },
  {
    label: "Services",
    category: "Pages",
    href: "/#services",
    desc: "12 services across the whole agricultural value chain",
  },
  {
    label: "Leadership & Governance",
    category: "Pages",
    href: "/#leadership",
    desc: "Board of Directors, executives, and leadership team",
  },
  {
    label: "Careers",
    category: "Pages",
    href: "/#careers",
    desc: "Build your career with us — join our team",
  },
  {
    label: "Gallery",
    category: "Pages",
    href: "/#gallery",
    desc: "Field operations, farmer events, and community photos",
  },
  {
    label: "Contact Us",
    category: "Quick Links",
    href: "/#contact",
    desc: "Get in touch with South Urban Agro Co-op",
  },
];

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const normalizeHref = (label: string, href: string) => {
    const l = label.toLowerCase();
    if (l.includes("about") || href === "/about") return "/about";
    if (l.includes("blog") || href === "/blog" || href === "/blogs") return "/blog";
    if (l.includes("service") || href.includes("service")) return "/#services";
    if (l.includes("leader") || href.includes("leadership")) return "/#leadership";
    if (l.includes("career") || href.includes("career")) return "/#careers";
    if (l.includes("gallery") || href.includes("gallery")) return "/#gallery";
    if (l.includes("who we are") || href.includes("who-we-are")) return "/#who-we-are";
    if (l.includes("contact") || href.includes("contact")) return "/#contact";
    if (href.startsWith("/#") || href.startsWith("#")) return href.startsWith("#") ? "/" + href : href;
    return "/#" + (href.replace(/^\//, "") || "services");
  };

  const targets: Target[] = useMemo(() => {
    const customServices: Target[] = (SERVICES || []).map((s) => ({
      label: s.title,
      category: "Services" as const,
      href: "/#services",
      desc: s.summary,
    }));

    // Merge static pages & custom services, ensuring /about and /blog go to pages and all others to /#<section>
    const navTargets: Target[] = (NAV_LINKS || []).map((l) => ({
      label: l.label,
      category: "Pages" as const,
      href: normalizeHref(l.label, l.href),
      desc: `Navigate to ${l.label}`,
    }));

    const combined = [...STATIC_SEARCH_TARGETS, ...navTargets, ...customServices];

    // Deduplicate by href
    const seen = new Set<string>();
    return combined.filter((t) => {
      const key = `${t.label.toLowerCase()}-${t.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [NAV_LINKS, SERVICES]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return targets.slice(0, 7);
    return targets.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.desc && t.desc.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [query, targets]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Handle global keyboard shortcuts (Cmd+K / Ctrl+K and Esc)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/" + href);
      }
    } else if (href.startsWith("/#")) {
      const hash = href.substring(1);
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].href);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search this site"
        title="Search (⌘K)"
        className={clsx(
          "flex h-9 items-center gap-2 rounded-lg border px-2.5 text-xs font-medium transition-colors",
          tone === "paper"
            ? "border-white/20 text-white hover:bg-white/10"
            : "border-rule text-ink-soft hover:border-green hover:text-green hover:bg-paper-deep/50"
        )}
      >
        <Search size={15} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-rule/70 bg-paper-deep px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search this site"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-card border border-rule/80 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3 border-b border-rule/80 px-4 py-3.5">
              <Search size={18} className="shrink-0 text-green" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages, services, sections..."
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none border-0 ring-0 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none shadow-none placeholder:text-ink-muted/70 sm:text-[15px]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-md p-1 text-ink-muted hover:bg-paper-deep hover:text-ink"
                  aria-label="Clear query"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="rounded-lg border border-rule/80 px-2 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:border-rule hover:text-ink"
              >
                ESC
              </button>
            </div>

            {results.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-ink">No results found for “{query}”</p>
                <p className="mt-1 text-xs text-ink-soft">Try searching for pages like “About Us”, “Services”, or “Leadership”.</p>
              </div>
            ) : (
              <ul className="max-h-[50vh] overflow-y-auto p-2">
                {results.map((r, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <li key={`${r.category}-${r.label}`}>
                      <button
                        onClick={() => handleSelect(r.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={clsx(
                          "flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-3 text-left transition-colors",
                          isSelected ? "bg-green/10 text-green" : "text-ink hover:bg-paper-deep/60"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={clsx(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                              isSelected
                                ? "border-green/30 bg-green/20 text-green"
                                : "border-rule/80 bg-paper-deep text-ink-soft"
                            )}
                          >
                            {r.category === "Pages" ? (
                              <FileText size={15} />
                            ) : r.category === "Services" ? (
                              <Layers size={15} />
                            ) : (
                              <PhoneCall size={15} />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[14.5px] font-semibold text-ink leading-tight">{r.label}</span>
                              <span className="rounded-md bg-paper-deep px-1.5 py-0.5 text-[10.5px] font-medium text-ink-muted border border-rule/60">
                                {r.category}
                              </span>
                            </div>
                            {r.desc && (
                              <p className="mt-0.5 truncate text-[12.5px] text-ink-soft leading-tight">{r.desc}</p>
                            )}
                          </div>
                        </div>

                        <span className={clsx("shrink-0 transition-opacity", isSelected ? "opacity-100" : "opacity-0")}>
                          <CornerDownLeft size={15} className="text-green" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center justify-between border-t border-rule/80 bg-paper-deep/40 px-4 py-2 text-[11.5px] text-ink-muted">
              <span>
                Use <kbd className="font-sans font-semibold">↑</kbd> <kbd className="font-sans font-semibold">↓</kbd> to navigate
              </span>
              <span>
                Press <kbd className="font-sans font-semibold">↵</kbd> to select
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
