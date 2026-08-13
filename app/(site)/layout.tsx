import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getContent, getPeople, getPosts, getServices } from "@/lib/content";

/**
 * Chrome for the public site only.
 *
 * The header and footer live here rather than in the root layout so that
 * /admin, which is a sibling route group, does not inherit them — an editor
 * should not be looking at the visitor-facing navigation while working.
 *
 * Nav is a client component, so everything it renders is passed as props
 * rather than read from the database inside it.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [content, people, posts, services] = await Promise.all([
    getContent(),
    getPeople(),
    getPosts(),
    getServices(),
  ]);

  return (
    <>
      <Nav
        navLinks={content.navLinks}
        contact={content.contact}
        socials={content.socials}
        board={people.board}
        posts={posts}
        services={services}
      />
      <div className="flex-1">{children}</div>
      <Footer
        navLinks={content.navLinks}
        contact={content.contact}
        companyDetails={content.companyDetails}
      />
    </>
  );
}
