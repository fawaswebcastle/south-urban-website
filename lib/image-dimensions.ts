/**
 * Read pixel dimensions straight out of an image file's header.
 *
 * The admin measures uploads in the browser before sending them, but the server
 * has to check for itself — a hand-rolled POST would otherwise let any file
 * through the slot's size and ratio rules. Parsing the header is enough for
 * that and avoids a native dependency like sharp, which is awkward to ship to
 * Vercel's runtime for what amounts to reading a few bytes.
 *
 * Returns null for formats not handled here; callers treat that as "cannot
 * verify" rather than as a failure.
 */

export type Dimensions = { width: number; height: number };

export function readImageDimensions(buf: Uint8Array): Dimensions | null {
  return readPng(buf) ?? readGif(buf) ?? readWebp(buf) ?? readJpeg(buf);
}

function u32be(b: Uint8Array, i: number) {
  return ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
}
function u16be(b: Uint8Array, i: number) {
  return (b[i] << 8) | b[i + 1];
}
function u16le(b: Uint8Array, i: number) {
  return b[i] | (b[i + 1] << 8);
}
function u32le(b: Uint8Array, i: number) {
  return (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;
}
function ascii(b: Uint8Array, i: number, len: number) {
  return String.fromCharCode(...b.subarray(i, i + len));
}

/** PNG: IHDR is always the first chunk, at a fixed offset. */
function readPng(b: Uint8Array): Dimensions | null {
  if (b.length < 24) return null;
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!sig.every((v, i) => b[i] === v)) return null;
  if (ascii(b, 12, 4) !== "IHDR") return null;
  return { width: u32be(b, 16), height: u32be(b, 20) };
}

function readGif(b: Uint8Array): Dimensions | null {
  if (b.length < 10) return null;
  if (ascii(b, 0, 3) !== "GIF") return null;
  return { width: u16le(b, 6), height: u16le(b, 8) };
}

/** WebP has three sub-formats (lossy VP8, lossless VP8L, extended VP8X). */
function readWebp(b: Uint8Array): Dimensions | null {
  if (b.length < 30) return null;
  if (ascii(b, 0, 4) !== "RIFF" || ascii(b, 8, 4) !== "WEBP") return null;
  const kind = ascii(b, 12, 4);

  if (kind === "VP8X") {
    // 24-bit little-endian, stored as value - 1.
    const w = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
    const h = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
    return { width: w, height: h };
  }
  if (kind === "VP8 ") {
    // Key frame start code, then 14-bit dimensions.
    if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return null;
    return { width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff };
  }
  if (kind === "VP8L") {
    if (b[20] !== 0x2f) return null;
    const bits = u32le(b, 21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

/** JPEG: walk the marker segments to the start-of-frame that carries the size. */
function readJpeg(b: Uint8Array): Dimensions | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) {
      i++; // resynchronise past padding
      continue;
    }
    const marker = b[i + 1];
    // Standalone markers carry no length.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) return null; // end of header data
    const length = u16be(b, i + 2);
    if (length < 2) return null;
    // SOF0-SOF15, excluding the non-frame markers DHT (c4), JPGA (c8), DAC (cc).
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: u16be(b, i + 5), width: u16be(b, i + 7) };
    }
    i += 2 + length;
  }
  return null;
}
