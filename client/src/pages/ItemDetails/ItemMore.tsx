import ItemCard from "components/Cards/ItemCard";
import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { FiCompass } from "react-icons/fi";
import { Item } from "types/itemTypes";
import dummy from "./dummy.json";

export default function ItemMore() {
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
    <div className="row">
      <div className="col-12">
        <Accordion defaultActiveKey="0" className="mt-2">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="text-color-third">
              <span className="mr-2 text-color-pink">
                <FiCompass size={24} />
              </span>
              <span className="text-base text-color-primary">
                More from this collection
              </span>
            </Accordion.Header>
            <AccordionBody className="tw-accordion-body">
              <div className="p-3 overflow-x-auto row flex-nowrap more-from-collection-row dark-scroll-bar">
                {list.map((item, index) => {
                  return <ItemCard item={item} key={index} />;
                })}
              </div>
            </AccordionBody>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
