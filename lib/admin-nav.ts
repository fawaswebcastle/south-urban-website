/**
 * The admin's information architecture — one ordered list, used by both the
 * sidebar and the dashboard so they can never drift apart.
 *
 * Content reaches the admin from two registries: singleton blocks
 * (`content-schema.ts`) and collections (`collection-schema.ts`). Rendering
 * those registries one after the other put every collection above every block,
 * so the Home group opened with Leadership and Gallery and listed the Hero
 * below them. Here the two are interleaved and ordered to match the order a
 * visitor meets them on the page, so "what is at the top of the home page" is
 * the first thing under Home page.
 *
 * Adding a block or collection means adding one line to the right group below;
 * `assertNavCoverage` fails the build if something is registered but unlisted.
 */

import { SECTION_SCHEMAS } from "./content-schema";
import { COLLECTION_SCHEMAS } from "./collection-schema";

export type NavItem =
  | { kind: "section"; key: string }
  | { kind: "collection"; slug: string }
  | { kind: "page"; href: string; title: string; where: string };

export type NavGroup = {
  id: string;
  title: string;
  /** One line on the dashboard card explaining what this group covers. */
  blurb: string;
  items: NavItem[];
};

export const ADMIN_NAV: NavGroup[] = [
  {
    id: "home",
    title: "Home page",
    blurb: "Everything on the front page, in the order a visitor scrolls through it.",
    items: [
      { kind: "section", key: "hero" },
      { kind: "section", key: "notice" },
      { kind: "collection", slug: "notifications" },
      { kind: "section", key: "whoWeAre" },
      { kind: "section", key: "facts" },
      { kind: "collection", slug: "services" },
      { kind: "collection", slug: "people" },
      { kind: "collection", slug: "gallery" },
      { kind: "section", key: "job" },
    ],
  },
  {
    id: "about",
    title: "About page",
    blurb: "The /about page, top to bottom.",
    items: [
      { kind: "section", key: "overview" },
      { kind: "section", key: "coopPrinciples" },
      { kind: "section", key: "coopActivities" },
      { kind: "section", key: "companyDetails" },
      { kind: "section", key: "vision" },
      { kind: "section", key: "mission" },
      { kind: "section", key: "objectives" },
      { kind: "section", key: "values" },
      { kind: "section", key: "membership" },
      { kind: "section", key: "goals" },
      { kind: "section", key: "aboutImages" },
    ],
  },
  {
    id: "blog",
    title: "Blog",
    blurb: "Articles, and the heading above them.",
    items: [
      { kind: "collection", slug: "posts" },
      { kind: "section", key: "blogIntro" },
    ],
  },
  {
    id: "site",
    title: "Site-wide",
    blurb: "Appears on every page — the header, the footer, and how to reach the Society.",
    items: [
      { kind: "section", key: "branding" },
      { kind: "section", key: "navLinks" },
      { kind: "section", key: "contact" },
      { kind: "section", key: "socials" },
    ],
  },
  {
    id: "library",
    title: "Library",
    blurb: "Every uploaded image, and the size each slot needs.",
    items: [
      {
        kind: "page",
        href: "/admin/media",
        title: "Images",
        where: "All uploads, with the required size and ratio for every slot",
      },
    ],
  },
];

/** A nav item resolved into what the sidebar and dashboard need to render it. */
export type ResolvedItem = {
  href: string;
  title: string;
  where: string;
  /** Prisma model name, when this item is a collection whose rows can be counted. */
  model?: string;
};

export function resolveItem(item: NavItem): ResolvedItem | null {
  if (item.kind === "page") {
    return { href: item.href, title: item.title, where: item.where };
  }
  if (item.kind === "section") {
    const schema = SECTION_SCHEMAS.find((s) => s.key === item.key);
    if (!schema) return null;
    return {
      href: `/admin/sections/${schema.key}`,
      title: schema.title,
      where: schema.where,
    };
  }
  const schema = COLLECTION_SCHEMAS.find((c) => c.slug === item.slug);
  if (!schema) return null;
  return {
    href: `/admin/${schema.slug}`,
    title: schema.title,
    where: schema.where,
    model: schema.model,
  };
}

export function resolveGroup(group: NavGroup): (ResolvedItem & { key: string })[] {
  return group.items.flatMap((item) => {
    const resolved = resolveItem(item);
    if (!resolved) return [];
    const key = item.kind === "page" ? item.href : item.kind === "section" ? item.key : item.slug;
    return [{ ...resolved, key }];
  });
}

/** The group a path belongs to, so the sidebar can open it. */
export function groupIdForPath(pathname: string): string | null {
  for (const group of ADMIN_NAV) {
    for (const item of group.items) {
      const resolved = resolveItem(item);
      if (!resolved) continue;
      if (pathname === resolved.href || pathname.startsWith(`${resolved.href}/`)) return group.id;
    }
  }
  return null;
}

/**
 * Anything registered but not placed in a group would silently vanish from the
 * admin. Called from the dashboard so the omission surfaces immediately.
 */
export function findUnlisted(): string[] {
  const listed = new Set(
    ADMIN_NAV.flatMap((g) =>
      g.items.flatMap((i) =>
        i.kind === "section" ? [`section:${i.key}`] : i.kind === "collection" ? [`collection:${i.slug}`] : []
      )
    )
  );
  return [
    ...SECTION_SCHEMAS.filter((s) => !listed.has(`section:${s.key}`)).map((s) => `section “${s.title}”`),
    ...COLLECTION_SCHEMAS.filter((c) => !listed.has(`collection:${c.slug}`)).map((c) => `collection “${c.title}”`),
  ];
}
