/**
 * Imports the site's built-in copy from `data/site.ts` into the database, so it
 * can be edited in the admin.
 *
 * Safe to re-run: sections are upserted by key, and collections are only filled
 * when empty, so a second run never duplicates rows or overwrites edits. Pass
 * `--force-collections` to clear and re-import the collections as well.
 *
 *   npm run seed
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as site from "../data/site";

const force = process.argv.includes("--force-collections");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/** Section key → the value shape `lib/section-values.ts` expects back. */
const SECTIONS: Record<string, unknown> = {
  hero: site.HERO,
  notice: site.NOTICE,
  whoWeAre: site.WHO_WE_ARE,
  facts: { items: site.FACTS },
  overview: site.OVERVIEW,
  coopPrinciples: { items: site.COOP_PRINCIPLES },
  coopActivities: { items: site.COOP_ACTIVITIES },
  companyDetails: site.COMPANY_DETAILS,
  vision: site.VISION,
  mission: site.MISSION,
  objectives: { items: site.OBJECTIVES },
  goals: site.GOALS,
  values: { items: site.VALUES },
  membership: site.MEMBERSHIP,
  blogIntro: site.BLOG,
  job: site.JOB,
  contact: site.CONTACT,
  socials: { items: site.SOCIALS },
  navLinks: { items: site.NAV_LINKS },
  branding: { logo: "/logo_official.png" },
  aboutImages: site.IMAGES,
};

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local before seeding.");
  }

  for (const [key, value] of Object.entries(SECTIONS)) {
    const data = JSON.parse(JSON.stringify(value));
    await prisma.section.upsert({
      where: { key },
      create: { key, data, updatedBy: "seed" },
      update: { data, updatedBy: "seed" },
    });
  }
  console.log(`Sections: ${Object.keys(SECTIONS).length} upserted.`);

  await seedCollection("people", () => prisma.person.count(), async () => {
    if (force) await prisma.person.deleteMany();
    const board = site.BOARD.map((p, i) => ({ ...toPerson(p, "board"), order: i }));
    const management = site.MANAGEMENT.map((p, i) => ({
      ...toPerson(p, "management"),
      order: site.BOARD.length + i,
    }));
    await prisma.person.createMany({ data: [...board, ...management] });
    return board.length + management.length;
  });

  await seedCollection("posts", () => prisma.post.count(), async () => {
    if (force) await prisma.post.deleteMany();
    const data = site.POSTS.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      readTime: p.read,
      image: p.image,
      date: new Date(`${p.date}T00:00:00Z`),
      category: p.category,
      author: p.author,
      body: JSON.parse(JSON.stringify(p.body)),
      order: i,
    }));
    await prisma.post.createMany({ data });
    return data.length;
  });

  await seedCollection("services", () => prisma.service.count(), async () => {
    if (force) await prisma.service.deleteMany();
    const data = site.SERVICES.map((s, i) => ({
      title: s.title,
      summary: s.summary,
      body: s.body,
      order: i,
    }));
    await prisma.service.createMany({ data });
    return data.length;
  });

  await seedCollection("notifications", () => prisma.notification.count(), async () => {
    if (force) await prisma.notification.deleteMany();
    const data = site.NOTIFICATIONS.map((n, i) => ({
      title: n.title,
      summary: n.summary,
      date: n.date,
      category: n.category,
      hasDownload: n.hasDownload,
      order: i,
    }));
    await prisma.notification.createMany({ data });
    return data.length;
  });

  await seedCollection("gallery", () => prisma.galleryItem.count(), async () => {
    if (force) await prisma.galleryItem.deleteMany();
    const data = site.GALLERY.map((g, i) => ({
      src: g.src,
      alt: g.alt,
      category: g.category,
      order: i,
    }));
    await prisma.galleryItem.createMany({ data });
    return data.length;
  });

  console.log("\nDone. Sign in at /admin to edit.");
}

function toPerson(p: { name: string; role: string; photo: string; teaser: string; bio: string; photoPosition?: string }, group: string) {
  return {
    group,
    name: p.name,
    role: p.role,
    photo: p.photo,
    photoPosition: p.photoPosition ?? null,
    teaser: p.teaser,
    bio: p.bio,
  };
}

async function seedCollection(label: string, count: () => Promise<number>, fill: () => Promise<number>) {
  const existing = await count();
  if (existing > 0 && !force) {
    console.log(`${label}: ${existing} rows already present, left alone.`);
    return;
  }
  const created = await fill();
  console.log(`${label}: ${created} rows imported.`);
}

main()
  .catch((error) => {
    console.error("\nSeed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
