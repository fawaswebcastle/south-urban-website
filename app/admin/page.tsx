import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { requireSessionUser } from "@/lib/session";
import { getPrisma, hasDatabase } from "@/lib/db";
import { ADMIN_NAV, findUnlisted, resolveGroup } from "@/lib/admin-nav";

export default async function AdminDashboard() {
  const user = await requireSessionUser();

  let counts: Record<string, number> = {};
  let countError = false;
  if (hasDatabase) {
    try {
      const client = getPrisma();
      // Sequential rather than Promise.all: the local PGlite database used in
      // development accepts one connection, and this is five cheap counts.
      counts = {
        post: await client.post.count(),
        person: await client.person.count(),
        service: await client.service.count(),
        notification: await client.notification.count(),
        galleryItem: await client.galleryItem.count(),
      };
    } catch {
      countError = true;
    }
  }

  const empty = !countError && hasDatabase && Object.values(counts).every((n) => n === 0);
  const unlisted = findUnlisted();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-[13.5px] text-ink-soft">
        Everything on the public site, grouped by the page it appears on.
      </p>

      {(countError || empty) && (
        <Notice>
          {countError ? (
            <>
              <p className="font-semibold">The database could not be reached.</p>
              <p className="mt-1">
                The public site is still serving its built-in copy from{" "}
                <code className="font-mono">data/site.ts</code>, so visitors see no error — but
                nothing saved here will apply until the connection is restored.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">No content has been imported yet.</p>
              <p className="mt-1">
                The site is serving its built-in copy. Run{" "}
                <code className="font-mono">npm run seed</code> to bring that copy into the database
                so it can be edited here.
              </p>
            </>
          )}
        </Notice>
      )}

      {unlisted.length > 0 && (
        <Notice>
          <p className="font-semibold">Not reachable from the menu</p>
          <p className="mt-1">
            {unlisted.join(", ")} — add to <code className="font-mono">lib/admin-nav.ts</code>.
          </p>
        </Notice>
      )}

      <div className="mt-8 space-y-8">
        {ADMIN_NAV.map((group) => {
          const items = resolveGroup(group);
          if (items.length === 0) return null;

          return (
            <section key={group.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink">
                  {group.title}
                </h2>
                <span className="text-[11.5px] tabular-nums text-ink-muted">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-0.5 text-[12.5px] text-ink-soft">{group.blurb}</p>

              <ul className="mt-3 divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-card">
                {items.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-paper"
                    >
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="text-[13.5px] font-medium text-ink">{item.title}</span>
                          {item.model && (
                            <span className="shrink-0 text-[11.5px] tabular-nums text-ink-muted">
                              {countError ? "—" : `${counts[item.model] ?? 0}`}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-ink-muted">
                          {item.where}
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-green"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900">
      <AlertTriangle size={16} className="mt-px shrink-0" />
      <div>{children}</div>
    </div>
  );
}
