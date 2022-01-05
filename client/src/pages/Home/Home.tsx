import React from "react";
import FeaturedCarousel from "./FeaturedCarousel";
import NewCollections from "./NewCollections";
import PopularCollections from "./PopularCollections";
import UpcomingLaunches from "./UpcomingLaunches";

export default function Home() {
  return (
    <div className="flex flex-column w-full">
      <FeaturedCarousel />
      <UpcomingLaunches />
      <NewCollections />
      <PopularCollections />
    </div>
  );
}
