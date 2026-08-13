"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { SafeImage } from "./ui/SafeImage";
import { BOARD as BOARD_DEFAULT, MANAGEMENT as MANAGEMENT_DEFAULT } from "@/data/site";
import type { Person } from "@/lib/content-types";

export function Leadership({
  board: BOARD = BOARD_DEFAULT,
  management: MANAGEMENT = MANAGEMENT_DEFAULT,
}: {
  board?: readonly Person[];
  management?: readonly Person[];
} = {}) {
  const [active, setActive] = useState<Person | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="leadership" className="scroll-mt-28 bg-paper py-16 sm:py-24">
      <Container>
        <SectionHeading
          label="Leadership & governance"
          title="The people accountable to our members."
          intro="Six directors and a four-person executive team. Select anyone to read their full background."
        />

        <p className="label mt-12 text-ink-soft/70">Board of Directors</p>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
          {BOARD.map((p, i) => (
            <PersonCard key={`${p.name}-board-${i}`} person={p} onOpen={setActive} />
          ))}
        </div>

        <p className="label mt-16 text-ink-soft/70">Executive Board</p>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {MANAGEMENT.map((p, i) => (
            <PersonCard key={`${p.name}-exec-${i}`} person={p} onOpen={setActive} />
          ))}
        </div>
      </Container>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-6"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-card p-6 sm:rounded-2xl sm:p-8 border border-rule shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-rule">
                  <SafeImage
                    src={active.photo}
                    fallbackSrc="/sujan_mathew.jpg"
                    alt={active.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <h3 className="font-display text-[1.3rem] font-semibold leading-tight text-ink">
                    {active.name}
                  </h3>
                  <p className="text-[13px] font-medium text-green">{active.role}</p>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close profile"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rule text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <p className="mt-6 text-[14.5px] leading-relaxed text-ink-soft">{active.bio}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function PersonCard({
  person,
  onOpen,
}: {
  person: Person;
  onOpen: (p: Person) => void;
}) {
  return (
    <button
      onClick={() => onOpen(person)}
      className="group flex h-full w-full flex-col text-left focus:outline-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-paper-deep border border-rule/70 shadow-xs">
        <SafeImage
          src={person.photo}
          fallbackSrc="/sujan_mathew.jpg"
          alt={person.name}
          fill
          className={clsx(
            "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            person.photoPosition ?? "object-top"
          )}
          sizes="(min-width: 1024px) 300px, 45vw"
        />
      </div>
      <h3 className="font-display mt-3 text-[0.98rem] font-semibold leading-tight text-ink transition-colors group-hover:text-green sm:mt-3.5 sm:text-[1.1rem]">
        {person.name}
      </h3>
      <p className="mt-0.5 text-[12px] font-medium text-green sm:text-[13px]">{person.role}</p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft sm:text-[13.5px]">{person.teaser}</p>
      <span className="mt-2 inline-block border-b border-ink/20 pb-0.5 text-[12px] font-medium text-ink transition-colors group-hover:border-green group-hover:text-green">
        Read full profile
      </span>
    </button>
  );
}
