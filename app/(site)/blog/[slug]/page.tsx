import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, PenLine } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { POSTS as POSTS_STATIC, type PostBlock } from "@/data/site";
import { getPosts } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams() {
  // Build-time only. Slugs added later render on demand.
  return POSTS_STATIC.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPosts()).find((p) => p.slug === slug);

  if (!post) return { title: "Article not found — South Urban" };

  return {
    title: `${post.title} — South Urban`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [post.image],
    },
  };
}

/** One article body block. The union is defined alongside the posts in data/site.ts. */
function Block({ block }: { block: PostBlock }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="font-display mt-12 text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
          {block.text}
        </h2>
      );

    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item.slice(0, 40)} className="flex gap-3.5">
              <span
                aria-hidden
                className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-green"
              />
              <span className="text-[16px] leading-relaxed text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="mt-10 border-l-2 border-green pl-6">
          <p className="font-display text-lg leading-relaxed text-ink sm:text-xl">
            {block.text}
          </p>
          {block.attribution && (
            <footer className="label mt-3 text-ink-soft/70">{block.attribution}</footer>
          )}
        </blockquote>
      );

    default:
      return (
        <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft">{block.text}</p>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = (await getPosts()).find((p) => p.slug === slug);

  if (!post) notFound();

  const related = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main>
      {/* --------------------------------------------------------------- Head */}
      <section className="border-b border-rule/80 bg-paper-deep/60 py-10 sm:py-14">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-green"
          >
            <ArrowLeft size={15} />
            All articles
          </Link>

          <div className="mt-6 max-w-3xl">
            <span className="label text-green">{post.category}</span>

            <h1 className="font-display mt-3 text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-[1.1] tracking-tight text-ink">
              {post.title}
            </h1>

            <p className="mt-4 max-w-[58ch] text-[16.5px] leading-relaxed text-ink-soft">
              {post.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-5 text-[13px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <PenLine size={14} className="text-green" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-green" />
                <time dateTime={post.date}>{post.dateLabel}</time>
              </span>
              <span>{post.read}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- Cover image */}
      <section className="bg-paper pt-10 sm:pt-14">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-rule/80 bg-card shadow-sm sm:aspect-[2.4/1]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1400px) 1320px, 100vw"
            />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- Article */}
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          {/* Capped so the measure stays readable and the aside sits beside the
              text rather than across a gutter of dead space on wide screens. */}
          <div className="grid max-w-[1120px] gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
            <article>
              {post.body.map((block, i) => (
                <Block key={`${block.kind}-${i}`} block={block} />
              ))}
            </article>

            {/* Sidebar: the Society is the point of every one of these articles,
                so the aside carries the call to act rather than more links. */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-2xl border border-rule/80 bg-card p-6 shadow-2xs">
                <span className="label text-green">Members</span>
                <h2 className="font-display mt-2.5 text-[17px] font-semibold leading-snug text-ink">
                  Questions about this?
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  Your unit&apos;s field officer can walk you through what this
                  means for your holding.
                </p>
                <Button href="/#contact" variant="solid" className="mt-5 w-full justify-center">
                  Talk to the Society
                </Button>
                <Link
                  href="/about"
                  className="mt-3 block text-center text-[13px] font-medium text-ink-soft transition-colors hover:text-green"
                >
                  About the Society
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Related */}
      <section className="border-t border-rule bg-paper-deep/40 py-14 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              More from the Society
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-green hover:underline"
            >
              View all articles
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-rule/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-green/50 hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="label text-green">{item.category}</span>
                    <h3 className="font-display mt-2 text-[1.02rem] font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-4 text-[12.5px] text-ink-soft">
                      {item.read}
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
