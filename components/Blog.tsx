import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHeading } from "./ui/SectionHeading";
import { Button } from "./ui/Button";
import { SafeImage } from "./ui/SafeImage";
import { POSTS as POSTS_DEFAULT } from "@/data/site";
import type { Post } from "@/lib/content-types";

export function Blog({ posts: POSTS = POSTS_DEFAULT }: { posts?: readonly Post[] } = {}) {
  const [lead, ...rest] = POSTS;

  return (
    <section id="blog" className="scroll-mt-28 bg-paper-deep/50 py-16 sm:py-24 border-y border-rule/70">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            label="Insights & updates"
            title="Latest from our blog"
            intro="Articles, market news, and insights from South Urban's team of agri-experts."
          />
          <Button href="/blog" variant="outline" className="shrink-0">
            View all articles
            <ArrowRight size={15} />
          </Button>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Lead story */}
          {lead && (
            <Link href={`/blog/${lead.slug}`} className="group block">
              <article>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-rule/70 bg-card shadow-xs">
                  <SafeImage
                    src={lead.image}
                    fallbackSrc="/blog_subsidy.jpg"
                    alt={lead.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 620px, 100vw"
                  />
                </div>
                <p className="label mt-4 text-green">{lead.read}</p>
                <h3 className="font-display mt-2 text-xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-green sm:text-2xl">
                  {lead.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                  {lead.excerpt}
                </p>
              </article>
            </Link>
          )}

          {/* List stories */}
          <div className="border-t border-rule/80">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-4 border-b border-rule/70 py-5"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-rule/70 bg-card sm:h-22 sm:w-28">
                  <SafeImage
                    src={post.image}
                    fallbackSrc="/blog_harvest.jpg"
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="label text-ink-soft/70">{post.read}</p>
                  <h3 className="font-display mt-1 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-green">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="mt-1 shrink-0 text-ink-soft transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green"
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
