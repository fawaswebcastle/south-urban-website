/**
 * Creates or updates an admin account.
 *
 *   npm run admin:create
 *
 * The password is read from a hidden prompt — it is never taken from a command
 * argument (which would land in shell history) and never stored anywhere in this
 * repository. Only the bcrypt hash reaches the database.
 */

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/** Reads a line without echoing it to the terminal. */
async function askHidden(question: string): Promise<string> {
  stdout.write(question);
  const wasRaw = stdin.isRaw;
  stdin.setRawMode?.(true);
  stdin.resume();

  return new Promise((resolve) => {
    let value = "";
    const onData = (chunk: Buffer) => {
      const char = chunk.toString("utf8");
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl-D
          stdin.setRawMode?.(wasRaw ?? false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          break;
        case "\u0003": // Ctrl-C
          stdin.setRawMode?.(wasRaw ?? false);
          stdout.write("\n");
          process.exit(130);
          break;
        case "\u007f": // backspace
        case "\b":
          value = value.slice(0, -1);
          break;
        default:
          // Ignore escape sequences from arrow keys and the like.
          if (char >= " " && char !== "\u001b") value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local first.");
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const email = (await rl.question("Email: ")).trim().toLowerCase();
  const name = (await rl.question("Full name: ")).trim();
  rl.close();

  if (!email.includes("@")) throw new Error("That does not look like an email address.");
  if (!name) throw new Error("A name is required.");

  const password = await askHidden("Password (min 12 characters, not shown): ");
  if (password.length < 12) {
    throw new Error("Use at least 12 characters. Nothing was saved.");
  }
  const again = await askHidden("Confirm password: ");
  if (password !== again) throw new Error("Those did not match. Nothing was saved.");

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  const user = await prisma.adminUser.upsert({
    where: { email },
    create: { email, name, passwordHash, role: "admin" },
    update: { name, passwordHash },
  });

  console.log(
    existing
      ? `\nPassword updated for ${user.email}.`
      : `\nCreated ${user.email}. Sign in at /admin/login.`
  );
}

main()
  .catch((error) => {
    console.error("\n" + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
