import React from "react";
import { Card } from "react-bootstrap";
import CheckIcon from "assets/icons/check.svg";
import "./index.css";

export default function ExploreCard({ item, index }: any) {
  return (
    <Card className="explore-card" key={index}>
      <Card.Img
        variant="top"
        src={item.image}
        className="aspect-square object-cover card-img"
      />
      <Card.Body className="p-2">
        <a href={`item-details/${item.address}`}>
          <span className="text-gray-100 text-base text">{`${item.name} ${item.id}`}</span>
        </a>
        <a
          href={`/marketplace/${item.key}`}
          className="flex flex-row items-center"
        >
          <span className="text-purple-600 text-xs font-bold mr-1">
            {item.name}
          </span>
          <span>
            <img loading="lazy" src={CheckIcon} alt="check" />
          </span>
        </a>
        <Card.Text className="text-gray-100 text-base text">
          {item.price} SOL
        </Card.Text>
        <div className="flex flex-row justify-between border-t border-gray-800 py-1 mt-1">
          <button className="bg-gray-700 hover:bg-purple-600 rounded-lg text-gray-100 px-3 py-2">
            Make offer
          </button>
          <button className="border border-violet-800 hover:bg-purple-600 rounded-lg text-gray-100 px-3 py-2">
            Buy now
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}
