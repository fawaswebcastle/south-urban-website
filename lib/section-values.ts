import "server-only";
import { getContent } from "./content";

/**
 * The current value of one singleton section, in the shape its schema expects.
 *
 * Sections whose content is a bare array are wrapped as `{ items }` so the form
 * has an object to write into; `merge()` in lib/content.ts unwraps them again on
 * the way out. Keeping that translation in one place means neither the schemas
 * nor the public components need to know about it.
 */
const ARRAY_SECTIONS = new Set([
  "socials",
  "navLinks",
  "facts",
  "coopPrinciples",
  "coopActivities",
  "objectives",
  "values",
]);

export async function getSectionValue(key: string): Promise<Record<string, unknown>> {
  const content = await getContent();

  const source: Record<string, unknown> = {
    hero: content.hero,
    notice: content.notice,
    whoWeAre: content.whoWeAre,
    facts: content.facts,
    overview: content.overview,
    coopPrinciples: content.coopPrinciples,
    coopActivities: content.coopActivities,
    companyDetails: content.companyDetails,
    vision: content.vision,
    mission: content.mission,
    objectives: content.objectives,
    goals: content.goals,
    values: content.values,
    membership: content.membership,
    blogIntro: content.blogIntro,
    job: content.job,
    contact: content.contact,
    socials: content.socials,
    navLinks: content.navLinks,
    branding: content.branding,
    aboutImages: content.images,
  };

  const value = source[key];
  if (value === undefined) return {};

  // Structured-clone through JSON so `as const` readonly arrays from
  // data/site.ts arrive at the client form as plain mutable data.
  const plain = JSON.parse(JSON.stringify(value));

  if (ARRAY_SECTIONS.has(key)) return { items: Array.isArray(plain) ? plain : [] };
  return plain as Record<string, unknown>;
}
