import React from "react";
import FeaturedCarousel from "./FeaturedCarousel";
import NewCollections from "./NewCollections";
import UpcomingLaunches from "./UpcomingLaunches";

export default function Home() {
  return (
    <div className="flex flex-column w-full">
      <FeaturedCarousel />
      <UpcomingLaunches />
      <NewCollections />
    </div>
  );
}
