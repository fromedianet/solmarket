import CollectionCard from "components/Cards/CollectionCard";
import React, { useState } from "react";
import { Collection } from "types/itemTypes";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import dummy from "./dummy.json";

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  768: { items: 3 },
  1024: { items: 4 },
};

export default function NewCollections() {
  const prepareData = () => {
    let newList: Collection[] = [];
    dummy.data.forEach((el) => {
      const item: Collection = {
        name: el.name,
        description: el.description,
        type: el.type,
        image: el.image,
        link: el.link,
      };
      newList.push(item);
    });
    return newList;
  };

  const [list, setList] = useState<Collection[]>(prepareData());

  const handleDragStart = (e: any) => e.preventDefault();

  const getItems = () => {
    const items = list.map((item, index) => {
      return (
        <CollectionCard
          collection={item}
          key={index}
          handleDragStart={handleDragStart}
        />
      );
    });
    return items;
  };

  return (
    <section className="flex justify-center w-full mt-10">
      <div className="w-full card-section">
        <div className="row">
          <div className="col-12 m-0 mb-3 flex justify-between items-end">
            <p className="text-3xl text-bold text-color-primary">
              New Collections
            </p>
          </div>
        </div>
        <div className="row items">
          <AliceCarousel
            mouseTracking
            items={getItems()}
            responsive={responsive}
            controlsStrategy="responsive"
            disableButtonsControls={true}
          />
        </div>
      </div>
    </section>
  );
}
