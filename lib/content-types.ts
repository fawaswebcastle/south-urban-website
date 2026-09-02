/**
 * The shapes the public components render.
 *
 * These are written out rather than derived from `data/site.ts` with
 * `typeof`, because that file uses `as const`: its inferred types are exact
 * tuples of string literals, which a row loaded from the database can never
 * satisfy. Components take these instead, so the same component renders the
 * checked-in defaults and admin-edited content interchangeably.
 *
 * Safe to import from client components — types only, no runtime code.
 */

import type { PostBlock } from "@/data/site";

export type NavLink = { label: string; href: string };

export type Social = { name: string; href: string };

export type Fact = { value: string; label: string };

export type Person = {
  name: string;
  role: string;
  photo: string;
  photoPosition?: string;
  teaser: string;
  bio: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  read: string;
  image: string;
  date: string;
  dateLabel: string;
  category: string;
  author: string;
  body: readonly PostBlock[];
};

export type Service = { title: string; summary: string; body: string };

export type Notification = {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  hasDownload: boolean;
  documentUrl?: string;
};

export type GalleryItem = { src: string; alt: string; category: string };

export type ContactInfo = {
  tag?: string;
  title?: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
};

export type CompanyDetails = {
  intro: string;
  rows: readonly { label: string; value: string }[];
};

export type HeroContent = {
  title: string;
  titleAccent: string;
  intro: string;
  banner: {
    main: { src: string; alt: string; caption: string };
    side: readonly { src: string; alt: string; caption: string; note: string }[];
  };
};

export type WhoWeAreContent = {
  label: string;
  title: string;
  titleAccent: string;
  lead: string;
  body: readonly string[];
};

/** The named image slots the About page and hero read from. */
export type SiteImages = Record<string, string>;

export type CompassPanel = {
  id: string;
  title: string;
  lead: string;
  items: readonly string[];
};

export type FooterContent = {
  description: string;
  regText: string;
  areaText: string;
  quickLinksTitle: string;
  quickLinks: readonly NavLink[];
  contactTitle: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
  actText: string;
  logo?: string;
};

