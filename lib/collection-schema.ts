import type { Field } from "./content-schema";

/**
 * The five content types editors add to and reorder, as opposed to the
 * singleton blocks in `content-schema.ts`. Same `Field` vocabulary, so the same
 * controls render both.
 */
export type CollectionSchema = {
  /** Prisma model name — must match a key on PrismaClient. */
  model: "post" | "person" | "service" | "notification" | "galleryItem";
  slug: string;
  title: string;
  singular: string;
  where: string;
  /** Field key used as the row heading in the list. */
  titleKey: string;
  /** Field key shown under the heading, when set. */
  subtitleKey?: string;
  /** Field key holding a thumbnail, when set. */
  thumbKey?: string;
  /** Rows are hand-ordered rather than sorted by date. */
  orderable: boolean;
  description?: string;
  fields: Field[];
  /** Values applied to a newly created row. */
  blank: Record<string, unknown>;
};

export const COLLECTION_SCHEMAS: CollectionSchema[] = [
  {
    model: "person",
    slug: "people",
    title: "Leadership",
    singular: "person",
    where: "Leadership section on the home page",
    titleKey: "name",
    subtitleKey: "role",
    thumbKey: "photo",
    orderable: true,
    description:
      "Board members and the executive team. Order here is the order they appear on the site.",
    blank: { group: "board", name: "", role: "", teaser: "", bio: "", published: true },
    fields: [
      { kind: "text", key: "name", label: "Name", required: true },
      { kind: "text", key: "role", label: "Role", required: true, help: 'e.g. "Chairman", "Director".' },
      {
        kind: "text", key: "group", label: "Board",
        required: true,
        help: 'Either "board" for the Board of Directors, or "management" for the Executive Board.',
      },
      { kind: "image", key: "photo", label: "Portrait", slot: "personPortrait", required: true },
      {
        kind: "text", key: "photoPosition", label: "Focal point",
        help:
          'Optional. Shifts the crop when a face sits high or low, e.g. "object-[center_30%]". Leave blank to crop from the top.',
      },
      { kind: "textarea", key: "teaser", label: "Short line", rows: 2, required: true, help: "Shown on the card, under the role." },
      { kind: "textarea", key: "bio", label: "Full biography", rows: 10, required: true, help: "Shown in the profile dialog." },
      { kind: "boolean", key: "published", label: "Show on the site" },
    ],
  },
  {
    model: "post",
    slug: "posts",
    title: "Blog posts",
    singular: "post",
    where: "/blog, and the blog strip on the home page",
    titleKey: "title",
    subtitleKey: "category",
    thumbKey: "image",
    orderable: false,
    description: "Ordered by date, newest first. The slug becomes the article's web address.",
    blank: { title: "", slug: "", excerpt: "", readTime: "3 min read", category: "", author: "", body: [], published: true },
    fields: [
      { kind: "text", key: "title", label: "Title", required: true },
      {
        kind: "text", key: "slug", label: "Web address", required: true,
        help: "Lowercase words separated by hyphens. Changing this breaks any existing links to the article.",
      },
      { kind: "textarea", key: "excerpt", label: "Summary", rows: 3, required: true, help: "Shown on cards and in search results." },
      { kind: "image", key: "image", label: "Article image", slot: "postImage", required: true },
      { kind: "text", key: "category", label: "Category", required: true, help: "Used as the filter label on /blog." },
      { kind: "text", key: "author", label: "Byline", required: true },
      { kind: "text", key: "date", label: "Publication date", required: true, help: "YYYY-MM-DD." },
      { kind: "text", key: "readTime", label: "Reading time", required: true, help: 'e.g. "4 min read".' },
      { kind: "blocks", key: "body", label: "Article body", help: "Add paragraphs, subheadings, bulleted lists and pull quotes in the order they should appear." },
      { kind: "boolean", key: "published", label: "Publish" },
    ],
  },
  {
    model: "service",
    slug: "services",
    title: "Services",
    singular: "service",
    where: "Services section on the home page",
    titleKey: "title",
    subtitleKey: "summary",
    orderable: true,
    description: "Each opens as a visitor scrolls. Summary is all that shows until one is opened.",
    blank: { title: "", summary: "", body: "", published: true },
    fields: [
      { kind: "text", key: "title", label: "Title", required: true },
      { kind: "textarea", key: "summary", label: "Summary", rows: 2, required: true, help: "One line, shown collapsed." },
      { kind: "textarea", key: "body", label: "Full description", rows: 8, required: true },
      { kind: "boolean", key: "published", label: "Show on the site" },
    ],
  },
  {
    model: "notification",
    slug: "notifications",
    title: "Announcements",
    singular: "announcement",
    where: "The scrolling ticker under the header",
    titleKey: "title",
    subtitleKey: "date",
    orderable: true,
    blank: { title: "", summary: "", date: "", category: "", hasDownload: false, published: true },
    fields: [
      { kind: "text", key: "title", label: "Headline", required: true },
      { kind: "textarea", key: "summary", label: "Detail", rows: 3, required: true, help: "Shown when a visitor taps the headline." },
      { kind: "text", key: "date", label: "Date shown", required: true, help: 'Free text, exactly as it should read — e.g. "07.08.2026 04:37 PM".' },
      { kind: "text", key: "category", label: "Category", required: true },
      { kind: "boolean", key: "hasDownload", label: "Has an attachment", help: "Adds a download icon and a download button in the dialog." },
      { kind: "image", key: "document", label: "Document / Circular File", slot: "postImage", help: "Upload PDF or circular document file." },
      { kind: "boolean", key: "published", label: "Show in the ticker" },
    ],
  },
  {
    model: "galleryItem",
    slug: "gallery",
    title: "Gallery",
    singular: "image",
    where: "Gallery section on the home page",
    titleKey: "alt",
    subtitleKey: "category",
    thumbKey: "src",
    orderable: true,
    description:
      "Tiles are laid out as a mosaic of different shapes, so every image is cropped from the centre.",
    blank: { src: "", alt: "", category: "Operations", published: true },
    fields: [
      { kind: "image", key: "src", label: "Image", slot: "galleryTile", required: true },
      {
        kind: "text", key: "alt", label: "Description", required: true,
        help: "Read aloud by screen readers, and shown as the caption on hover.",
      },
      { kind: "text", key: "category", label: "Category", required: true, help: 'Used by the filter buttons, e.g. "Events" or "Operations".' },
      { kind: "boolean", key: "published", label: "Show on the site" },
    ],
  },
];

export function getCollection(slug: string): CollectionSchema | undefined {
  return COLLECTION_SCHEMAS.find((c) => c.slug === slug);
}
