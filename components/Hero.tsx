import { ArrowRight } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { SafeImage } from "./ui/SafeImage";
import { HERO as HERO_DEFAULT } from "@/data/site";
import type { HeroContent } from "@/lib/content-types";

export function Hero({ hero: HERO = HERO_DEFAULT }: { hero?: HeroContent } = {}) {
  const { main } = HERO.banner;

  return (
    <section className="on-dark relative isolate flex w-full min-h-[calc(100vh-158px)] flex-col justify-center overflow-hidden bg-green-deep">
      {/* High-res immersive drone hero banner spanning full viewport height */}
      <SafeImage
        src={main.src}
        fallbackSrc="/hero_banner.jpg"
        alt={main.alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[center_28%]"
      />

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
      <Container className="w-full pb-[clamp(40px,8vh,80px)] pt-[clamp(64px,12vh,120px)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label text-gold font-semibold tracking-[0.18em]">
            {HERO.badge || "Kerala · Tamil Nadu"}
          </span>
          <span aria-hidden className="hidden h-px w-12 bg-white/20 sm:block" />
          <span className="label text-white/80">Serving members since 2009</span>
        </div>

        <h1 className="font-display mt-3.5 max-w-[20ch] text-[clamp(2.2rem,5.2vw,4.6rem)] font-semibold leading-[1.04] tracking-tight text-white sm:mt-5">
          {HERO.title}{" "}
          {HERO.titleAccent && (
            <span className="block font-normal not-italic text-sage/90">
              {HERO.titleAccent}
            </span>
          )}
        </h1>

        <div className="mt-6 flex flex-col gap-5 sm:mt-7 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex flex-wrap items-center gap-3">
            <Button href={HERO.actionUrl || "/#services"} variant="onDark">
              {HERO.actionText || "Explore our services"}
              <ArrowRight size={15} />
            </Button>
            <Button href="/#who-we-are" variant="outlineOnDark">
              Who we are
            </Button>
          </div>
          <p className="max-w-[48ch] text-[14.5px] leading-relaxed text-white/85 sm:text-[16px]">
            {HERO.intro}
          </p>
        </div>
      </Container>
    </section>
  );
}
