"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { ADMIN_NAV, groupIdForPath, resolveGroup } from "@/lib/admin-nav";

/**
 * Grouped by the page each block belongs to, and within a group in the order it
 * appears on that page. Groups collapse so the whole tree is scannable; the one
 * containing the current screen opens on navigation.
 */
export function AdminNav() {
  const pathname = usePathname();
  const openGroup = groupIdForPath(pathname);

  return (
    <nav className="px-3 py-4">
      {ADMIN_NAV.map((group) => {
        const items = resolveGroup(group);
        if (items.length === 0) return null;
        const isOpen = openGroup === group.id;

        return (
          <details key={group.id} open={isOpen} className="group/nav mb-1">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 py-1.5 text-ink-soft transition-colors hover:bg-paper-deep [&::-webkit-details-marker]:hidden">
              <ChevronRight
                size={13}
                className="shrink-0 text-ink-muted transition-transform group-open/nav:rotate-90"
              />
              <span className="label">{group.title}</span>
              <span className="ml-auto text-[11px] tabular-nums text-ink-muted">{items.length}</span>
            </summary>

            <ul className="mb-2 ml-[7px] space-y-0.5 border-l border-rule pl-2.5 pt-1">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "block rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors",
                        active
                          ? "bg-green/10 font-semibold text-green"
                          : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </nav>
  );
}
