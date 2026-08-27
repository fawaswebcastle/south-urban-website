import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { BLOG } from "@/data/site";
import { getContent, getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — South Urban Agro Multi State Co-operative Society Ltd.",
  description: BLOG.intro,
};

export default async function BlogIndexPage() {
  const [{ blogIntro: BLOG }, POSTS] = await Promise.all([getContent(), getPosts()]);
  const [lead, ...rest] = POSTS;
  const categories = [...new Set(POSTS.map((p) => p.category))];

  return (
    <main>
      {/* --------------------------------------------------------------- Head */}
      <section className="border-b border-rule/80 bg-paper-deep/60 py-12 sm:py-16">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-green"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="label text-green">{BLOG.label}</span>
              <h1 className="font-display mt-3 max-w-[18ch] text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.08] tracking-tight text-ink">
                {BLOG.title}
              </h1>
            </div>
            <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-ink-soft lg:pb-2">
              {BLOG.intro}
            </p>
          </div>

          {/* Categories present in the archive. Static labels — filtering would
              need a client component, and four posts do not warrant one yet. */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li
                key={category}
                className="rounded-lg border border-rule/70 bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-soft"
              >
                {category}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ------------------------------------------------------- Featured post */}
      <section className="bg-paper py-14 sm:py-20">
        <Container>
          <Link href={`/blog/${lead.slug}`} className="group block">
            <article className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-rule/80 bg-card shadow-sm">
                <SafeImage
                  src={lead.image}
                  fallbackSrc="/blog_subsidy.jpg"
                  alt={lead.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 760px, 100vw"
                />
                <span className="absolute left-4 top-4 rounded-lg bg-green px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-sm">
                  Latest
                </span>
              </div>

              <div>
                {/* Separators are dropped on narrow screens, where the row wraps
                    and would otherwise leave a bullet dangling at a line end. */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-ink-soft">
                  <span className="label text-green">{lead.category}</span>
                  <span className="hidden text-rule sm:inline">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    <time dateTime={lead.date}>{lead.dateLabel}</time>
                  </span>
                  <span className="hidden text-rule sm:inline">•</span>
                  <span>{lead.read}</span>
                </div>

                <h2 className="font-display mt-3 text-[clamp(1.5rem,2.8vw,2.15rem)] font-semibold leading-[1.15] tracking-tight text-ink transition-colors group-hover:text-green">
                  {lead.title}
                </h2>

                <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-ink-soft">
                  {lead.excerpt}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-medium text-green">
                  Read the article
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </article>
          </Link>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Archive */}
      <section className="border-t border-rule bg-paper-deep/40 py-14 sm:py-20">
        <Container>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            All articles
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-rule/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-green/50 hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper-deep">
                    <SafeImage
                      src={post.image}
                      fallbackSrc="/blog_harvest.jpg"
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-ink-soft">
                      <span className="label text-green">{post.category}</span>
                      <span className="text-rule">•</span>
                      <time dateTime={post.date}>{post.dateLabel}</time>
                    </div>

                    <h3 className="font-display mt-2.5 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-soft">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-5 text-[12.5px] text-ink-soft">
                      <span>{post.read}</span>
                      <ArrowUpRight
                        size={15}
                        className="text-ink-soft transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green"
                      />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
