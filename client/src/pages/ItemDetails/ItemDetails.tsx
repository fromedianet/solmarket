import Header from "components/Header/Header";
import React, { useState } from "react";
import ItemInfo from "./ItemInfo";
import "./index.css";
import ItemActivities from "./ItemActivities";
import ItemMore from "./ItemMore";

export default function ItemDetails() {
  return (
    <div className="main page bg-color-primary">
      <Header />
      <section className="item-details-area">
        <div className="container">
          <ItemInfo />
          <ItemActivities />
          <ItemMore />
        </div>
      </section>
    </div>
  );
}
