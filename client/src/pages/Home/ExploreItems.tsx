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
      <div className="w-full card-section">
        <div className="row">
          <div className="col-12 m-0 mb-3 flex justify-between items-end">
            <p className="text-3xl text-bold text-color-primary mt-3 mb-0">
              Explore Items
            </p>
            <a href="/marketplace" className="text-base text-color-primary">
              <div className="inline-flex relative items-center ">
                <p>See All</p>
                <MdKeyboardArrowRight size={30} />
              </div>
            </a>
          </div>
        </div>
        <div className="row items explore-items">
          {list.map((item, index) => {
            return <ExploreCard item={item} key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}
