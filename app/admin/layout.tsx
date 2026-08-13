import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin — South Urban",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // The login page renders inside this layout but without the shell.
  if (!user) return <div className="min-h-screen bg-paper-deep">{children}</div>;

  return (
    <div className="min-h-screen bg-paper-deep lg:flex">
      <aside className="border-b border-rule bg-card lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-4">
          <Link href="/admin" className="min-w-0">
            <span className="font-display block text-[15px] font-semibold tracking-tight text-ink">
              South Urban
            </span>
            <span className="block text-[11.5px] text-ink-muted">Content admin</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="shrink-0 text-[12px] font-medium text-green hover:underline"
          >
            View site
          </Link>
        </div>

        <AdminNav />

        <div className="border-t border-rule px-5 py-4">
          <p className="truncate text-[12.5px] font-medium text-ink">{user.name}</p>
          <p className="truncate text-[11.5px] text-ink-muted">{user.email}</p>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="mt-2 text-[12px] font-medium text-ink-soft transition-colors hover:text-red-600"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
