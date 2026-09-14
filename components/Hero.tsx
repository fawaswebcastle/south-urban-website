"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { SafeImage } from "./ui/SafeImage";
import { HERO as HERO_DEFAULT } from "@/data/site";
import type { HeroContent, BannerSlide } from "@/lib/content-types";

export function Hero({ hero: HERO = HERO_DEFAULT }: { hero?: HeroContent } = {}) {
  const slides: BannerSlide[] =
    HERO.slides && HERO.slides.length > 0
      ? [...HERO.slides]
      : [
          {
            badge: HERO.badge || "Kerala · Tamil Nadu",
            title: HERO.title,
            titleAccent: HERO.titleAccent,
            intro: HERO.intro,
            actionText: HERO.actionText || "Explore our services",
            actionUrl: HERO.actionUrl || "/#services",
            secondaryActionText: HERO.secondaryActionText || "Who we are",
            secondaryActionUrl: HERO.secondaryActionUrl || "/#who-we-are",
            bgImage: HERO.banner?.main?.src || "/hero_banner.jpg",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length, isPaused]);

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <section
      className="on-dark relative isolate flex w-full min-h-[calc(100vh-158px)] flex-col justify-center overflow-hidden bg-green-deep select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images Layer with smooth fade */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id || `slide-bg-${idx}`}
            className={`absolute inset-0 -z-20 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <SafeImage
              src={slide.bgImage || "/hero_banner.jpg"}
              fallbackSrc="/hero_banner.jpg"
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-[center_28%]"
            />
          </div>
        );
      })}

      {/* Balanced editorial gradient scrim matching logo green */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-full md:w-3/5 bg-[linear-gradient(to_right,rgba(11,71,36,0.88)_0%,rgba(11,71,36,0.5)_50%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[linear-gradient(to_top,rgba(11,71,36,0.95)_0%,rgba(11,71,36,0.6)_40%,transparent_100%)]"
      />

      {/* Hero content */}
      <Container className="relative w-full pb-[clamp(40px,8vh,80px)] pt-[clamp(64px,12vh,120px)]">
        <div key={`content-${currentIndex}`} className="transition-all duration-700 ease-out">
          <div className="flex flex-wrap items-center gap-3">
            <span className="label text-gold font-semibold tracking-[0.18em]">
              {activeSlide.badge || "Kerala · Tamil Nadu"}
            </span>
            <span aria-hidden className="hidden h-px w-12 bg-white/20 sm:block" />
            <span className="label text-white/80">Serving members since 2009</span>
          </div>

          <h1 className="font-display mt-3.5 max-w-[20ch] text-[clamp(2.2rem,5.2vw,4.6rem)] font-semibold leading-[1.04] tracking-tight text-white sm:mt-5">
            {activeSlide.title}{" "}
            {activeSlide.titleAccent && (
              <span className="block font-normal not-italic text-sage/90">
                {activeSlide.titleAccent}
              </span>
            )}
          </h1>

          <div className="mt-6 flex flex-col gap-5 sm:mt-7 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex flex-wrap items-center gap-3">
              <Button href={activeSlide.actionUrl || "/#services"} variant="onDark">
                {activeSlide.actionText || "Explore our services"}
                <ArrowRight size={15} />
              </Button>
              {activeSlide.secondaryActionText && (
                <Button
                  href={activeSlide.secondaryActionUrl || "/#who-we-are"}
                  variant="outlineOnDark"
                >
                  {activeSlide.secondaryActionText}
                </Button>
              )}
            </div>
            <p className="max-w-[48ch] text-[14.5px] leading-relaxed text-white/85 sm:text-[16px]">
              {activeSlide.intro}
            </p>
          </div>
        </div>

        {/* Multi-slide Navigation Controls (only shown if > 1 slide) */}
        {slides.length > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-white/15 pt-6">
            {/* Slide Pagination Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-gold"
                      : "w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
              <span className="ml-3 text-[12px] font-mono text-white/60">
                0{currentIndex + 1} / 0{slides.length}
              </span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-all hover:border-gold hover:bg-gold hover:text-ink"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-all hover:border-gold hover:bg-gold hover:text-ink"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
