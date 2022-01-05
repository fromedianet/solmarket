import React from "react";
import FeaturedCarousel from "./FeaturedCarousel";
import UpcomingLaunches from "./UpcomingLaunches";

export default function Home() {
  return (
    <div className="flex flex-column w-full">
      <FeaturedCarousel />
      <UpcomingLaunches />
    </div>
  );
}
