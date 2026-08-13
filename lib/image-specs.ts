/**
 * What each image slot on the public site actually needs.
 *
 * Every figure here is read off the component that renders the slot — the
 * container's aspect class, its `sizes` attribute and the widths Next's image
 * optimiser will request — so the guidance shown to an editor matches what the
 * browser will really ask for. `recommended` is the largest width the layout can
 * request, doubled for retina and rounded; `min` is the point below which the
 * optimiser starts upscaling and the image visibly softens.
 *
 * `ImageField` renders these as help text and checks an upload against them
 * before it is accepted, so nobody has to guess a size.
 */

export type ImageSpec = {
  /** Human label for the slot, shown above the field. */
  label: string;
  /** Aspect ratio as width / height. */
  ratio: number;
  /** How the ratio reads to a person, e.g. "3:4". */
  ratioLabel: string;
  /** Ideal upload size in pixels. */
  recommended: { width: number; height: number };
  /** Below this width the image will look soft at full size. */
  minWidth: number;
  /** Accepted mime types for this slot. */
  accept: readonly string[];
  /** Soft ceiling in bytes; larger uploads are warned about, not blocked. */
  maxBytes: number;
  /** Where it appears, so an editor knows what they are changing. */
  usedOn: string;
  /** Anything the ratio alone does not convey — cropping, transparency, safe areas. */
  note?: string;
};

const JPEG_OR_WEBP = ["image/jpeg", "image/webp", "image/avif"] as const;
const WITH_PNG = ["image/jpeg", "image/webp", "image/avif", "image/png"] as const;

const MB = 1024 * 1024;

export const IMAGE_SPECS = {
  heroBanner: {
    label: "Home hero background",
    ratio: 16 / 9,
    ratioLabel: "16:9",
    recommended: { width: 2560, height: 1440 },
    minWidth: 1920,
    accept: JPEG_OR_WEBP,
    maxBytes: 3 * MB,
    usedOn: "Home page hero, full width behind the headline",
    note:
      "Runs full-bleed and is cropped to the viewport, so keep the subject central — " +
      "on a tall phone only the middle third stays visible. A dark or low-contrast " +
      "image works best because white headline text sits on top of it.",
  },

  aboutHeroBanner: {
    label: "About page hero background",
    ratio: 16 / 9,
    ratioLabel: "16:9",
    recommended: { width: 2560, height: 1440 },
    minWidth: 1920,
    accept: JPEG_OR_WEBP,
    maxBytes: 3 * MB,
    usedOn: "About page banner, behind the title and the key-facts row",
    note: "Shown at 35% opacity under a green gradient, so fine detail will not read. Choose for shape, not detail.",
  },

  personPortrait: {
    label: "Leadership portrait",
    ratio: 3 / 4,
    ratioLabel: "3:4 portrait",
    recommended: { width: 1200, height: 1600 },
    minWidth: 900,
    accept: JPEG_OR_WEBP,
    maxBytes: 2 * MB,
    usedOn: "Leadership grid on the home page, and the profile dialog",
    note:
      "Cropped to a 3:4 box from the centre. Head and shoulders, with a little " +
      "room above the head. If a face sits high or low in the frame, set the " +
      "focal point field below rather than re-cropping the file.",
  },

  postImage: {
    label: "Article card image",
    ratio: 16 / 10,
    ratioLabel: "16:10",
    recommended: { width: 1600, height: 1000 },
    minWidth: 1200,
    accept: JPEG_OR_WEBP,
    maxBytes: 2 * MB,
    usedOn: "Blog index cards, the home page blog strip, and the menu preview",
    note:
      "The same file is also the banner on the article itself, where it is cropped " +
      "to a wide 2.4:1 band on desktop. Keep the subject inside the middle two " +
      "thirds vertically so it survives both crops.",
  },

  galleryTile: {
    label: "Gallery image",
    ratio: 4 / 3,
    ratioLabel: "4:3 landscape",
    recommended: { width: 1600, height: 1200 },
    minWidth: 1200,
    accept: JPEG_OR_WEBP,
    maxBytes: 2 * MB,
    usedOn: "Gallery grid on the home page",
    note:
      "Tiles are a mosaic — some are wide, some are tall squares — so every image " +
      "is cropped from the centre to fit its tile. Avoid anything where the edges matter.",
  },

  logo: {
    label: "Society logo",
    ratio: 1080 / 285,
    ratioLabel: "3.8:1 wide",
    recommended: { width: 1080, height: 285 },
    minWidth: 720,
    accept: ["image/png", "image/webp"],
    maxBytes: 512 * 1024,
    usedOn: "Header on every page, and the footer",
    note:
      "PNG with a transparent background. Rendered at 360 × 95, so the file is for " +
      "retina. Leave no built-in padding — the header adds its own spacing.",
  },

  aboutPortrait: {
    label: "About page feature image",
    ratio: 3 / 4,
    ratioLabel: "3:4 portrait",
    recommended: { width: 920, height: 1226 },
    minWidth: 700,
    accept: JPEG_OR_WEBP,
    maxBytes: 2 * MB,
    usedOn: "About page — the tall image beside 'What an Agro Multi-State Cooperative Society does'",
  },

  aboutSquare: {
    label: "About page inset image",
    ratio: 1,
    ratioLabel: "1:1 square",
    recommended: { width: 800, height: 800 },
    minWidth: 500,
    accept: JPEG_OR_WEBP,
    maxBytes: 1 * MB,
    usedOn: "About page — the small square inset overlapping the feature image",
    note: "Sits at 192 px over the corner of the larger image. Keep it simple; detail will not read at that size.",
  },

  aboutLandscape: {
    label: "About page wide image",
    ratio: 4 / 3,
    ratioLabel: "4:3 landscape",
    recommended: { width: 1120, height: 840 },
    minWidth: 840,
    accept: JPEG_OR_WEBP,
    maxBytes: 2 * MB,
    usedOn: "About page — Objectives and Values sections",
  },

  aboutBanner: {
    label: "Registration record image",
    ratio: 3 / 4,
    ratioLabel: "3:4 portrait",
    recommended: { width: 960, height: 1280 },
    minWidth: 720,
    accept: WITH_PNG,
    maxBytes: 2 * MB,
    usedOn: "About page — the panel showing the Society's registration details",
    note: "A green gradient covers the lower third, where a caption sits. Keep the subject in the upper half.",
  },

  heroSideCard: {
    label: "Hero side card image",
    ratio: 4 / 3,
    ratioLabel: "4:3 landscape",
    recommended: { width: 1000, height: 750 },
    minWidth: 700,
    accept: JPEG_OR_WEBP,
    maxBytes: 1.5 * MB,
    usedOn: "Home hero — the small supporting cards beside the headline",
  },
} as const satisfies Record<string, ImageSpec>;

