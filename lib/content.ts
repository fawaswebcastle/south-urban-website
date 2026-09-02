/**
 * Reads published content for the public site from the clean Strapi 5 Headless CMS backend
 * (http://127.0.0.1:1337).
 *
 * Every getter falls back seamlessly to the matching export in `data/site.ts` when the
 * Strapi backend entry is missing, empty, or unreachable.
 */

import "server-only";
import * as defaults from "@/data/site";
import { fetchStrapi, getStrapiMediaUrl } from "./strapi";
import type {
  Post,
  Service,
  Notification,
  GalleryItem,
} from "./content-types";

export const CONTENT_TAG = "content";

/** Helper to wrap async getters with fallback to default values on failure or empty response */
async function safe<T>(run: () => Promise<T | null | undefined>, fallback: T, label: string): Promise<T> {
  try {
    const result = await run();
    if (result === null || result === undefined) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch (error) {
    console.error(`[content] ${label} fell back to data/site.ts:`, error);
    return fallback;
  }
}

export async function getContent() {
  const [
    heroRes,
    whoWeAreRes,
    noticeRes,
    contactRes,
    companyRes,
    overviewRes,
    visionRes,
    missionRes,
    objectivesRes,
    goalsRes,
    valuesRes,
    membershipRes,
    activitiesRes,
    blogIntroRes,
    brandingRes,
    whatWeOfferRes,
    headerRes,
    footerRes,
    careersRes,
  ] = await Promise.all([
    fetchStrapi<any>("/hero?populate=*"),
    fetchStrapi<any>("/who-we-are?populate=*"),
    fetchStrapi<any>("/notice?populate=*"),
    fetchStrapi<any>("/contact?populate=*"),
    fetchStrapi<any>("/company-details?populate=*"),
    fetchStrapi<any>("/overview?populate=*"),
    fetchStrapi<any>("/vision?populate=*"),
    fetchStrapi<any>("/mission?populate=*"),
    fetchStrapi<any>("/objectives?populate=*"),
    fetchStrapi<any>("/goals?populate=*"),
    fetchStrapi<any>("/values?populate=*"),
    fetchStrapi<any>("/membership?populate[classes][populate]=*&populate[documents][populate]=*"),
    fetchStrapi<any>("/coop-activities?populate=*"),
    fetchStrapi<any>("/blog-intro?populate=*"),
    fetchStrapi<any>("/branding?populate=*"),
    fetchStrapi<any>("/what-we-offer?populate=*"),
    fetchStrapi<any>("/header?populate=*"),
    fetchStrapi<any>("/footer?populate=*"),
    fetchStrapi<any>("/careers?populate=*"),
  ]);

  const hero = {
    ...defaults.HERO,
    title: heroRes?.title || defaults.HERO.title,
    intro: heroRes?.subtitle || defaults.HERO.intro,
    badge: heroRes?.badge,
    actionText: heroRes?.actionText,
    actionUrl: heroRes?.actionUrl,
    banner: {
      ...defaults.HERO.banner,
      main: {
        ...defaults.HERO.banner.main,
        src: getStrapiMediaUrl(heroRes?.bgImage?.url) || defaults.HERO.banner.main.src,
      },
    },
  };

  const whoWeAre = {
    ...defaults.WHO_WE_ARE,
    tag: whoWeAreRes?.tag || defaults.WHO_WE_ARE.label,
    label: whoWeAreRes?.tag || defaults.WHO_WE_ARE.label,
    title: whoWeAreRes?.title || defaults.WHO_WE_ARE.title,
    lead: whoWeAreRes?.description1 || defaults.WHO_WE_ARE.lead,
    body: [
      whoWeAreRes?.description1 || defaults.WHO_WE_ARE.body[0],
      whoWeAreRes?.description2 || defaults.WHO_WE_ARE.body[1],
    ],
    regBadgeText: whoWeAreRes?.regBadgeText || "MSCS Reg: MSCS/CR/1664/2026",
    cardTitle: whoWeAreRes?.cardTitle || "South Urban Agro Co-op",
    cardSubtitle: whoWeAreRes?.cardSubtitle || "Serving Kerala & Tamil Nadu",
    bannerImage: getStrapiMediaUrl(whoWeAreRes?.bannerImage?.url) || "/who_we_are_banner.png",
    tabs: Array.isArray(whoWeAreRes?.tabs) && whoWeAreRes.tabs.length > 0
      ? whoWeAreRes.tabs.map((t: any) => ({
          id: t.tabId || t.id || t.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          label: t.label,
          title: t.title,
          body: t.body,
        }))
      : undefined,
    pillars: Array.isArray(whoWeAreRes?.pillars) && whoWeAreRes.pillars.length > 0
      ? whoWeAreRes.pillars.map((p: any) => ({
          icon: p.icon || "Sprout",
          title: p.title,
          desc: p.desc,
        }))
      : undefined,
  };

  const contact = {
    ...defaults.CONTACT,
    tag: contactRes?.tag || "Contact us",
    title: contactRes?.title || "Have a question, enquiry, or partnership proposal?",
    description: contactRes?.description || "We'd love to hear from you.",
    phone: contactRes?.phone || defaults.CONTACT.phone,
    email: contactRes?.email || defaults.CONTACT.email,
    address: contactRes?.address || defaults.CONTACT.address,
    newsletterTitle: contactRes?.newsletterTitle || "Stay in the loop",
    newsletterSubtitle: contactRes?.newsletterSubtitle || "Subscribe for news, updates, and offers from South Urban.",
  };

  const notice = {
    ...defaults.NOTICE,
    title: noticeRes?.text || defaults.NOTICE.title,
    text: noticeRes?.text || defaults.NOTICE.title,
    categories: noticeRes?.categories || defaults.NOTICE.categories,
  };

  const companyDetails = {
    ...defaults.COMPANY_DETAILS,
    tag: companyRes?.tag || "Company details",
    title: companyRes?.title || "Constituted under the MSCS Act, 2002",
    intro: companyRes?.intro || defaults.COMPANY_DETAILS.intro,
    bannerTitle: companyRes?.bannerTitle || "One membership, two states",
    bannerSubtitle: companyRes?.bannerSubtitle || "Kerala and Tamil Nadu, on a single Society record.",
    bannerImage: companyRes?.bannerImage?.url ? getStrapiMediaUrl(companyRes.bannerImage.url) : defaults.IMAGES.whoWeAreBanner,
    rows: Array.isArray(companyRes?.rows) && companyRes.rows.length > 0 ? companyRes.rows : defaults.COMPANY_DETAILS.rows,
    regNo: companyRes?.regNo || defaults.COMPANY_DETAILS.regNo,
    subtitle: companyRes?.subtitle || defaults.COMPANY_DETAILS.subtitle,
    address: companyRes?.address || defaults.COMPANY_DETAILS.address,
    phone: companyRes?.phone || defaults.CONTACT.phone,
    email: companyRes?.email || defaults.CONTACT.email,
    gst: companyRes?.gst || defaults.COMPANY_DETAILS.gst,
    mapUrl: companyRes?.mapUrl || defaults.COMPANY_DETAILS.mapUrl,
    acts: companyRes?.acts || defaults.COMPANY_DETAILS.acts,
    bullets: companyRes?.bullets || defaults.COMPANY_DETAILS.bullets,
  };

  const overview = {
    ...defaults.OVERVIEW,
    label: overviewRes?.tag || defaults.OVERVIEW.label,
    tag: overviewRes?.tag || defaults.OVERVIEW.label,
    title: overviewRes?.title || defaults.OVERVIEW.title,
    lead: overviewRes?.intro || defaults.OVERVIEW.lead,
    body: overviewRes?.paragraphs || defaults.OVERVIEW.body,
    mainImage: overviewRes?.mainImage?.url ? getStrapiMediaUrl(overviewRes.mainImage.url) : defaults.IMAGES.harvest,
    floatingCardTitle: overviewRes?.floatingCardTitle || "Incorporated under Central Registrar",
    floatingCardSubtitle: overviewRes?.floatingCardSubtitle || "New Delhi, Ministry of Cooperation.",
  };

  const vision = {
    ...defaults.VISION,
    tag: visionRes?.tag || visionRes?.title || defaults.VISION.label || "Vision",
    label: visionRes?.tag || visionRes?.title || defaults.VISION.label || "Vision",
    title: visionRes?.title || defaults.VISION.label || "Vision",
    statement: visionRes?.statement || defaults.VISION.statement,
    bgImage: visionRes?.bgImage?.url ? getStrapiMediaUrl(visionRes.bgImage.url) : defaults.IMAGES.drone,
  };

  const mission = {
    ...defaults.MISSION,
    label: missionRes?.label || missionRes?.tag || defaults.MISSION.label,
    tag: missionRes?.tag || missionRes?.label || defaults.MISSION.label,
    title: missionRes?.title || defaults.MISSION.label,
    lead: missionRes?.lead || missionRes?.statement || defaults.MISSION.lead,
    items: Array.isArray(missionRes?.items) && missionRes.items.length > 0
      ? missionRes.items.map((item: any) => ({
          focus: item.focus || item.title || "Mission",
          text: item.text || item.desc || item.statement || "",
        }))
      : defaults.MISSION.items,
  };

  const objectives = {
    tag: objectivesRes?.tag || "Objectives",
    title: objectivesRes?.title || "Four commitments that shape the working day",
    sideImage: objectivesRes?.sideImage?.url ? getStrapiMediaUrl(objectivesRes.sideImage.url) : defaults.IMAGES.polyhouse,
    items: Array.isArray(objectivesRes?.items) && objectivesRes.items.length > 0
      ? objectivesRes.items.map((item: any, i: number) => {
          const defaultIcons = ["BadgeCheck", "HandCoins", "ShieldCheck", "TrendingUp"];
          const iconMediaUrl = getStrapiMediaUrl(item.iconMedia?.url);
          return {
            icon: item.icon || defaultIcons[i % defaultIcons.length] || "BadgeCheck",
            iconMedia: iconMediaUrl || undefined,
            title: item.title || "",
            desc: item.desc || "",
          };
        })
      : defaults.OBJECTIVES,
  };

  const goals = {
    ...defaults.GOALS,
    label: goalsRes?.label || goalsRes?.tag || defaults.GOALS.label,
    tag: goalsRes?.tag || goalsRes?.label || defaults.GOALS.label,
    title: goalsRes?.title || "What we are working towards",
    statement: goalsRes?.statement || goalsRes?.intro || defaults.GOALS.statement,
    bgImage: goalsRes?.bgImage?.url ? getStrapiMediaUrl(goalsRes.bgImage.url) : defaults.IMAGES.drone,
    primaryCtaLabel: goalsRes?.primaryCtaLabel || "Explore our services",
    primaryCtaHref: goalsRes?.primaryCtaHref || "/#services",
    secondaryCtaLabel: goalsRes?.secondaryCtaLabel || "Talk to the Society",
    secondaryCtaHref: goalsRes?.secondaryCtaHref || "/#contact",
  };

  const values = {
    tag: valuesRes?.tag || "Values",
    title: valuesRes?.title || "Seven principles our members hold us to",
    intro: valuesRes?.intro || "Guided by ethical principles in every decision.",
    tileText: valuesRes?.tileText || "Every member has one equal voice, and a share in what the Society earns.",
    tileImage: valuesRes?.tileImage?.url ? getStrapiMediaUrl(valuesRes.tileImage.url) : defaults.IMAGES.memberMeeting,
    items: Array.isArray(valuesRes?.items) && valuesRes.items.length > 0
      ? valuesRes.items.map((item: any, i: number) => {
          const defaultIcons = ["Eye", "Users2", "ShieldCheck", "Gem", "Lightbulb", "Handshake", "Leaf"];
          const iconMediaUrl = getStrapiMediaUrl(item.iconMedia?.url);
          return {
            icon: item.icon || defaultIcons[i % defaultIcons.length] || "ShieldCheck",
            iconMedia: iconMediaUrl || undefined,
            title: item.title || "",
            desc: item.desc || "",
          };
        })
      : defaults.VALUES,
  };

  const membership = {
    ...defaults.MEMBERSHIP,
    label: membershipRes?.label || membershipRes?.tag || defaults.MEMBERSHIP.label,
    tag: membershipRes?.tag || membershipRes?.label || defaults.MEMBERSHIP.label,
    title: membershipRes?.title || defaults.MEMBERSHIP.title,
    intro: membershipRes?.intro || defaults.MEMBERSHIP.intro,
    classes: Array.isArray(membershipRes?.classes) && membershipRes.classes.length > 0
      ? membershipRes.classes.map((cls: any, i: number) => {
          const fallbackClass = defaults.MEMBERSHIP.classes[i] || defaults.MEMBERSHIP.classes[0];
          return {
            name: cls.name || fallbackClass.name,
            tagline: cls.tagline || fallbackClass.tagline,
            total: cls.total || fallbackClass.total,
            totalLabel: cls.totalLabel || fallbackClass.totalLabel,
            rows: Array.isArray(cls.rows) && cls.rows.length > 0
              ? cls.rows.map((r: any) => ({ label: r.label || "", value: r.value || "" }))
              : fallbackClass.rows,
          };
        })
      : defaults.MEMBERSHIP.classes,
    documentsTag: membershipRes?.documentsTag || "Documents required",
    documentsImage: membershipRes?.documentsImage?.url ? getStrapiMediaUrl(membershipRes.documentsImage.url) : "/hero_banner.jpg",
    documents: Array.isArray(membershipRes?.documents) && membershipRes.documents.length > 0
      ? membershipRes.documents.map((doc: any) => ({
          icon: doc.icon || "FileText",
          iconMedia: doc.iconMedia?.url ? getStrapiMediaUrl(doc.iconMedia.url) : undefined,
          label: doc.label || "",
        }))
      : defaults.MEMBERSHIP.documents,
  };

  const coopActivities = {
    tag: activitiesRes?.tag || "Activities",
    title: activitiesRes?.title || "What the Society puts its resources behind",
    items: Array.isArray(activitiesRes?.items) && activitiesRes.items.length > 0
      ? activitiesRes.items.map((item: any, i: number) => {
          const defaultIcons = ["Sprout", "ShoppingBasket", "Warehouse", "PackageCheck", "Milk", "HandCoins"];
          const iconMediaUrl = getStrapiMediaUrl(item.iconMedia?.url);
          return {
            icon: item.icon || defaultIcons[i % defaultIcons.length] || "Sprout",
            iconMedia: iconMediaUrl || undefined,
            title: item.title || "",
            desc: item.desc || "",
          };
        })
      : defaults.COOP_ACTIVITIES,
  };

  const blogIntro = {
    ...defaults.BLOG,
    label: blogIntroRes?.label || defaults.BLOG.label,
    title: blogIntroRes?.title || defaults.BLOG.title,
    intro: blogIntroRes?.intro || defaults.BLOG.intro,
  };

  const rawSocials = (Array.isArray(headerRes?.socials) && headerRes.socials.length > 0)
    ? headerRes.socials
    : (Array.isArray(contactRes?.socials) && contactRes.socials.length > 0)
    ? contactRes.socials
    : defaults.HEADER.socials;
  const socials = rawSocials.map((s: any) => ({
    name: s.platform || s.name || "",
    href: s.url || s.href || "#",
  })).filter((s: any) => s.name && s.href);

  const navLinks = (Array.isArray(headerRes?.navItems) && headerRes.navItems.length > 0)
    ? headerRes.navItems.map((n: any) => ({ label: n.label, href: n.href }))
    : (Array.isArray(footerRes?.quickLinks) && footerRes.quickLinks.length > 0)
    ? footerRes.quickLinks.map((n: any) => ({ label: n.label, href: n.href }))
    : defaults.NAV_LINKS;
  const branding = {
    logo: getStrapiMediaUrl(brandingRes?.logo?.url) || defaults.HEADER.logo,
  };

  const whatWeOffer = {
    tag: whatWeOfferRes?.tag || "WHAT WE OFFER",
    title: whatWeOfferRes?.title || "Twelve services, across the whole agricultural value chain.",
    description: whatWeOfferRes?.description || "Each opens as you scroll — or select any line to jump to it.",
    image: getStrapiMediaUrl(whatWeOfferRes?.image?.url) || "",
    items: Array.isArray(whatWeOfferRes?.items) && whatWeOfferRes.items.length > 0
      ? whatWeOfferRes.items.map((i: any) => ({
          title: i.title,
          summary: i.summary,
          body: i.body,
        }))
      : defaults.SERVICES,
  };

  const header = {
    phone: headerRes?.phone || contactRes?.phone || defaults.HEADER.phone,
    contactBtnLabel: headerRes?.contactBtnLabel || defaults.HEADER.contactBtnLabel,
    contactBtnHref: headerRes?.contactBtnHref || defaults.HEADER.contactBtnHref,
    logo: getStrapiMediaUrl(headerRes?.logo?.url) || getStrapiMediaUrl(brandingRes?.logo?.url) || defaults.HEADER.logo,
    navItems: navLinks.length > 0 ? navLinks : defaults.HEADER.navItems,
    socials: socials.length > 0 ? socials : defaults.HEADER.socials,
  };

  const footer = {
    description: footerRes?.description || "",
    regText: footerRes?.regText || "",
    areaText: footerRes?.areaText || "",
    quickLinksTitle: footerRes?.quickLinksTitle || "",
    quickLinks: Array.isArray(footerRes?.quickLinks) && footerRes.quickLinks.length > 0
      ? footerRes.quickLinks.map((n: any) => ({ label: n.label, href: n.href }))
      : [],
    contactTitle: footerRes?.contactTitle || "",
    phone: footerRes?.phone || "",
    email: footerRes?.email || "",
    address: footerRes?.address || "",
    copyright: footerRes?.copyright || "",
    actText: footerRes?.actText || "",
    logo: getStrapiMediaUrl(footerRes?.logo?.url) || "",
  };

  const careers = {
    tag: careersRes?.tag || defaults.CAREERS.tag,
    title: careersRes?.title || defaults.CAREERS.title,
    description: careersRes?.description || defaults.CAREERS.description,
    btnLabel: careersRes?.btnLabel || defaults.CAREERS.btnLabel,
    btnHref: careersRes?.btnHref || defaults.CAREERS.btnHref,
  };

  return {
    hero,
    whoWeAre,
    notice,
    header,
    footer,
    careers,
    facts: Array.isArray(whoWeAreRes?.facts) && whoWeAreRes.facts.length > 0
      ? whoWeAreRes.facts.map((f: any) => ({
          value: f.value,
          label: f.label,
        }))
      : (defaults.FACTS as unknown as typeof defaults.FACTS),
    overview,
    coopPrinciples: defaults.COOP_PRINCIPLES,
    coopActivities,
    companyDetails,
    vision,
    mission,
    objectives,
    goals,
    values,
    membership,
    blogIntro,
    whatWeOffer,
    job: defaults.JOB,
    contact,
    socials,
    navLinks,
    images: defaults.IMAGES,
    branding,
  };
}

export type SiteContent = Awaited<ReturnType<typeof getContent>>;

// ------------------------------------------------------------- Collections

export async function getPeople() {
  return safe(
    async () => {
      const list = await fetchStrapi<any[]>("/people?populate=*");
      if (!list || list.length === 0) return null;

      const board: Array<typeof defaults.BOARD[number]> = [];
      const management: Array<typeof defaults.MANAGEMENT[number]> = [];

      const allDefaults = [...defaults.BOARD, ...defaults.MANAGEMENT];

      for (const p of list) {
        const matched = allDefaults.find(
          (d) => d.name.toLowerCase() === p.name?.toLowerCase()
        );

        const photoUrl =
          getStrapiMediaUrl(p.photo?.url) ||
          (typeof p.photo === "string" ? p.photo : "") ||
          matched?.photo ||
          "/sujan_mathew.jpg";

        const item = {
          name: p.name,
          role: p.role,
          photo: photoUrl,
          photoPosition: p.photoPosition || matched?.photoPosition || undefined,
          teaser: p.teaser || matched?.teaser || "",
          bio: p.bio || matched?.bio || "",
        };
        if (p.group === "board") board.push(item);
        else management.push(item);
      }

      if (board.length === 0 && management.length === 0) return null;
      return {
        board: board.length > 0 ? board : defaults.BOARD,
        management: management.length > 0 ? management : defaults.MANAGEMENT,
      };
    },
    { board: defaults.BOARD, management: defaults.MANAGEMENT },
    "people"
  );
}

export async function getPosts() {
  return safe(
    async () => {
      const list = await fetchStrapi<any[]>("/posts?populate=*");
      if (!list || list.length === 0) return null;

      return list.map((p: any) => ({
        slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: p.title,
        excerpt: p.excerpt || "",
        read: p.readTime || "3 min read",
        image: getStrapiMediaUrl(p.image?.url) || p.image || "",
        date: p.date || new Date().toISOString().slice(0, 10),
        dateLabel: p.date || "13 August 2026",
        category: p.category || "General",
        author: p.author || "South Urban Team",
        body: p.body || [{ kind: "paragraph", text: p.excerpt || "" }],
      }));
    },
    defaults.POSTS as unknown as Post[],
    "posts"
  );
}

export async function getServices() {
  return safe(
    async () => {
      const list = await fetchStrapi<any[]>("/services?populate=*");
      if (!list || list.length === 0) return null;

      return list.map((s: any) => ({
        title: s.title,
        summary: s.summary,
        body: s.body,
      }));
    },
    defaults.SERVICES as unknown as Service[],
    "services"
  );
}

export async function getNotifications(): Promise<Notification[]> {
  return safe<Notification[]>(
    async () => {
      const list = await fetchStrapi<any[]>("/notifications?populate=*");
      if (!list || list.length === 0) return null;

      return list.map((n: any) => {
        const docMedia = n.document || n.file || n.attachment;
        const rawUrl =
          (typeof docMedia === "string" ? docMedia : "") ||
          docMedia?.url ||
          docMedia?.data?.attributes?.url ||
          docMedia?.data?.url ||
          (Array.isArray(docMedia) ? docMedia[0]?.url || docMedia[0]?.data?.attributes?.url : "") ||
          n.documentUrl ||
          "";
        const documentUrl = getStrapiMediaUrl(rawUrl);
        return {
          id: String(n.id || n.documentId),
          title: n.title,
          date: n.date,
          category: n.category || "Announcement",
          summary: n.summary || "",
          hasDownload: Boolean(documentUrl),
          documentUrl,
        };
      });
    },
    defaults.NOTIFICATIONS as unknown as Notification[],
    "notifications"
  );
}

export async function getGallery() {
  return safe(
    async () => {
      const list = await fetchStrapi<any[]>("/gallery-items?populate=*");
      if (!list || list.length === 0) return null;

      return list.map((g: any, index: number) => {
        const fallback = defaults.GALLERY[index % defaults.GALLERY.length];
        return {
          src: getStrapiMediaUrl(g.src?.url) || (g.src && typeof g.src === "string" ? g.src : "") || fallback?.src || "",
          alt: g.alt || fallback?.alt || "Gallery Image",
          category: g.gallery_category?.name || g.category || fallback?.category || "Operations",
        };
      });
    },
    defaults.GALLERY as unknown as GalleryItem[],
    "gallery"
  );
}

export async function getGalleryCategories() {
  return safe(
    async () => {
      const list = await fetchStrapi<any[]>("/gallery-categories?populate=*");
      if (!list || list.length === 0) return null;

      return list.map((c: any) => ({
        name: c.name,
        order: c.order ?? 0,
      }));
    },
    [
      { name: "Operations", order: 1 },
      { name: "Events", order: 2 },
    ],
    "gallery-categories"
  );
}
