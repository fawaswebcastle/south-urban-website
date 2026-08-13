"use client";

import { useState } from "react";
import Image from "next/image";
import { SafeImage } from "./ui/SafeImage";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  Users2,
  Award,
  Sparkles,
  Building2,
} from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { ScrollReveal } from "./ui/ScrollReveal";
import {
  WHO_WE_ARE as WHO_WE_ARE_DEFAULT,
  FACTS as FACTS_DEFAULT,
  IMAGES as IMAGES_DEFAULT,
} from "@/data/site";
import type { Fact, SiteImages, WhoWeAreContent } from "@/lib/content-types";

const FACT_ICONS = [CalendarDays, MapPin, Sprout, ShieldCheck];

const PILLARS = [
  {
    icon: Sprout,
    title: "Agri Input & Technical Guidance",
    desc: "Supplying certified seeds, fertilisers, and organic inputs at collective prices with field advisory support.",
  },
  {
    icon: ShieldCheck,
    title: "Democratic Governance",
    desc: "Registered under MSCS Act 2002; member-governed with complete operational transparency.",
  },
  {
    icon: Users2,
    title: "Member Welfare & Credit",
    desc: "Thrift savings, gold-linked credit, and capacity-building workshops across Kerala & Tamil Nadu.",
  },
];

const TABS = [
  {
    id: "heritage",
    label: "15+ Years Legacy",
    title: "Backbone of Rural Agricultural Communities",
    body: "Established as a member-first Multi-State Cooperative Society, South Urban has empowered thousands of farming families across Kerala and Tamil Nadu with dependable credit, collective marketing, and technical guidance.",
  },
  {
    id: "reach",
    label: "Area of Operation",
    title: "Operating Across Kerala & Tamil Nadu",
    body: "Registered under MSCS/CR/1664/2026, our operational network bridges rural smallholders with modern agribusiness tools, digital member portals, and fair market linkages.",
  },
  {
    id: "promise",
    label: "Member Promise",
    title: "Shared Prosperity & Fair Returns",
    body: "Every member holds equal democratic voting rights, a share in cooperative growth, and priority access to society credit schemes, farm machinery, and skill development programs.",
  },
];

export function WhoWeAre({
  whoWeAre: WHO_WE_ARE = WHO_WE_ARE_DEFAULT,
  facts: FACTS = FACTS_DEFAULT,
  images: IMAGES = IMAGES_DEFAULT,
}: {
  whoWeAre?: WhoWeAreContent;
  facts?: readonly Fact[];
  images?: SiteImages;
} = {}) {
  const activeTabs = (WHO_WE_ARE as any)?.tabs || TABS;
  const [activeTabId, setActiveTabId] = useState(activeTabs[0]?.id || "heritage");
  const activeTab = activeTabs.find((t: any) => t.id === activeTabId) ?? activeTabs[0] ?? TABS[0];

  return (
    <section id="who-we-are" className="scroll-mt-28 bg-paper py-20 sm:py-28">
      <Container>
        {/* Main Grid: Rich Info Column & Visual Image Card */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <ScrollReveal direction="up">
            <div>
              <div className="flex items-center gap-3">
                <span className="label text-green flex items-center gap-1.5">
                  <Sparkles size={14} className="text-green" />
                  {WHO_WE_ARE.label}
                </span>
                <span className="h-px flex-1 bg-rule/70" />
              </div>

              <h2 className="font-display mt-4 max-w-[18ch] text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-ink">
                {WHO_WE_ARE.title}{" "}
                <span className="block font-normal not-italic text-green">
                  {WHO_WE_ARE.titleAccent}
                </span>
              </h2>

              {/* Interactive Pillar Selector Tabs */}
              <div className="mt-6 flex flex-wrap gap-2">
                {activeTabs.map((tab: any) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 ${
                      tab.id === activeTab.id
                        ? "bg-green text-white shadow-xs"
                        : "bg-paper-deep text-ink-soft hover:bg-card hover:text-green border border-rule/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Body Card */}
              <div className="mt-4 rounded-2xl border border-rule/80 bg-card p-5 shadow-2xs sm:p-6">
                <h3 className="font-display text-base sm:text-lg font-semibold text-ink">
                  {activeTab.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                  {activeTab.body}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/about" variant="solid">
                  About the Society
                  <ArrowRight size={15} />
                </Button>
                <div className="flex items-center gap-2 text-[13px] font-medium text-ink-soft">
                  <CheckCircle2 size={16} className="text-green" />
                  <span>100% Member-Owned &amp; Governed</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Layered Rich Image Card Stack */}
          <ScrollReveal direction="up" delay={150}>
            <div className="relative mx-auto w-full max-w-[420px] lg:mx-0">
              {/* Ambient Backdrop Glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-green/15 via-gold/10 to-transparent blur-xl" />

              <div className="relative overflow-hidden rounded-2xl border border-rule/90 bg-card shadow-xl">
                <div className="relative h-80 sm:h-96 w-full">
                  <SafeImage
                    src={(WHO_WE_ARE as any)?.bannerImage || IMAGES.whoWeAreBanner}
                    fallbackSrc="/who_we_are_banner.png"
                    alt="South Indian cooperative member farmer standing in green field"
                    fill
                    className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 420px, 100vw"
                  />
                </div>

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-xl border border-white/20 bg-black/50 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md shadow-md">
                  <Award size={14} className="text-gold" />
                  <span>{(WHO_WE_ARE as any)?.regBadgeText || "MSCS Reg: MSCS/CR/1664/2026"}</span>
                </div>

                {/* Floating Bottom Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/25 bg-black/60 p-3.5 backdrop-blur-md shadow-lg text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold text-green-deep font-bold">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-[13.5px] font-semibold leading-tight text-white">
                        {(WHO_WE_ARE as any)?.cardTitle || "South Urban Agro Co-op"}
                      </h4>
                      <p className="text-[11.5px] text-white/80 mt-0.5">
                        {(WHO_WE_ARE as any)?.cardSubtitle || "Serving Kerala & Tamil Nadu"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 3 Core Commitment Pillars */}
        <ScrollReveal delay={200}>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {((WHO_WE_ARE as any)?.pillars || PILLARS).map((p: any) => {
              const IconMap: Record<string, any> = { Sprout, ShieldCheck, Users2 };
              const Icon = typeof p.icon === "string" ? (IconMap[p.icon] || Sprout) : (p.icon || Sprout);
              return (
                <div
                  key={p.title}
                  className="group rounded-2xl border border-rule/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-green/50 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green group-hover:bg-green group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display mt-4 text-base font-semibold text-ink group-hover:text-green transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Rich Apple-Style Metric Cards Bar */}
        <ScrollReveal delay={300}>
          <dl className="mt-14 grid grid-cols-2 gap-y-8 rounded-2xl border border-rule bg-card px-6 py-8 sm:mt-16 lg:grid-cols-4 lg:gap-y-0 lg:px-4 shadow-sm">
            {FACTS.map((fact, i) => {
              const Icon = FACT_ICONS[i] ?? Sprout;
              return (
                <div
                  key={fact.label}
                  className="px-4 text-center lg:border-l lg:border-rule lg:first:border-l-0 lg:px-6"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-rule/80 bg-paper-deep text-green shadow-2xs">
                    <Icon size={18} />
                  </span>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="font-display mt-3.5 block text-2xl font-bold leading-none text-ink sm:text-3xl">
                      {fact.value}
                    </span>
                    <span className="mx-auto mt-2 block max-w-[20ch] text-[13px] font-medium leading-snug text-ink-soft">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </ScrollReveal>
      </Container>
    </section>
  );
}
