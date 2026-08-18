import CinematicJourney from "@/components/cinematic/CinematicJourney";
import CollectionTransition from "@/components/cinematic/CollectionTransition";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import CakeShowcase from "@/components/home/CakeShowcase";
import StoryPreview from "@/components/home/StoryPreview";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      {/* Act I — the brand film: eight scroll-scrubbed chocolate chapters */}
      <CinematicJourney />

      {/* The seam — the dark film dissolves into the cream storefront */}
      <CollectionTransition />

      {/* Act II — the storefront, one continuous journey */}
      <FeaturedProducts />
      <Categories />
      <CakeShowcase />
      <StoryPreview />
      <Testimonials />
      <ContactSection />
    </>
  );
}
