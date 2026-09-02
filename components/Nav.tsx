"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { TopBar } from "./TopBar";
import { SiteSearch } from "./SiteSearch";
import { MegaMenuNav } from "./MegaMenu";
import {
  NAV_LINKS as NAV_LINKS_DEFAULT,
  CONTACT as CONTACT_DEFAULT,
  SOCIALS as SOCIALS_DEFAULT,
  BOARD as BOARD_DEFAULT,
  POSTS as POSTS_DEFAULT,
  SERVICES as SERVICES_DEFAULT,
} from "@/data/site";
import type { ContactInfo, NavLink, Person, Post, Service, Social } from "@/lib/content-types";

export function Nav({
  navLinks: NAV_LINKS = [],
  contact,
  socials = [],
  board = BOARD_DEFAULT,
  posts = POSTS_DEFAULT,
  services = SERVICES_DEFAULT,
  whoWeAre,
  header,
}: {
  navLinks?: readonly NavLink[];
  contact?: Partial<ContactInfo>;
  socials?: readonly Social[];
  board?: readonly Person[];
  posts?: readonly Post[];
  services?: readonly Service[];
  whoWeAre?: any;
  header?: any;
} = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const btnLabel = header?.contactBtnLabel;
  const btnHref = header?.contactBtnHref;

  return (
    <header className="sticky top-0 z-50">
      <TopBar contact={contact} socials={socials} />

      <div className="border-b border-rule/80 bg-card/95 backdrop-blur-md">
        <Container className="flex items-center justify-between gap-6 py-3.5">
          <Link href="/" aria-label="South Urban — home" className="transition-opacity hover:opacity-85">
            <Logo src={header?.logo} />
          </Link>

          <MegaMenuNav board={board} posts={posts} services={services} whoWeAre={whoWeAre} />

          <div className="flex items-center gap-3">
            <SiteSearch navLinks={NAV_LINKS} services={services} />

            {btnLabel && btnHref && (
              <div className="hidden lg:block">
                <Button href={btnHref} variant="solid">
                  {btnLabel}
                  <ArrowUpRight size={15} />
                </Button>
              </div>
            )}

            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-ink transition-colors hover:bg-paper-deep lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </Container>
      </div>

      {mobileOpen && (
        <div className="border-b border-rule bg-card lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Container className="flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-rule/50 py-3 text-sm font-medium text-ink transition-colors hover:text-green last:border-0"
              >
                {link.label}
              </Link>
            ))}
            {btnLabel && btnHref && (
              <Button href={btnHref} variant="solid" className="mt-4 justify-center">
                {btnLabel}
                <ArrowUpRight size={15} />
              </Button>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}

