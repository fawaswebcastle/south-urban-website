# Content admin

An admin panel at `/admin` for editing everything on the public site: copy,
images, leadership, services, announcements, gallery and blog posts.

## How content flows

`data/site.ts` is still the site's checked-in copy. It is now the **default**
rather than the only source: `lib/content.ts` reads a row from Postgres and
falls back to the matching export when that row is missing, empty, or the
database is unreachable.

That means the site renders correctly before anyone has run a migration, and a
database outage degrades to the last-known-good copy in the repo instead of a
500. It also means `npm run seed` is an import step, not a prerequisite.

```
admin form ──► Postgres ──► lib/content.ts ──► page
                              │
                              └── falls back to data/site.ts
```

## Setup

1. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` — any Postgres (Vercel Postgres, Neon, Supabase).
   - `ADMIN_SESSION_SECRET` — 32+ characters; `openssl rand -base64 32`.
   - `BLOB_READ_WRITE_TOKEN` — from a Vercel Blob store, for image uploads.

2. Create the tables, import the current copy, and make your account:

```bash
npm run db:migrate && npm run seed && npm run admin:create
```

`admin:create` prompts for the password without echoing it and stores only a
bcrypt hash. There is no sign-up page — accounts are made from the command line
on purpose.

3. `npm run dev`, then sign in at `/admin/login`.

### Without a Postgres installed

`npm run db:local` starts a throwaway Postgres in-process (PGlite over a real
wire-protocol socket) at `127.0.0.1:5432`. Set `DATABASE_POOL_MAX=1` alongside
it — it accepts a single connection, and concurrent queries drop the socket.
Development only.

## Deploying

Set the three environment variables in Vercel and run `npm run db:deploy`
against the production database. `npm run build` runs `prisma generate` first,
so the client is always generated against the current schema.

Uploaded images live in Vercel Blob and are served from
`*.public.blob.vercel-storage.com`, which is allow-listed in `next.config.ts`.

## Image sizes

Every image field states the ratio, pixel size, minimum width, accepted formats
and weight limit for its slot, plus where it appears and how it will be cropped.
The requirements live in one place — `lib/image-specs.ts` — and are enforced
twice: measured in the browser before upload, then re-checked on the server so a
direct POST cannot bypass them.

Wrong ratio or an undersized image is a **warning**, not a rejection: sometimes a
centre crop is genuinely what is wanted, and blocking would push the work back to
a developer. Only an unreadable file or a disallowed format is refused.

| Slot | Ratio | Recommended |
| --- | --- | --- |
| Home hero background | 16:9 | 2560 × 1440 |
| About page banner | 16:9 | 2560 × 1440 |
| Leadership portrait | 3:4 | 1200 × 1600 |
| Article image | 16:10 | 1600 × 1000 |
| Gallery tile | 4:3 | 1600 × 1200 |
| Logo | 3.8:1 | 1080 × 285 (transparent PNG) |
| About feature image | 3:4 | 920 × 1226 |
| About inset | 1:1 | 800 × 800 |
| About wide image | 4:3 | 1120 × 840 |
| Registration record image | 3:4 | 960 × 1280 |
| Hero side card | 4:3 | 1000 × 750 |

`/admin/media` lists every upload with its real dimensions and flags any that no
longer match the slot they were uploaded for.

## Adding a field

Editors' forms are generated, not hand-written. To add a field to a content
block, add one entry to its schema in `lib/content-schema.ts` (or
`lib/collection-schema.ts` for the five collections) and it appears in the admin
with the right control. Available kinds: `text`, `textarea`, `url`, `email`,
`tel`, `boolean`, `icon`, `image`, `stringList`, `list`, `blocks`.

Then read it on the public side through `lib/content.ts`.

## Security notes

- Sessions are a signed JWT in an httpOnly, sameSite=lax cookie, 12 hours.
- `middleware.ts` blocks unauthenticated requests to `/admin`; every admin page
  also calls `requireSessionUser()`, so a gap in the matcher cannot expose one.
- Login returns the same message for an unknown address and a wrong password,
  and hashes either way, so the form cannot be used to enumerate accounts.
- Uploads require a session and are re-validated server-side.

## Known gap

The Services panel in the header mega-menu (`components/MegaMenu.tsx`) renders
hand-written tiles rather than the Services collection, so editing a service in
the admin does not change that panel. The `/#services` section it links to *is*
driven by the admin.
