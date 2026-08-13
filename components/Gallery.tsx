"use client";

import { useState } from "react";
import Image from "next/image";
import { SafeImage } from "./ui/SafeImage";
import clsx from "clsx";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { GALLERY as GALLERY_DEFAULT } from "@/data/site";
import type { GalleryItem } from "@/lib/content-types";

const FILTERS = ["All", "Events", "Operations"] as const;

const SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-2",
];

export function Gallery({
  gallery: GALLERY = GALLERY_DEFAULT,
  categories,
}: {
  gallery?: readonly GalleryItem[];
  categories?: readonly { name: string; order?: number }[];
} = {}) {
  const filters = categories && categories.length > 0
    ? ["All", ...Array.from(new Set(categories.map((c) => c.name)))]
    : ["All", "Events", "Operations"];

  const [filter, setFilter] = useState<string>("All");
  const shown = GALLERY.filter((g) => filter === "All" || g.category === filter);

  return (
    <section id="gallery" className="scroll-mt-28 bg-paper py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label="Our visual story" title="From the field." className="mb-0" />

          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200",
                  f === filter
                    ? "bg-green text-white shadow-xs"
                    : "border border-rule bg-card text-ink-soft hover:border-green hover:text-green"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-4">
          {shown.map((item, i) => (
            <figure
              key={item.src + i}
              className={clsx(
                "group relative overflow-hidden rounded-xl border border-rule/70 bg-card shadow-xs",
                SPANS[i % SPANS.length]
              )}
            >
              <SafeImage
                src={item.src}
                fallbackSrc="/hero_banner.jpg"
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-deep/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-1 p-4 text-[13px] font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

