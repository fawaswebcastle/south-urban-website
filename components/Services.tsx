"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import clsx from "clsx";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { SERVICES as SERVICES_DEFAULT } from "@/data/site";
import type { Service } from "@/lib/content-types";

export function Services({
  services: SERVICES = SERVICES_DEFAULT,
}: {
  services?: readonly Service[];
} = {}) {
  const [open, setOpen] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const holdUntil = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < holdUntil.current) return;
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        const i = Number((hit.target as HTMLElement).dataset.index);
        if (!Number.isNaN(i)) setOpen(i);
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );

    rows.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="services" className="scroll-mt-28 bg-paper-deep/60 py-16 sm:py-24 border-y border-rule/70">
      <Container>
        <SectionHeading
          label="What we offer"
          title="Twelve services, across the whole agricultural value chain."
          intro="Each opens as you scroll — or select any line to jump to it."
        />

        <ul className="mt-12 border-t border-rule/80">
          {SERVICES.map((service, i) => {
            const isOpen = open === i;
            return (
              <li
                key={service.title}
                data-index={i}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                className="border-b border-rule/70"
              >
                <button
                  onClick={() => {
                    holdUntil.current = Date.now() + 1500;
                    setOpen(isOpen ? -1 : i);
                  }}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-5 py-5 text-left sm:gap-8 transition-colors"
                >
                  <span
                    className={clsx(
                      "font-sans mt-0.5 w-8 shrink-0 text-xs font-semibold tabular-nums tracking-wider transition-colors",
                      isOpen ? "text-green font-bold" : "text-ink-muted/60"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "font-display block text-[1.2rem] font-semibold leading-snug tracking-tight transition-colors sm:text-[1.4rem]",
                        isOpen ? "text-green" : "text-ink group-hover:text-green"
                      )}
                    >
                      {service.title}
                    </span>
                    <span className="mt-1 block text-[14px] text-ink-soft">
                      {service.summary}
                    </span>

                    <span
                      className={clsx(
                        "grid transition-all duration-300",
                        isOpen ? "mt-3.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-3xl text-[14.5px] leading-relaxed text-ink-soft/90">
                          {service.body}
                        </span>
                      </span>
                    </span>
                  </span>

                  <span
                    className={clsx(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                      isOpen
                        ? "rotate-45 border-green bg-green text-white"
                        : "border-rule bg-card text-ink-soft group-hover:border-green group-hover:text-green"
                    )}
                  >
                    <Plus size={14} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

