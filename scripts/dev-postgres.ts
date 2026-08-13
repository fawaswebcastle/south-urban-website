/**
 * A throwaway Postgres for local development, backed by PGlite.
 *
 *   npm run db:local
 *
 * PGlite is Postgres compiled to WASM; `pglite-socket` puts it behind a real
 * Postgres wire-protocol socket, so `prisma migrate`, the seed script and the
 * app all connect to it exactly as they would to a hosted database. This exists
 * so the admin can be run and tested without installing Postgres or Docker.
 *
 * Not for production — the store is a folder under .pglite/ and there is no
 * authentication. Point DATABASE_URL at a real Postgres for anything deployed.
 */

import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env.LOCAL_PG_PORT ?? 5432);
const DATA_DIR = process.env.LOCAL_PG_DIR ?? ".pglite";

async function main() {
  const db = await PGlite.create({ dataDir: DATA_DIR });
  const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1" });

  await server.start();

  console.log(`PGlite listening on 127.0.0.1:${PORT} (data in ${DATA_DIR}/)`);
  console.log(`Set DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:${PORT}/postgres"`);
  console.log("Press Ctrl-C to stop.\n");

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, async () => {
      await server.stop();
      await db.close();
      process.exit(0);
    });
  }
}

main().catch((error) => {
  console.error("Could not start the local database:", error);
  process.exit(1);
});