export type ImageSlot = keyof typeof IMAGE_SPECS;

/** How far a ratio may drift before an editor is warned, as a fraction. */
export const RATIO_TOLERANCE = 0.06;

export function getSpec(slot: ImageSlot): ImageSpec {
  return IMAGE_SPECS[slot];
}

export type ImageCheck = {
  level: "ok" | "warn" | "error";
  messages: string[];
};

/**
 * Validate a file's real dimensions against a slot. Deliberately advisory: only
 * an unreadable or wrong-type file is an `error`. A 4:3 photo in a 3:4 slot is a
 * `warn`, because sometimes an editor genuinely does want the centre crop and
 * blocking them would just push the work back to the developer.
 */
export function checkImage(
  slot: ImageSlot,
  input: { width: number; height: number; size: number; type: string }
): ImageCheck {
  const spec = IMAGE_SPECS[slot];
  const messages: string[] = [];
  let level: ImageCheck["level"] = "ok";

  const accepted = spec.accept as readonly string[];
  if (!accepted.includes(input.type)) {
    return {
      level: "error",
      messages: [
        `${input.type || "That file"} is not accepted here. Use ${accepted
          .map((t) => t.replace("image/", "").toUpperCase())
          .join(", ")}.`,
      ],
    };
  }

  if (input.width < spec.minWidth) {
    level = "warn";
    messages.push(
      `${input.width} px wide is below the ${spec.minWidth} px minimum, so this will look soft. Recommended: ${spec.recommended.width} × ${spec.recommended.height}.`
    );
  }

  const ratio = input.width / input.height;
  const drift = Math.abs(ratio - spec.ratio) / spec.ratio;
  if (drift > RATIO_TOLERANCE) {
    level = "warn";
    messages.push(
      `This is ${formatRatio(ratio)} but the slot is ${spec.ratioLabel}. It will be cropped from the centre — check the preview before saving.`
    );
  }

  if (input.size > spec.maxBytes) {
    level = "warn";
    messages.push(
      `${formatBytes(input.size)} is over the ${formatBytes(spec.maxBytes)} guideline and will slow the page down. Export at a lower quality or use WebP.`
    );
  }

  if (messages.length === 0) {
    messages.push(`${input.width} × ${input.height} — matches the ${spec.ratioLabel} requirement.`);
  }

  return { level, messages };
}

/** Turn 1.7778 into "16:9" where a common ratio matches, else "1.78:1". */
export function formatRatio(ratio: number): string {
  const common: [number, number][] = [
    [1, 1], [4, 3], [3, 4], [3, 2], [2, 3], [16, 9], [9, 16], [16, 10], [10, 16], [21, 9], [12, 5],
  ];
  for (const [w, h] of common) {
    if (Math.abs(ratio - w / h) / (w / h) < 0.02) return `${w}:${h}`;
  }
  return `${ratio.toFixed(2)}:1`;
}

export function formatBytes(bytes: number): string {
  if (bytes >= MB) return `${(bytes / MB).toFixed(bytes >= 10 * MB ? 0 : 1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/** One-line summary for the field label, e.g. "3:4 portrait · 1200 × 1600 px". */
export function specSummary(slot: ImageSlot): string {
  const s = IMAGE_SPECS[slot];
  return `${s.ratioLabel} · ${s.recommended.width} × ${s.recommended.height} px`;
}
