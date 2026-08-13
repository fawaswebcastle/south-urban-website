import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { requireSessionUser } from "@/lib/session";
import { getPrisma, hasDatabase } from "@/lib/db";
import { IMAGE_SPECS, checkImage, formatBytes, formatRatio, type ImageSlot } from "@/lib/image-specs";

export default async function MediaPage() {
  await requireSessionUser();

  let assets: Awaited<ReturnType<typeof load>> = [];
  let failed = false;
  if (hasDatabase) {
    try {
      assets = await load();
    } catch {
      failed = true;
    }
  }

  return (
    <div>
      <header className="border-b border-rule pb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Image library</h1>
        <p className="mt-1 text-[13.5px] text-ink-soft">
          Every image uploaded through the admin, checked against the slot it was uploaded for.
        </p>
      </header>

      <section className="mt-6">
        <h2 className="label text-ink-muted">What each slot needs</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-rule bg-card">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-rule bg-paper/60 text-[11.5px] uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Slot</th>
                <th className="px-4 py-2.5 font-semibold">Ratio</th>
                <th className="px-4 py-2.5 font-semibold">Recommended</th>
                <th className="px-4 py-2.5 font-semibold">Min width</th>
                <th className="px-4 py-2.5 font-semibold">Max size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {Object.entries(IMAGE_SPECS).map(([key, spec]) => (
                <tr key={key}>
                  <td className="px-4 py-2.5">
                    <span className="block font-medium text-ink">{spec.label}</span>
                    <span className="block text-[12px] text-ink-muted">{spec.usedOn}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-ink-soft">
                    {spec.ratioLabel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-ink-soft">
                    {spec.recommended.width} × {spec.recommended.height}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-ink-soft">
                    {spec.minWidth} px
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-ink-soft">
                    {formatBytes(spec.maxBytes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="label text-ink-muted">Uploads</h2>

        {failed && (
          <p className="mt-3 flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-[13px] text-amber-900">
            <AlertTriangle size={15} className="mt-px shrink-0" />
            The library could not be loaded — the database did not respond.
          </p>
        )}

        {!failed && assets.length === 0 && (
          <p className="mt-3 rounded-xl border border-rule bg-card px-4 py-8 text-center text-[13px] text-ink-muted">
            Nothing uploaded yet. Images added from any content screen appear here.
          </p>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const spec = asset.slot && asset.slot in IMAGE_SPECS ? (asset.slot as ImageSlot) : null;
            const check = spec
              ? checkImage(spec, {
                  width: asset.width,
                  height: asset.height,
                  size: asset.size,
                  type: asset.contentType,
                })
              : null;
            return (
              <figure key={asset.id} className="overflow-hidden rounded-xl border border-rule bg-card">
                <div className="relative aspect-[4/3] bg-paper-deep">
                  <Image
                    src={asset.url}
                    alt={asset.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 280px, 45vw"
                    unoptimized
                  />
                </div>
                <figcaption className="p-3">
                  <p className="truncate text-[13px] font-medium text-ink" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <p className="mt-0.5 font-mono text-[11.5px] text-ink-muted">
                    {asset.width} × {asset.height} · {formatRatio(asset.width / asset.height)} ·{" "}
                    {formatBytes(asset.size)}
                  </p>
                  {spec && (
                    <p
                      className={`mt-1 text-[11.5px] ${
                        check?.level === "ok" ? "text-green" : "text-amber-700"
                      }`}
                    >
                      {IMAGE_SPECS[spec].label}
                      {check?.level !== "ok" && " — does not match this slot"}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function load() {
  return getPrisma().mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 60 });
}
