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
      <div className="w-full md:w-5/6 2xl:w-4/6 px-4">
        <div className="flex flex-row justify-between items-center">
          <p className="text-4xl text-white mb-2">Popular Connections</p>
          <a href="/marketplace" className="text-gray-100">
            <div className="flex flex-row items-center">
              <p>See All</p>
              <MdKeyboardArrowRight size={30} />
            </div>
          </a>
        </div>
        <div className="grid grid-col-1 md:grid-cols-4 gap-2 popular-collections">
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
