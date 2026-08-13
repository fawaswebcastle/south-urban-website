/**
 * A description of every editable block on the public site.
 *
 * The admin has no hand-written forms. `SectionForm` walks these schemas and
 * renders the right control per field, which is what keeps 20-odd content areas
 * maintainable: adding a field to a section is one entry here, not a new page.
 *
 * Field `key`s match the shapes exported from `data/site.ts`, so a saved record
 * is a drop-in replacement for the static default it overrides.
 */

import type { ImageSlot } from "./image-specs";

export type Field =
  | { kind: "text"; key: string; label: string; help?: string; required?: boolean; placeholder?: string }
  | { kind: "textarea"; key: string; label: string; help?: string; required?: boolean; rows?: number }
  | { kind: "url"; key: string; label: string; help?: string; required?: boolean }
  | { kind: "email"; key: string; label: string; help?: string; required?: boolean }
  | { kind: "tel"; key: string; label: string; help?: string; required?: boolean }
  | { kind: "boolean"; key: string; label: string; help?: string }
  | { kind: "icon"; key: string; label: string; help?: string }
  | { kind: "image"; key: string; label: string; slot: ImageSlot; help?: string; required?: boolean }
  /** A reorderable list of plain strings, e.g. paragraphs. */
  | { kind: "stringList"; key: string; label: string; help?: string; itemLabel: string; multiline?: boolean }
  /** A reorderable list of objects, each rendered from `fields`. */
  | { kind: "list"; key: string; label: string; help?: string; itemLabel: string; titleKey: string; fields: Field[] }
  /** An article body: an ordered mix of paragraphs, headings, lists and quotes. */
  | { kind: "blocks"; key: string; label: string; help?: string };

/** Which page group a block appears under is decided in `admin-nav.ts`. */
export type SectionSchema = {
  key: string;
  title: string;
  /** Where this shows up, so an editor can find it on the site. */
  where: string;
  description?: string;
  fields: Field[];
};

/** lucide-react export names the site already maps; shown as a picker. */
export const ICON_CHOICES = [
  "BadgeCheck", "Camera", "CreditCard", "Eye", "FileText", "Gem", "HandCoins",
  "Handshake", "IdCard", "Leaf", "Lightbulb", "Milk", "PackageCheck", "Scale",
  "ScrollText", "ShieldCheck", "ShoppingBasket", "Sprout", "TrendingUp",
  "Users2", "Warehouse",
] as const;

