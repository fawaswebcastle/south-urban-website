/**
 * Strapi Headless CMS API Client for South Urban Next.js Frontend.
 *
 * Connects to Strapi (http://127.0.0.1:1337) with Next.js fetch caching
 * and revalidation tags.
 */

import "server-only";

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export const CONTENT_TAG = "content";

export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function fetchStrapi<T>(
  path: string,
  options: { revalidate?: number; tags?: string[] } = {}
): Promise<T | null> {
  const url = `${STRAPI_URL}/api${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: {
        revalidate: options.revalidate ?? 0,
        tags: options.tags ?? [CONTENT_TAG],
      },
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(`[Strapi] GET ${url} returned status ${res.status}`);
      }
      return null;
    }

    const json = await res.json();
    return json.data as T;
  } catch (error) {
    console.error(`[Strapi] Fetch failed for ${url}:`, error);
    return null;
  }
}
