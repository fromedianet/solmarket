import CollectionCard from "components/Cards/CollectionCard";
import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Collection } from "types/itemTypes";
import dummy from "./dummy.json";
import "./index.css";

export default function PopularCollections() {
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

  return (
    <section className="flex justify-center w-full mt-10">
      <div className="w-full card-section">
        <div className="row">
          <div className="col-12 m-0 mb-3 flex justify-between items-end">
            <p className="text-3xl text-bold text-color-primary mt-3 mb-0">
              Popular Collections
            </p>
            <a href="/marketplace" className="text-base text-color-primary">
              <div className="inline-flex relative items-center ">
                <p>See All</p>
                <MdKeyboardArrowRight size={30} />
              </div>
            </a>
          </div>
        </div>
        <div className="row items popular-collections">
          {list.map((item, index) => {
            return (
              <CollectionCard
                collection={item}
                key={index}
                handleDragStart={handleDragStart}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
