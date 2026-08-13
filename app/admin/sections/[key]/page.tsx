import { notFound } from "next/navigation";
import { SECTION_SCHEMAS, getSchema } from "@/lib/content-schema";
import { getSectionValue } from "@/lib/section-values";
import { requireSessionUser } from "@/lib/session";
import { SectionForm } from "@/components/admin/SectionForm";

export function generateStaticParams() {
  return SECTION_SCHEMAS.map((s) => ({ key: s.key }));
}

/** Where each block appears, so "View on site" lands in the right place. */
const PREVIEW: Record<string, string> = {
  hero: "/",
  notice: "/",
  whoWeAre: "/#who-we-are",
  facts: "/",
  blogIntro: "/blog",
  job: "/#careers",
  contact: "/#contact",
  socials: "/",
  navLinks: "/",
  branding: "/",
  overview: "/about",
  coopPrinciples: "/about",
  coopActivities: "/about",
  companyDetails: "/about",
  vision: "/about",
  mission: "/about",
  objectives: "/about",
  goals: "/about",
  values: "/about",
  membership: "/about",
  aboutImages: "/about",
};

export default async function SectionPage({ params }: PageProps<"/admin/sections/[key]">) {
  await requireSessionUser();
  const { key } = await params;

  const schema = getSchema(key);
  if (!schema) notFound();

  const initial = await getSectionValue(key);

  return <SectionForm schema={schema} initial={initial} previewHref={PREVIEW[key]} />;
}
