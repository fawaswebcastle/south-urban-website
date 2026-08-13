"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ShieldCheck,
  Award,
  Users,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Coins,
  Tractor,
  GraduationCap,
} from "lucide-react";
import { Container } from "./ui/Container";
import {
  BOARD as BOARD_DEFAULT,
  POSTS as POSTS_DEFAULT,
  SERVICES as SERVICES_DEFAULT,
} from "@/data/site";
import type { Person, Post, Service } from "@/lib/content-types";

type NavTab =
  | "About Us"
  | "Services"
  | "Leadership"
  | "Careers"
  | "Gallery"
  | "Blogs"
  | null;

export function MegaMenuNav({
  board: BOARD = BOARD_DEFAULT,
  posts: POSTS = POSTS_DEFAULT,
  services: SERVICES = SERVICES_DEFAULT,
  whoWeAre,
}: {
  board?: readonly Person[];
  posts?: readonly Post[];
  services?: readonly Service[];
  whoWeAre?: any;
} = {}) {
  const [activeTab, setActiveTab] = useState<NavTab>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (tab: NavTab) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveTab(tab);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      {/* Rich Navbar Item Links */}
      <nav className="hidden items-center gap-1.5 lg:flex">
        <NavButton
          label="About Us"
          href="#who-we-are"
          active={activeTab === "About Us"}
          onMouseEnter={() => handleMouseEnter("About Us")}
        />
        <NavButton
          label="Services"
          href="#services"
          active={activeTab === "Services"}
          onMouseEnter={() => handleMouseEnter("Services")}
        />
        <NavButton
          label="Leadership"
          href="#leadership"
          active={activeTab === "Leadership"}
          onMouseEnter={() => handleMouseEnter("Leadership")}
        />
        <NavButton
          label="Careers"
          href="#careers"
          active={activeTab === "Careers"}
          onMouseEnter={() => handleMouseEnter("Careers")}
        />
        <NavButton
          label="Gallery"
          href="#gallery"
          active={activeTab === "Gallery"}
          onMouseEnter={() => handleMouseEnter("Gallery")}
        />
        <NavButton
          label="Blogs"
          href="/blog"
          active={activeTab === "Blogs"}
          onMouseEnter={() => handleMouseEnter("Blogs")}
        />
      </nav>

      {/* Rich Mega Menu Floating Panel Overlay */}
      {activeTab && (
        <div
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-2 w-screen max-w-5xl px-4 animate-in fade-in-50 slide-in-from-top-2 duration-200"
        >
          <div className="overflow-hidden rounded-2xl border border-rule/80 bg-card/98 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
            {activeTab === "About Us" && (
              <AboutMegaContent
                onClose={() => setActiveTab(null)}
                whoWeAre={whoWeAre}
              />
            )}
            {activeTab === "Services" && (
              <ServicesMegaContent
                onClose={() => setActiveTab(null)}
                services={SERVICES}
              />
            )}
            {activeTab === "Leadership" && (
              <LeadershipMegaContent
                onClose={() => setActiveTab(null)}
                board={BOARD}
              />
            )}
            {activeTab === "Careers" && (
              <CareersMegaContent onClose={() => setActiveTab(null)} />
            )}
            {activeTab === "Gallery" && (
              <GalleryMegaContent onClose={() => setActiveTab(null)} />
            )}
            {activeTab === "Blogs" && (
              <BlogsMegaContent
                onClose={() => setActiveTab(null)}
                posts={POSTS}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  label,
  href,
  active,
  onMouseEnter,
}: {
  label: string;
  href: string;
  active: boolean;
  onMouseEnter: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      className={`group relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-[14px] font-semibold tracking-tight transition-all duration-200 ${
        active
          ? "bg-paper-deep text-green"
          : "text-ink/85 hover:bg-paper-deep/80 hover:text-green"
      }`}
    >
      <span>{label}</span>
      <ChevronDown
        size={13}
        className={`transition-transform duration-200 ${
          active
            ? "rotate-180 text-green"
            : "text-ink-soft/70 group-hover:text-green"
        }`}
      />
    </Link>
  );
}

/* =========================================================================
   Mega Menu Contents
   ========================================================================= */

function AboutMegaContent({
  onClose,
  whoWeAre,
}: {
  onClose: () => void;
  whoWeAre?: any;
}) {
  const badgeText = whoWeAre?.regBadgeText || "MSCS Reg: MSCS/CR/1664/2026";
  const desc =
    whoWeAre?.body?.[0] ||
    whoWeAre?.lead ||
    "Registered under the Multi State Cooperative Societies Act, 2002. Serving member farmers across Kerala & Tamil Nadu with transparency and democratic governance.";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green">
          <ShieldCheck size={18} />
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
            Cooperative Overview
          </h4>
        </div>
        <p className="text-[13.5px] leading-relaxed text-ink-soft">{desc}</p>
        <div className="inline-flex items-center gap-2 rounded-lg bg-green/10 px-3 py-1.5 text-[12px] font-medium text-green">
          {badgeText}
        </div>
      </div>

      <div className="space-y-3 border-l border-rule/60 pl-6">
        <div className="flex items-center gap-2 text-green">
          <Sparkles size={18} />
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
            Vision &amp; Values
          </h4>
        </div>
        <p className="text-[13.5px] leading-relaxed text-ink-soft">
          To empower rural agricultural communities with affordable credit,
          quality farm inputs, direct market linkages, and member welfare
          programs.
        </p>
        <Link
          href="#who-we-are"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green hover:underline"
        >
          Read full society history &rarr;
        </Link>
      </div>

      <div className="rounded-xl bg-paper-deep p-4 border border-rule/70 space-y-3">
        <span className="label text-green">Member Services</span>
        <h5 className="font-display text-base font-semibold text-ink">
          Member Benefit Brochure
        </h5>
        <p className="text-[12.5px] text-ink-soft leading-relaxed">
          Download our comprehensive guide detailing member rights, credit
          schemes, and thrift options.
        </p>
        <Link
          href="#contact"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-green px-3 py-2 text-[12.5px] font-medium text-white shadow-xs hover:bg-green-deep transition-colors"
        >
          Request Brochure &rarr;
        </Link>
      </div>
    </div>
  );
}

function ServicesMegaContent({
  onClose,
  services = SERVICES_DEFAULT,
}: {
  onClose: () => void;
  services?: readonly Service[];
}) {
  const topServices = services.slice(0, 4);
  const ICONS = [
    <Coins key="1" size={18} className="text-green" />,
    <TrendingUp key="2" size={18} className="text-green" />,
    <Award key="3" size={18} className="text-green" />,
    <Tractor key="4" size={18} className="text-green" />,
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-rule/70 pb-3">
        <div>
          <h4 className="font-display text-base font-semibold text-ink">
            Member Financial &amp; Agricultural Services
          </h4>
          <p className="text-[12.5px] text-ink-soft">
            {services.length} specialized solutions exclusively for cooperative
            society members
          </p>
        </div>
        <Link
          href="#services"
          onClick={onClose}
          className="text-[12.5px] font-medium text-green hover:underline flex items-center gap-1"
        >
          View all {services.length} services &rarr;
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topServices.map((service, i) => (
          <ServiceTile
            key={service.title}
            icon={ICONS[i % ICONS.length]}
            title={service.title}
            desc={service.summary || service.body || ""}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceTile({
  icon,
  title,
  desc,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClose: () => void;
}) {
  return (
    <Link
      href="#services"
      onClick={onClose}
      className="group rounded-xl border border-rule/70 bg-paper/60 p-3.5 transition-all hover:border-green/50 hover:bg-card shadow-2xs"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green/10">
          {icon}
        </div>
        <h5 className="font-display text-[13.5px] font-semibold text-ink group-hover:text-green transition-colors">
          {title}
        </h5>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-soft line-clamp-2">
        {desc}
      </p>
    </Link>
  );
}

function LeadershipMegaContent({
  onClose,
  board: BOARD = BOARD_DEFAULT,
}: {
  onClose: () => void;
  board?: readonly Person[];
}) {
  const topBoard = BOARD.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-rule/70 pb-3">
        <div>
          <h4 className="font-display text-base font-semibold text-ink">
            Board of Directors &amp; Governance
          </h4>
          <p className="text-[12.5px] text-ink-soft">
            Seasoned leaders accountable to our members
          </p>
        </div>
        <Link
          href="#leadership"
          onClick={onClose}
          className="text-[12.5px] font-medium text-green hover:underline"
        >
          Meet all directors &rarr;
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {topBoard.map((person, i) => (
          <Link
            key={`${person.name}-top-${i}`}
            href="#leadership"
            onClick={onClose}
            className="group flex items-center gap-3 rounded-xl border border-rule/70 bg-paper/60 p-3 transition-all hover:border-green/50 hover:bg-card shadow-2xs"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-rule">
              <Image
                src={person.photo}
                alt={person.name}
                fill
                className="object-cover object-top"
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <h5 className="font-display text-[13.5px] font-semibold text-ink group-hover:text-green transition-colors truncate">
                {person.name}
              </h5>
              <p className="text-[11.5px] font-medium text-green">
                {person.role}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CareersMegaContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green">
          <Briefcase size={18} />
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
            Careers at South Urban
          </h4>
        </div>
        <p className="text-[13.5px] leading-relaxed text-ink-soft">
          Build a rewarding career serving agricultural communities across
          Kerala and Tamil Nadu.
        </p>
        <Link
          href="#careers"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-green hover:underline"
        >
          View open positions &rarr;
        </Link>
      </div>

      <div className="rounded-xl border border-green/30 bg-green/5 p-4 space-y-2">
        <span className="label text-green">Featured Job Opening</span>
        <h5 className="font-display text-base font-semibold text-ink">
          Field Agriculture Officer
        </h5>
        <p className="text-[12.5px] text-ink-soft">
          Full-time &bull; Operations &bull; Field Work across Kerala &amp;
          Tamil Nadu
        </p>
        <Link
          href="#careers"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-green hover:underline pt-1"
        >
          Apply online now &rarr;
        </Link>
      </div>
    </div>
  );
}

function GalleryMegaContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-rule/70 pb-3">
        <div className="flex items-center gap-2 text-green">
          <ImageIcon size={18} />
          <h4 className="font-display text-base font-semibold text-ink">
            Visual Story from the Field
          </h4>
        </div>
        <Link
          href="#gallery"
          onClick={onClose}
          className="text-[12.5px] font-medium text-green hover:underline"
        >
          Open photo gallery &rarr;
        </Link>
      </div>
      <p className="text-[13.5px] text-ink-soft">
        Explore high-resolution photography capturing drone field operations,
        member card distribution, dairy units, and harvesting across Kerala and
        Tamil Nadu.
      </p>
    </div>
  );
}

function BlogsMegaContent({
  onClose,
  posts: POSTS = POSTS_DEFAULT,
}: {
  onClose: () => void;
  posts?: readonly Post[];
}) {
  const latest = POSTS[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-rule/70 pb-3">
        <div className="flex items-center gap-2 text-green">
          <BookOpen size={18} />
          <h4 className="font-display text-base font-semibold text-ink">
            Agri Insights &amp; Market News
          </h4>
        </div>
        <Link
          href="/blog"
          onClick={onClose}
          className="text-[12.5px] font-medium text-green hover:underline"
        >
          View all blog posts &rarr;
        </Link>
      </div>

      <Link
        href={`/blog/${latest.slug}`}
        onClick={onClose}
        className="group flex items-center gap-4 rounded-xl border border-rule/70 bg-paper/60 p-3 transition-colors hover:border-green/50"
      >
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-rule">
          <Image
            src={latest.image}
            alt={latest.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div>
          <span className="label text-green">{latest.read}</span>
          <h5 className="font-display text-[14px] font-semibold text-ink line-clamp-1 transition-colors group-hover:text-green">
            {latest.title}
          </h5>
          <p className="text-[12.5px] text-ink-soft line-clamp-1 mt-0.5">
            {latest.excerpt}
          </p>
        </div>
      </Link>
    </div>
  );
}
