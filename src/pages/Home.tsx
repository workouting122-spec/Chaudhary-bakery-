import CameraTimeline, { type Chapter } from "@/components/ui/CameraTimeline";
import Opening from "@/components/scenes/Opening";
import Brand from "@/components/scenes/Brand";
import FeaturedIntro from "@/components/scenes/FeaturedIntro";
import HouseTour from "@/components/scenes/HouseTour";
import Amenities from "@/components/scenes/Amenities";
import Collection from "@/components/scenes/Collection";
import Location from "@/components/scenes/Location";
import Trust from "@/components/scenes/Trust";
import FinalCTA from "@/components/scenes/FinalCTA";

const CHAPTERS: Chapter[] = [
  { id: "top", label: "Arrival" },
  { id: "tour", label: "The Tour" },
  { id: "amenities", label: "Amenities" },
  { id: "collection", label: "Collection" },
  { id: "location", label: "Location" },
  { id: "trust", label: "Trust" },
  { id: "cta", label: "Enquire" },
];

/**
 * The full cinematic journey — one continuous film from arrival to enquiry.
 * Scroll is the camera; each scene hands off to the next without a hard break.
 */
export default function Home() {
  return (
    <>
      <CameraTimeline chapters={CHAPTERS} />
      <Opening />
      <Brand />
      <FeaturedIntro />
      <HouseTour />
      <Amenities />
      <Collection />
      <Location />
      <Trust />
      <FinalCTA />
    </>
  );
}
