import UpcomingCard from "components/Cards/UpcomingCard";
import React, { useState } from "react";
import { Collection } from "types/itemTypes";
import dummy from "./dummy.json";

export default function UpcomingLaunches() {
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

  return (
    <section className="flex justify-center w-full mt-3">
      <div className="w-full card-section">
        <div className="row">
          <div className="col-12 m-0 mb-3 flex justify-between items-end">
            <p className="text-3xl text-bold text-color-primary mt-3 mb-0">
              Upcoming Launches
            </p>
          </div>
        </div>
        <div className="row items">
          {list.map((item, index) => {
            return <UpcomingCard collection={item} key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}
