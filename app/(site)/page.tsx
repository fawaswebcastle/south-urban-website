import { Hero } from "@/components/Hero";
import { NoticeBar } from "@/components/NoticeBar";
import { WhoWeAre } from "@/components/WhoWeAre";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Careers } from "@/components/Careers";
import { Blog } from "@/components/Blog";
import { Leadership } from "@/components/Leadership";
import { Contact } from "@/components/Contact";
import {
  getContent,
  getGallery,
  getGalleryCategories,
  getNotifications,
  getPeople,
  getPosts,
  getServices,
} from "@/lib/content";

export default async function Home() {
  // Read once here and pass down, because most of these sections are client
  // components and cannot query the database themselves.
  const [content, people, posts, services, gallery, galleryCategories, notifications] = await Promise.all([
    getContent(),
    getPeople(),
    getPosts(),
    getServices(),
    getGallery(),
    getGalleryCategories(),
    getNotifications(),
  ]);

  return (
    <main>
      <Hero hero={content.hero} />
      <NoticeBar notifications={notifications} />
      <WhoWeAre whoWeAre={content.whoWeAre} facts={content.facts} images={content.images} />
      <Services services={services} whatWeOffer={content.whatWeOffer} />
      <Leadership board={people.board} management={people.management} />
      <Gallery gallery={gallery} categories={galleryCategories} />
      <Careers careers={content.careers} />
      <Blog posts={posts} />
      <Contact contact={content.contact} />
    </main>
  );
}
