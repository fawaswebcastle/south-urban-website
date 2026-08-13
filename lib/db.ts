import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** True when a database is configured at all. `lib/content.ts` checks this
 *  before querying so the public site can fall back to its static defaults. */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/** Held on globalThis so `next dev`'s hot reloads reuse one connection pool. */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Prisma 7 connects through a driver adapter rather than a `url` in the schema.
 * Built on first use rather than at import time, so a missing DATABASE_URL only
 * fails the queries that need it instead of every module that imports this one.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        // Serverless functions want a small pool, and the local PGlite database
        // from `npm run db:local` accepts exactly one connection — set
        // DATABASE_POOL_MAX=1 there or concurrent queries drop the socket.
        max: process.env.DATABASE_POOL_MAX ? Number(process.env.DATABASE_POOL_MAX) : undefined,
      }),
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}
