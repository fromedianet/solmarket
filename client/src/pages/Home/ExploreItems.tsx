import ExploreCard from "components/Cards/ExploreCard";
import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Item } from "types/itemTypes";
import dummy from "./dummy2.json";
import "./index.css";

export default function ExploreItems() {
  const prepareData = () => {
    let newList: Item[] = [];
    dummy.data.forEach((el) => {
      const item: Item = {
        name: el.name,
        id: el.id,
        image: el.image,
        price: el.price,
        address: el.address,
      };
      newList.push(item);
    });
    return newList;
  };

  const [list, setList] = useState<Item[]>(prepareData());

  return (
    <section className="flex justify-center w-full mt-10">
      <div className="w-full md:w-5/6 2xl:w-4/6 px-4">
        <div className="flex flex-row justify-between items-center">
          <p className="text-4xl text-white mb-2">Explore Items</p>
          <a href="/marketplace" className="text-gray-100">
            <div className="flex flex-row items-center">
              <p>See All</p>
              <MdKeyboardArrowRight size={30} />
            </div>
          </a>
        </div>
        <div className="grid grid-col-1 md:grid-cols-4 gap-2 explore-items">
          {list.map((item, index) => {
            return <ExploreCard item={item} index={index} />;
          })}
        </div>
      </div>
    </section>
  );
}
