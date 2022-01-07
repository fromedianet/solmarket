import React from "react";
import { Card } from "react-bootstrap";
import CheckIcon from "assets/icons/check.svg";
import "./index.css";

export default function ItemCard({ item }: any) {
  return (
    <Card className="card explore-card">
      <Card.Img
        variant="top"
        src={item.image}
        className="aspect-square object-cover card-img"
      />
      <Card.Body className="p-2">
        <a href={`item-details/${item.address}`}>
          <span className="text-color-primary text-base line-clamp-1">{`${item.name} ${item.id}`}</span>
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
        <Card.Text className="text-color-primary text-base">
          {item.price} SOL
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
