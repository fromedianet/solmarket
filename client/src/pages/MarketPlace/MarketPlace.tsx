import Header from "components/Header/Header";
import React from "react";
import CollectionInfo from "./CollectionInfo";
import "./index.css";

export default function MarketPlace({ id }: any) {
  return (
    <div className="main page marketplace-page">
      <Header />
      <section className="flex flex-col flex-auto mt-32">
        <div className="flex flex-col">
          <CollectionInfo />
        </div>
      </section>
    </div>
  );
}
