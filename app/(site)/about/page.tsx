import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  CreditCard,
  Eye,
  FileText,
  Gem,
  HandCoins,
  Handshake,
  IdCard,
  Leaf,
  Lightbulb,
  MapPin,
  Milk,
  PackageCheck,
  Scale,
  ScrollText,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  TrendingUp,
  Users2,
  Warehouse,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About the Society — South Urban Agro Multi State Co-operative Society Ltd.",
  description:
    "How South Urban Agro Multi State Co-operative Society Ltd. is constituted, what a multi-state agro cooperative does, our vision, mission, values and how to become a member.",
};

/** Data files name their icon; the page owns the mapping so `data/site.ts`
 *  stays free of component imports. */
const ICONS = {
  BadgeCheck,
  Camera,
  CreditCard,
  Eye,
  FileText,
  Gem,
  HandCoins,
  Handshake,
  IdCard,
  Leaf,
  Lightbulb,
  Milk,
  PackageCheck,
  Scale,
  ScrollText,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  TrendingUp,
  Users2,
  Warehouse,
} as const;

const DETAIL_ICONS = [CalendarDays, BadgeCheck, Building2, MapPin];

export default async function AboutPage() {
  // Editable in the admin; falls back to data/site.ts when the database has no
  // row for a block. See lib/content.ts.
  const {
    companyDetails: COMPANY_DETAILS,
    coopActivities: COOP_ACTIVITIES,
    coopPrinciples: COOP_PRINCIPLES,
    facts: FACTS,
    goals: GOALS,
    images: IMAGES,
    membership: MEMBERSHIP,
    mission: MISSION,
    objectives: OBJECTIVES,
    overview: OVERVIEW,
    values: VALUES,
    vision: VISION,
    whoWeAre: WHO_WE_ARE,
  } = await getContent();

  return (
    <main>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-green-deep">
        <Image
          src="/hero_banner.jpg"
          alt=""
          aria-hidden
          fill
          priority
          className="object-cover object-center opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-deep via-green-deep/85 to-green-deep/55" />

        <Container className="relative py-16 sm:py-24 lg:py-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <span className="label text-gold">{WHO_WE_ARE.label}</span>
              <h1 className="font-display mt-3 max-w-[16ch] text-[clamp(2.3rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-tight text-white">
                {WHO_WE_ARE.title}{" "}
                <span className="block font-normal text-gold">
                  {WHO_WE_ARE.titleAccent}
                </span>
              </h1>
            </div>

            <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-white/80 lg:pb-2">
              {WHO_WE_ARE.lead}
            </p>
          </div>

          {/* Key facts, sitting on the banner rather than in a slab of their own */}
          <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-white/15 pt-8 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="px-1 lg:border-l lg:border-white/15 lg:first:border-l-0 lg:px-8 lg:first:pl-0">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="font-display block text-3xl font-semibold leading-none text-white sm:text-4xl">
                    {fact.value}
                  </span>
                  <span className="mt-2 block max-w-[18ch] text-[12.5px] leading-snug text-white/65">
                    {fact.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ------------------------------------------- What a coop actually does */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* Layered image pair */}
            <ScrollReveal direction="up">
              <div className="relative mx-auto w-full max-w-[460px] lg:sticky lg:top-32 lg:mx-0">
                <div className="relative h-[380px] overflow-hidden rounded-2xl border border-rule/80 bg-card shadow-lg sm:h-[460px]">
                  <Image
                    src={IMAGES.harvest}
                    alt="A member harvesting paddy by hand at golden hour"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 460px, 100vw"
                  />
                </div>

                <div className="absolute -bottom-8 -right-2 h-40 w-40 overflow-hidden rounded-2xl border-4 border-paper bg-card shadow-xl sm:h-48 sm:w-48 lg:-right-8">
                  <Image
                    src={IMAGES.award}
                    alt="Two members holding a cooperative excellence award beside their paddy field"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/55 px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-md backdrop-blur-md">
                  <ShieldCheck size={14} className="text-gold" />
                  Registered under the MSCS Act, 2002
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <div className="lg:pt-4">
                <span className="label text-green">{OVERVIEW.label}</span>
                <h2 className="font-display mt-3 max-w-[20ch] text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-ink">
                  {OVERVIEW.title}
                </h2>

                <div className="mt-6 space-y-5 text-[15.5px] leading-relaxed text-ink-soft">
                  {[...OVERVIEW.body, ...COOP_PRINCIPLES].map((p, i) => (
                    <p key={`overview-${i}`}>{p}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Activity areas */}
          <ScrollReveal delay={150}>
            <div className="mt-24 border-t border-rule pt-12 lg:mt-28">
              <h3 className="font-display max-w-[24ch] text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
                What the Society puts its resources behind
              </h3>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {COOP_ACTIVITIES.map((item) => {
                  const Icon = ICONS[item.icon];
                  return (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-rule/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-green/50 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green transition-colors group-hover:bg-green group-hover:text-white">
                        <Icon size={19} />
                      </span>
                      <h4 className="font-display mt-4 text-[15.5px] font-semibold text-ink">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ------------------------------------------------- Registration record */}
      <section className="bg-paper-deep py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl border border-rule/80 bg-card shadow-sm">
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                <div className="relative min-h-[280px] lg:min-h-full">
                  <Image
                    src={IMAGES.whoWeAreBanner}
                    alt="A member farmer standing in his field at golden hour"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 480px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-deep/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="font-display text-[15px] font-semibold leading-snug">
                      One membership, two states
                    </p>
                    <p className="mt-1 text-[12.5px] text-white/75">
                      Kerala and Tamil Nadu, on a single Society record.
                    </p>
                  </div>
                </div>

                <div className="p-7 sm:p-10 lg:p-12">
                  <span className="label text-green">Company details</span>
                  <h2 className="font-display mt-3 max-w-[22ch] text-2xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-3xl">
                    Constituted under the MSCS Act, 2002
                  </h2>
                  <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
                    {COMPANY_DETAILS.intro}
                  </p>

                  <dl className="mt-9 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                    {COMPANY_DETAILS.rows.map((row, i) => {
                      const Icon = DETAIL_ICONS[i] ?? BadgeCheck;
                      return (
                        <div key={row.label} className="flex gap-3.5">
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rule bg-paper-deep text-green">
                            <Icon size={17} />
                          </span>
                          <div>
                            <dt className="label text-ink-soft/70">{row.label}</dt>
                            <dd className="mt-1.5 text-[14.5px] font-medium leading-snug text-ink">
                              {row.value}
                            </dd>
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ---------------------------------------------------- Vision & Mission */}
      <section className="on-dark relative isolate overflow-hidden border-t border-white/10 bg-green-deep py-20 sm:py-28">
        {/* One warm pool of light so the slab reads as depth rather than paint */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-52 -top-52 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(201,156,39,0.15),transparent_70%)]"
        />

        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch lg:gap-16">
            {/* The vision, set on a plate — this Society is a constituted body,
             *  so its statement is inscribed rather than typed onto the page. */}
            <ScrollReveal className="lg:h-full">
              <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-[1.75rem] border border-gold/25 shadow-[0_40px_90px_-50px_rgb(0,0,0)]">
                <Image
                  src={IMAGES.drone}
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 680px, 100vw"
                />
                <div className="absolute inset-0 bg-green-deep/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-green-deep/50 via-green-deep/78 to-green-deep/94" />
                {/* Inset rule: the plate's engraved edge */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 rounded-[1.35rem] border border-white/10"
                />

                <div className="relative px-8 py-10 sm:px-12 sm:py-14">
                  <span className="label text-gold">{VISION.label}</span>
                  <p className="font-display mt-6 text-[clamp(1.3rem,2.1vw,1.85rem)] font-normal leading-[1.36] tracking-tight text-white">
                    {VISION.statement}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* The mission, railed by the field each commitment belongs to */}
            <ScrollReveal delay={120}>
              <div className="lg:pt-2">
                <span className="label text-gold">{MISSION.label}</span>
                <h2 className="font-display mt-3 max-w-[26ch] text-[clamp(1.3rem,2vw,1.65rem)] font-semibold leading-[1.22] tracking-tight text-white">
                  {MISSION.lead}
                </h2>

                <ul className="mt-9 border-t border-white/15">
                  {MISSION.items.map((item) => (
                    <li
                      key={item.focus}
                      className="group border-b border-white/15 py-5 transition-colors duration-300 hover:border-gold/50"
                    >
                      <div className="sm:flex sm:items-baseline sm:gap-5">
                        <span className="label block shrink-0 text-gold/85 transition-colors duration-300 group-hover:text-gold sm:w-[6.75rem]">
                          {item.focus}
                        </span>
                        <p className="mt-2 text-[15px] leading-relaxed text-white/75 transition-colors duration-300 group-hover:text-white/95 sm:mt-0">
                          {item.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Objectives */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <ScrollReveal>
              <div className="lg:sticky lg:top-32">
                <span className="label text-green">Objectives</span>
                <h2 className="font-display mt-3 max-w-[16ch] text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-ink">
                  Four commitments that shape the working day
                </h2>

                <div className="relative mt-8 h-[300px] overflow-hidden rounded-2xl border border-rule/80 bg-card shadow-md sm:h-[340px]">
                  <Image
                    src={IMAGES.polyhouse}
                    alt="A field officer checking crop health data on a tablet inside a polyhouse"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 420px, 100vw"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <ul className="divide-y divide-rule border-y border-rule">
                {OBJECTIVES.map((obj, i) => {
                  const Icon = ICONS[obj.icon];
                  return (
                    <li
                      key={obj.title}
                      className="group flex gap-5 py-7 transition-colors first:pt-0 sm:gap-7"
                    >
                      <span className="font-display w-8 shrink-0 pt-1 text-[13px] font-semibold text-green/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green transition-colors group-hover:bg-green group-hover:text-white">
                        <Icon size={20} />
                      </span>

                      <div>
                        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                          {obj.title}
                        </h3>
                        <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-ink-soft">
                          {obj.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- Values */}
      <section className="bg-paper-deep py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="max-w-2xl">
              <span className="label text-green">Values</span>
              <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-ink">
                Seven principles our members hold us to
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Image tile, sized to sit in the grid as an eighth card */}
              <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-rule/80 shadow-sm sm:col-span-2 sm:row-span-2 sm:min-h-full">
                <Image
                  src={IMAGES.memberMeeting}
                  alt="Members meeting a Society field officer under a banyan tree"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-deep/85 via-green-deep/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <Handshake size={26} className="text-gold" aria-hidden />
                  <p className="font-display mt-3 max-w-[22ch] text-xl font-semibold leading-snug">
                    Every member has one equal voice, and a share in what the
                    Society earns.
                  </p>
                </div>
              </div>

              {VALUES.map((value) => {
                const Icon = ICONS[value.icon];
                return (
                  <div
                    key={value.title}
                    className="group rounded-2xl border border-rule/80 bg-card p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-green/50 hover:shadow-md"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green/10 text-green transition-colors group-hover:bg-green group-hover:text-white">
                      <Icon size={17} />
                    </span>
                    <h3 className="font-display mt-3.5 text-[15px] font-semibold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                      {value.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Membership */}
      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="max-w-2xl">
              <span className="label text-green">{MEMBERSHIP.label}</span>
              <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-ink">
                {MEMBERSHIP.title}
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
                {MEMBERSHIP.intro}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr_0.95fr]">
            {MEMBERSHIP.classes.map((cls, i) => (
              <ScrollReveal key={cls.name} delay={100 + i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-rule/80 bg-card p-7 shadow-2xs transition-shadow duration-300 hover:shadow-md">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {cls.name}
                    </h3>
                    <span className="label text-ink-soft/70">{cls.tagline}</span>
                  </div>

                  <dl className="mt-6 space-y-0 border-t border-rule">
                    {cls.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 border-b border-rule/70 py-3"
                      >
                        <dt className="text-[14px] text-ink-soft">{row.label}</dt>
                        <dd className="text-[14.5px] font-medium tabular-nums text-ink">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <span className="max-w-[14ch] text-[12.5px] leading-snug text-ink-soft">
                      {cls.totalLabel}
                    </span>
                    <span className="font-display text-3xl font-semibold leading-none tabular-nums text-green">
                      {cls.total}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {/* Documents required, over the member-card photograph */}
            <ScrollReveal delay={260}>
              <div className="relative h-full min-h-[380px] overflow-hidden rounded-2xl border border-rule/80 shadow-sm">
                <Image
                  src="/hero_banner.jpg"
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 400px, 100vw"
                />
                <div className="absolute inset-0 bg-green-deep/80 backdrop-blur-[2px]" />

                <div className="relative flex h-full flex-col p-7 text-white">
                  <span className="label text-gold">Documents required</span>
                  <ul className="mt-6 space-y-4">
                    {MEMBERSHIP.documents.map((doc) => {
                      const Icon = ICONS[doc.icon];
                      return (
                        <li key={doc.label} className="flex items-center gap-3.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-gold">
                            <Icon size={17} />
                          </span>
                          <span className="text-[14.5px] font-medium">
                            {doc.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- Goals & CTA */}
      <section className="on-dark relative isolate overflow-hidden bg-green">
        <Image
          src={IMAGES.drone}
          alt=""
          aria-hidden
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-deep/95 to-green/80" />

        <Container className="relative py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
            <div>
              <span className="label text-gold">{GOALS.label}</span>
              <h2 className="font-display mt-3 max-w-[12ch] text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.12] tracking-tight text-white">
                What we are working towards
              </h2>
            </div>

            <div>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-white/85">
                {GOALS.statement}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="/#services" variant="onDark">
                  Explore our services
                  <ArrowRight size={15} />
                </Button>
                <Button href="/#contact" variant="outlineOnDark">
                  Talk to the Society
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
