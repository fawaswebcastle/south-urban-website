import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    /**
     * NOTE: these hosts are allow-listed here, but Next 16 additionally refuses
     * to optimize an upstream whose hostname resolves to a non-public IP. On a
     * network using DNS64/NAT64 the CDN below resolves to `64:ff9b::/96`, which
     * trips that check, and every remote image 400s with the misleading message
     * `"url" parameter is not allowed` (the real reason is in the dev server
     * log). Prefer images under /public; `images.dangerouslyAllowLocalIP` would
     * lift the check but weakens SSRF protection in production.
     */
    remotePatterns: [
      { protocol: "https", hostname: "south-indian-urban-backend.wc-1.previewbay.com" },
      { protocol: "http", hostname: "127.0.0.1", port: "1337" },
      { protocol: "http", hostname: "localhost", port: "1337" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Vercel Blob, where the admin stores uploaded images. Every store gets
      // its own <id>.public.blob.vercel-storage.com host, hence the wildcard.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
