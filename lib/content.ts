/**
 * Reads published content for the public site.
 *
 * Every getter falls back to the matching export in `data/site.ts` when the
 * database has no row, is empty, or is unreachable. That is deliberate:
 *
 *  - the site renders correctly before anyone has run a migration or seeded,
 *  - a database outage degrades to the last-known-good copy in the repo rather
 *    than to a 500,
 *  - and `data/site.ts` stays meaningful as the checked-in default, so a
 *    reviewer can still read the site's copy in the diff.
 *
 * Server components only — importing this from a client component will pull
 * Prisma into the browser bundle.
 */

import "server-only";
import { unstable_cache } from "next/cache";
import { getPrisma, hasDatabase } from "./db";
import * as defaults from "@/data/site";

export const CONTENT_TAG = "content";

type Json = Record<string, unknown>;

/** Swallows database errors so the public site falls back instead of failing. */
async function safe<T>(run: () => Promise<T>, fallback: T, label: string): Promise<T> {
  if (!hasDatabase) return fallback;
  try {
    return await run();
  } catch (error) {
    console.error(`[content] ${label} fell back to data/site.ts:`, error);
    return fallback;
  }
}

/** One round trip for all singleton blocks; cached until a save revalidates. */
const loadSections = unstable_cache(
  async (): Promise<Record<string, Json>> => {
    const rows = await getPrisma().section.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.data as Json]));
  },
  ["sections"],
  { tags: [CONTENT_TAG] }
);

async function sections(): Promise<Record<string, Json>> {
  return safe(() => loadSections(), {}, "sections");
}

/**
 * A stored section merged over its static default, so a record written before a
 * new field existed does not blank that field out.
 */
function merge<T>(stored: Json | undefined, fallback: T): T {
  if (!stored) return fallback;
  if (Array.isArray(fallback)) return (stored.items as T) ?? fallback;
  return { ...(fallback as object), ...stored } as T;
}

export async function getContent() {
  const s = await sections();
  return {
    hero: merge(s.hero, defaults.HERO),
    notice: merge(s.notice, defaults.NOTICE),
    whoWeAre: merge(s.whoWeAre, defaults.WHO_WE_ARE),
    facts: merge(s.facts, defaults.FACTS as unknown as typeof defaults.FACTS),
    overview: merge(s.overview, defaults.OVERVIEW),
    coopPrinciples: merge(s.coopPrinciples, defaults.COOP_PRINCIPLES),
    coopActivities: merge(s.coopActivities, defaults.COOP_ACTIVITIES),
    companyDetails: merge(s.companyDetails, defaults.COMPANY_DETAILS),
    vision: merge(s.vision, defaults.VISION),
    mission: merge(s.mission, defaults.MISSION),
    objectives: merge(s.objectives, defaults.OBJECTIVES),
    goals: merge(s.goals, defaults.GOALS),
    values: merge(s.values, defaults.VALUES),
    membership: merge(s.membership, defaults.MEMBERSHIP),
    blogIntro: merge(s.blogIntro, defaults.BLOG),
    job: merge(s.job, defaults.JOB),
    contact: merge(s.contact, defaults.CONTACT),
    socials: merge(s.socials, defaults.SOCIALS),
    navLinks: merge(s.navLinks, defaults.NAV_LINKS),
    images: merge(s.aboutImages, defaults.IMAGES),
    branding: merge(s.branding, { logo: "/logo_official.png" }),
  };
}

export type SiteContent = Awaited<ReturnType<typeof getContent>>;

// ------------------------------------------------------------- collections

const loadPeople = unstable_cache(
  async () => getPrisma().person.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ["people"],
  { tags: [CONTENT_TAG] }
);

export async function getPeople() {
  const rows = await safe(() => loadPeople(), [], "people");
  if (rows.length === 0) {
    return { board: defaults.BOARD, management: defaults.MANAGEMENT };
  }
  const shape = (r: (typeof rows)[number]) => ({
    name: r.name,
    role: r.role,
    photo: r.photo ?? "",
    photoPosition: r.photoPosition ?? undefined,
    teaser: r.teaser,
    bio: r.bio,
  });
  return {
    board: rows.filter((r) => r.group === "board").map(shape),
    management: rows.filter((r) => r.group === "management").map(shape),
  };
}

const loadPosts = unstable_cache(
  async () => getPrisma().post.findMany({ where: { published: true }, orderBy: { date: "desc" } }),
  ["posts"],
  { tags: [CONTENT_TAG] }
);

export async function getPosts() {
  const rows = await safe(() => loadPosts(), [], "posts");
  if (rows.length === 0) return defaults.POSTS;
  return rows.map((r) => {
    // `unstable_cache` serialises what it stores, so a cached hit returns the
    // timestamp as an ISO string rather than the Date Prisma handed back.
    const date = r.date instanceof Date ? r.date : new Date(r.date);
    return {
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      read: r.readTime,
      image: r.image ?? "",
      date: date.toISOString().slice(0, 10),
      dateLabel: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      category: r.category,
      author: r.author,
      body: r.body as unknown as (typeof defaults.POSTS)[number]["body"],
    };
  });
}

const loadServices = unstable_cache(
  async () => getPrisma().service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ["services"],
  { tags: [CONTENT_TAG] }
);

export async function getServices() {
  const rows = await safe(() => loadServices(), [], "services");
  if (rows.length === 0) return defaults.SERVICES;
  return rows.map((r) => ({ title: r.title, summary: r.summary, body: r.body }));
}

const loadNotifications = unstable_cache(
  async () => getPrisma().notification.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ["notifications"],
  { tags: [CONTENT_TAG] }
);

export async function getNotifications() {
  const rows = await safe(() => loadNotifications(), [], "notifications");
  if (rows.length === 0) return defaults.NOTIFICATIONS;
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    category: r.category,
    summary: r.summary,
    hasDownload: r.hasDownload,
  }));
}

const loadGallery = unstable_cache(
  async () => getPrisma().galleryItem.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ["gallery"],
  { tags: [CONTENT_TAG] }
);

export async function getGallery() {
  const rows = await safe(() => loadGallery(), [], "gallery");
  if (rows.length === 0) return defaults.GALLERY;
  return rows.map((r) => ({ src: r.src, alt: r.alt, category: r.category }));
}
