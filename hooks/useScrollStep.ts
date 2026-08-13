"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives an index from how far a section has travelled through the viewport,
 * so stepped content advances as the visitor scrolls.
 *
 * Section geometry is measured on mount/resize rather than on every scroll:
 * the stepped content changes its own height when it opens, and reading a live
 * height would feed that back into the progress calculation and oscillate.
 */
export function useScrollStep(
  ref: RefObject<HTMLElement | null>,
  count: number
) {
  const [index, setIndex] = useState(0);
  const box = useRef({ top: 0, height: 0 });
  // A manual click wins briefly, so scrolling doesn't snatch the choice back.
  const holdUntil = useRef(0);

  const select = useCallback((i: number) => {
    holdUntil.current = Date.now() + 1500;
    setIndex(i);
  }, []);

  useEffect(() => {
    if (count < 1) return;
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      box.current = { top: rect.top + window.scrollY, height: el.offsetHeight };
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      if (Date.now() < holdUntil.current) return;
      const { top, height } = box.current;
      const vh = window.innerHeight;
      const travelled = window.scrollY + vh - top;
      const total = height + vh;
      if (travelled < 0 || travelled > total) return; // section not on screen
      const p = Math.min(0.9999, Math.max(0, travelled / total));
      setIndex(Math.floor(p * count));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ref, count]);

  return { index, select };
}
