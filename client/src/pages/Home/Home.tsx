import Header from "components/Header/Header";
import React from "react";
import ExploreItems from "./ExploreItems";
import FeaturedCarousel from "./FeaturedCarousel";
import NewCollections from "./NewCollections";
import PopularCollections from "./PopularCollections";
import UpcomingLaunches from "./UpcomingLaunches";

export default function Home() {
  return (
    <div className="main home-page">
      <Header />
      <FeaturedCarousel />
      <UpcomingLaunches />
      <NewCollections />
      <PopularCollections />
      <ExploreItems />
    </div>
  );
}
