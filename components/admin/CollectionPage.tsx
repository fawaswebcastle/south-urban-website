import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getCollection } from "@/lib/collection-schema";
import { getPrisma, hasDatabase } from "@/lib/db";
import { requireSessionUser } from "@/lib/session";
import { CollectionManager } from "./CollectionManager";

/**
 * Loads one collection's rows and hands them to the client manager. Shared by
 * the five thin route files under app/admin, which differ only by slug.
 */
export async function CollectionPage({ slug }: { slug: string }) {
  await requireSessionUser();

  const schema = getCollection(slug);
  if (!schema) notFound();

  if (!hasDatabase) return <NotConfigured />;

  let rows: Record<string, unknown>[] = [];
  try {
    const model = getPrisma()[schema.model] as unknown as {
      findMany: (args: { orderBy: Record<string, "asc" | "desc"> }) => Promise<Record<string, unknown>[]>;
    };
    rows = await model.findMany({
      orderBy: schema.orderable ? { order: "asc" } : { date: "desc" },
    });
  } catch {
    return <Unreachable title={schema.title} />;
  }

  // Dates and Decimals cannot cross to a client component as-is.
  const plain = JSON.parse(JSON.stringify(rows)).map((row: Record<string, unknown>) =>
    schema.model === "post" && typeof row.date === "string"
      ? { ...row, date: row.date.slice(0, 10) }
      : row
  );

  return <CollectionManager schema={schema} initial={plain} />;
}

function NotConfigured() {
  return (
    <div className="flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900">
      <AlertTriangle size={16} className="mt-px shrink-0" />
      <p>
        No database is configured. Set <code className="font-mono">DATABASE_URL</code> and run{" "}
        <code className="font-mono">npm run db:migrate</code> to edit content here.
      </p>
    </div>
  );
}

function Unreachable({ title }: { title: string }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900">
      <AlertTriangle size={16} className="mt-px shrink-0" />
      <p>
        {title} could not be loaded — the database did not respond. The public site is still serving
        its built-in copy, so visitors are unaffected.
      </p>
    </div>
  );
}
