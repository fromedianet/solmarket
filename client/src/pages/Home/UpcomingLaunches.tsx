import CollectionCard from "components/Cards/CollectionCard";
import React, { useState } from "react";
import { Collection } from "types/collection";
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
    <section className="flex justify-center w-full my-10">
      <div className="w-full md:w-5/6 2xl:w-4/6 px-4">
        <p className="text-4xl text-white">Upcoming Launches</p>
        <div className="grid grid-col-1 md:grid-cols-3 gap-2 mt-4">
          {list.map((item, index) => {
            return <CollectionCard collection={item} index={index} />;
          })}
        </div>
      </div>
    </section>
  );
}
