"use client";

import { useRef } from "react";
import clsx from "clsx";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { useScrollStep } from "@/hooks/useScrollStep";
import { COMPASS as COMPASS_DEFAULT } from "@/data/site";
import type { CompassPanel } from "@/lib/content-types";

export function Compass({
  compass: COMPASS = COMPASS_DEFAULT,
}: {
  compass?: readonly CompassPanel[];
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { index, select } = useScrollStep(sectionRef, COMPASS.length);
  const panel = COMPASS[Math.min(index, COMPASS.length - 1)];

  return (
    <section
      ref={sectionRef}
      id="compass"
      className="scroll-mt-28 bg-green-deep py-16 sm:py-24 text-white"
    >
      <Container>
        <SectionHeading
          label="What guides us"
          title="Our vision, mission and the values members hold us to."
          tone="paper"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          <div
            role="tablist"
            aria-label="Vision, mission, objectives, goals and values"
            className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible"
          >
            {COMPASS.map((tab, i) => {
              const isActive = i === index;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => select(i)}
                  className={clsx(
                    "shrink-0 whitespace-nowrap text-left text-sm font-medium transition-all duration-200 rounded-lg px-4 py-2.5",
                    isActive
                      ? "bg-white text-green-deep font-semibold shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          <div className="min-h-[380px] sm:min-h-[300px] rounded-xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-xs">
            <p className="font-display text-xl leading-relaxed text-white sm:text-2xl tracking-tight">
              {panel.lead}
            </p>

            {panel.items.length > 0 && (
              <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {panel.items.map((item) => {
                  const [head, ...rest] = item.split(" — ");
                  const detail = rest.join(" — ");
                  return (
                    <li key={item} className="border-t border-white/15 pt-3">
                      {detail ? (
                        <>
                          <span className="block text-[14.5px] font-semibold text-gold">{head}</span>
                          <span className="mt-1 block text-[13.5px] leading-relaxed text-white/75">
                            {detail}
                          </span>
                        </>
                      ) : (
                        <span className="block text-[14px] leading-relaxed text-white/80">
                          {item}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

