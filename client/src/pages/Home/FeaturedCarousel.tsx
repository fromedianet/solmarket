import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Collection } from "types/collection";
import dummy from "./dummy.json";
import "./index.css";

export default function FeaturedCarousel() {
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
    <section className="w-full overflow-hidden">
      <Carousel className="w-full" prevIcon={null} nextIcon={null}>
        {list.map((item, index) => {
          return (
            <Carousel.Item key={index}>
              <img
                className="object-cover w-full carousel-img"
                src={item.image}
                alt={item.name}
              />
              <Carousel.Caption className="text-left">
                <p className="text-3xl md:text-6xl font-bold mb-3">
                  {item.name}
                </p>
                <p className="text-sm md:text-xl mb-3">{item.description}</p>
                <a
                  className="border-1 border-white bg-transparent hover:bg-purple-700 rounded-full mb-3 px-4 py-3"
                  href={item.link}
                >
                  {item.type === "explore"
                    ? "Explore Collections"
                    : "Play a bid"}
                </a>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </section>
  );
}
