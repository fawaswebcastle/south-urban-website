import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

/**
 * Prisma 7 reads the migration connection string from here rather than from a
 * `url` in schema.prisma. The runtime client gets its connection separately,
 * through the pg driver adapter in `lib/db.ts`.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx scripts/seed.ts",
  },
});
