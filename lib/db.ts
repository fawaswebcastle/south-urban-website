/**
 * Database module stub.
 * Database is not used in the frontend; content is loaded directly from Strapi CMS
 * or static defaults in data/site.ts.
 */
export const hasDatabase = false;

export function getPrisma(): never {
  throw new Error("Prisma database is disabled in this application.");
}
