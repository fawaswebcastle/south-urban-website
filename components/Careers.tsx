import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

export function Careers() {
  return (
    <section id="careers" className="scroll-mt-28 bg-paper py-12 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-green-deep border border-green px-6 py-8 sm:px-10 sm:py-10 text-white shadow-sm">
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            {/* Main content */}
            <div className="max-w-2xl">
              <span className="label text-gold flex items-center gap-2 font-semibold tracking-wider">
                <Sparkles size={13} className="text-gold" />
                JOIN OUR TEAM
              </span>
              <h2 className="font-display mt-2.5 text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl tracking-tight">
                Build your career with us
              </h2>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-white/80">
                Be part of a mission-driven organization that creates lasting impact for
                farming communities.
              </p>
            </div>

            {/* CTA Button */}
            <div className="shrink-0 pt-2 md:pt-0">
              <Button href="/#contact" variant="onDark">
                Apply now
                <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}