export const SECTION_SCHEMAS: SectionSchema[] = [
  // ------------------------------------------------------------- Site-wide
  {
    key: "contact",
    title: "Contact details",
    where: "Header phone number, contact section, and footer",
    fields: [
      { kind: "tel", key: "phone", label: "Phone number", required: true, help: "Shown in the top bar and linked as a tap-to-call." },
      { kind: "email", key: "email", label: "Email address", required: true },
      { kind: "textarea", key: "address", label: "Postal address", rows: 2, required: true },
    ],
  },
  {
    key: "socials",
    title: "Social links",
    where: "Top bar on every page, and the footer",
    description: "Remove an entry and its icon disappears from the header. Only the four names below have icons.",
    fields: [
      {
        kind: "list", key: "items", label: "Profiles", itemLabel: "profile", titleKey: "name",
        fields: [
          { kind: "text", key: "name", label: "Network", required: true, help: "One of: Facebook, Instagram, X, LinkedIn." },
          { kind: "url", key: "href", label: "Profile URL", required: true },
        ],
      },
    ],
  },
  {
    key: "navLinks",
    title: "Main navigation",
    where: "Header menu and the mobile menu",
    fields: [
      {
        kind: "list", key: "items", label: "Menu items", itemLabel: "link", titleKey: "label",
        fields: [
          { kind: "text", key: "label", label: "Label", required: true },
          { kind: "text", key: "href", label: "Destination", required: true, help: "An anchor on the home page like #services, or a path like /blog." },
        ],
      },
    ],
  },
  {
    key: "branding",
    title: "Logo",
    where: "Header and footer",
    fields: [{ kind: "image", key: "logo", label: "Logo", slot: "logo", required: true }],
  },

  // ------------------------------------------------------------- Home page
  {
    key: "hero",
    title: "Hero",
    where: "Top of the home page",
    fields: [
      { kind: "text", key: "title", label: "Headline", required: true, help: "Set in solid white." },
      { kind: "text", key: "titleAccent", label: "Headline second line", required: true, help: "Set in outlined type beneath the first line." },
      { kind: "textarea", key: "intro", label: "Introduction", rows: 3, required: true },
      { kind: "image", key: "banner.main.src", label: "Background image", slot: "heroBanner", required: true },
      { kind: "text", key: "banner.main.alt", label: "Background image description", required: true, help: "Read aloud by screen readers. Describe what is in the photo." },
      { kind: "text", key: "banner.main.caption", label: "Background image caption" },
      {
        kind: "list", key: "banner.side", label: "Side cards", itemLabel: "card", titleKey: "caption",
        fields: [
          { kind: "image", key: "src", label: "Image", slot: "heroSideCard", required: true },
          { kind: "text", key: "alt", label: "Image description", required: true },
          { kind: "text", key: "caption", label: "Caption", required: true },
          { kind: "textarea", key: "note", label: "Supporting line", rows: 2 },
        ],
      },
    ],
  },
  {
    key: "notice",
    title: "Notice banner",
    where: "Banner above the announcement ticker",
    fields: [
      { kind: "text", key: "title", label: "Notice", required: true },
      { kind: "text", key: "date", label: "Date shown", required: true, help: 'Free text, e.g. "21 Jul 2026, 6:45 PM".' },
    ],
  },
  {
    key: "whoWeAre",
    title: "Who we are",
    where: "Home page intro block, and the About page hero",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "text", key: "title", label: "Heading, first part", required: true },
      { kind: "text", key: "titleAccent", label: "Heading, accented part", required: true, help: "Set in gold on the About page." },
      { kind: "textarea", key: "lead", label: "Short version", rows: 4, required: true, help: "Used on the home page and the About hero." },
      { kind: "stringList", key: "body", label: "Full version", itemLabel: "paragraph", multiline: true, help: "Used on the About page." },
    ],
  },
  {
    key: "facts",
    title: "Key figures",
    where: "Home page, and the row across the About hero",
    fields: [
      {
        kind: "list", key: "items", label: "Figures", itemLabel: "figure", titleKey: "value",
        fields: [
          { kind: "text", key: "value", label: "Figure", required: true, help: 'Kept short, e.g. "15+".' },
          { kind: "text", key: "label", label: "Caption", required: true },
        ],
      },
    ],
  },
  {
    key: "blogIntro",
    title: "Blog section heading",
    where: "Home page blog strip, and the top of /blog",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "intro", label: "Introduction", rows: 3, required: true },
    ],
  },
  {
    key: "job",
    title: "Careers listing",
    where: "Careers section on the home page",
    fields: [
      { kind: "text", key: "title", label: "Role title", required: true },
      { kind: "text", key: "type", label: "Employment type", required: true, help: 'e.g. "Full-time".' },
      { kind: "text", key: "location", label: "Location", required: true },
      { kind: "text", key: "dept", label: "Department", required: true },
      { kind: "stringList", key: "tags", label: "Tags", itemLabel: "tag" },
    ],
  },

  // ------------------------------------------------------------ About page
  {
    key: "overview",
    title: "Cooperative overview",
    where: "About page — what a multi-state cooperative does",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "stringList", key: "body", label: "Paragraphs", itemLabel: "paragraph", multiline: true },
    ],
  },
  {
    key: "coopPrinciples",
    title: "Cooperative principles",
    where: "About page — continues the overview text",
    fields: [{ kind: "stringList", key: "items", label: "Paragraphs", itemLabel: "paragraph", multiline: true }],
  },
  {
    key: "coopActivities",
    title: "Activity areas",
    where: "About page — 'What the Society puts its resources behind'",
    fields: [
      {
        kind: "list", key: "items", label: "Activities", itemLabel: "activity", titleKey: "title",
        fields: [
          { kind: "icon", key: "icon", label: "Icon", help: "Pick the icon shown on the card." },
          { kind: "text", key: "title", label: "Title", required: true },
          { kind: "textarea", key: "desc", label: "Description", rows: 2, required: true },
        ],
      },
    ],
  },
  {
    key: "companyDetails",
    title: "Registration record",
    where: "About page — 'Constituted under the MSCS Act, 2002'",
    fields: [
      { kind: "textarea", key: "intro", label: "Introduction", rows: 4, required: true },
      {
        kind: "list", key: "rows", label: "Details", itemLabel: "detail", titleKey: "label",
        fields: [
          { kind: "text", key: "label", label: "Label", required: true },
          { kind: "text", key: "value", label: "Value", required: true },
        ],
      },
    ],
  },
  {
    key: "vision",
    title: "Vision",
    where: "About page — the statement plate",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "textarea", key: "statement", label: "Vision statement", rows: 6, required: true, help: "Set large on a plate, so it reads best under about 240 characters." },
    ],
  },
  {
    key: "mission",
    title: "Mission",
    where: "About page — beside the vision plate",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "text", key: "lead", label: "Heading", required: true },
      {
        kind: "list", key: "items", label: "Commitments", itemLabel: "commitment", titleKey: "focus",
        help: "Shown as a rail — the focus word labels the sentence beside it.",
        fields: [
          { kind: "text", key: "focus", label: "Focus", required: true, help: "One word, e.g. Inputs, Credit, Governance." },
          { kind: "textarea", key: "text", label: "Commitment", rows: 3, required: true },
        ],
      },
    ],
  },
  {
    key: "objectives",
    title: "Objectives",
    where: "About page — the numbered list",
    fields: [
      {
        kind: "list", key: "items", label: "Objectives", itemLabel: "objective", titleKey: "title",
        fields: [
          { kind: "icon", key: "icon", label: "Icon" },
          { kind: "text", key: "title", label: "Title", required: true },
          { kind: "textarea", key: "desc", label: "Description", rows: 3, required: true },
        ],
      },
    ],
  },
  {
    key: "goals",
    title: "Goals",
    where: "About page — the closing band above the call to action",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "textarea", key: "statement", label: "Goals statement", rows: 6, required: true },
    ],
  },
  {
    key: "values",
    title: "Values",
    where: "About page — the card grid",
    fields: [
      {
        kind: "list", key: "items", label: "Values", itemLabel: "value", titleKey: "title",
        fields: [
          { kind: "icon", key: "icon", label: "Icon" },
          { kind: "text", key: "title", label: "Title", required: true },
          { kind: "textarea", key: "desc", label: "Description", rows: 2, required: true },
        ],
      },
    ],
  },
  {
    key: "membership",
    title: "Membership",
    where: "About page — share classes and required documents",
    fields: [
      { kind: "text", key: "label", label: "Eyebrow", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "intro", label: "Introduction", rows: 4, required: true },
      {
        kind: "list", key: "classes", label: "Share classes", itemLabel: "class", titleKey: "name",
        fields: [
          { kind: "text", key: "name", label: "Class name", required: true },
          { kind: "text", key: "tagline", label: "Tagline", required: true },
          { kind: "text", key: "total", label: "Total", required: true, help: 'Shown large, e.g. "₹110".' },
          { kind: "text", key: "totalLabel", label: "Total caption", required: true },
          {
            kind: "list", key: "rows", label: "Cost breakdown", itemLabel: "row", titleKey: "label",
            fields: [
              { kind: "text", key: "label", label: "Item", required: true },
              { kind: "text", key: "value", label: "Amount", required: true },
            ],
          },
        ],
      },
      {
        kind: "list", key: "documents", label: "Required documents", itemLabel: "document", titleKey: "label",
        fields: [
          { kind: "icon", key: "icon", label: "Icon" },
          { kind: "text", key: "label", label: "Document", required: true },
        ],
      },
    ],
  },
  {
    key: "aboutImages",
    title: "About page images",
    where: "The photographs used across the About page",
    description: "Each slot states the size and ratio it needs — the page crops to those boxes.",
    fields: [
      { kind: "image", key: "aboutHero", label: "Page banner", slot: "aboutHeroBanner", required: true },
      { kind: "image", key: "harvest", label: "Feature image", slot: "aboutPortrait", required: true },
      { kind: "image", key: "award", label: "Inset image", slot: "aboutSquare", required: true },
      { kind: "image", key: "whoWeAreBanner", label: "Registration record image", slot: "aboutBanner", required: true },
      { kind: "image", key: "polyhouse", label: "Objectives image", slot: "aboutLandscape", required: true },
      { kind: "image", key: "memberMeeting", label: "Values image", slot: "aboutLandscape", required: true },
      { kind: "image", key: "drone", label: "Vision & Goals background", slot: "heroBanner", required: true },
    ],
  },
];

export function getSchema(key: string): SectionSchema | undefined {
  return SECTION_SCHEMAS.find((s) => s.key === key);
}

/** Read "banner.main.src" out of a nested object. */
export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

/** Immutably write "banner.main.src" into a nested object, creating gaps. */
export function setPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const next: Record<string, unknown> = { ...obj };
  if (rest.length === 0) {
    next[head] = value;
  } else {
    const child = next[head];
    next[head] = setPath(
      (child && typeof child === "object" ? child : {}) as Record<string, unknown>,
      rest.join("."),
      value
    );
  }
  return next as T;
}

/** Every image field in a schema, including those nested inside lists. */
export function imageFieldsOf(fields: Field[]): Extract<Field, { kind: "image" }>[] {
  return fields.flatMap((f) =>
    f.kind === "image" ? [f] : f.kind === "list" ? imageFieldsOf(f.fields) : []
  );
}
