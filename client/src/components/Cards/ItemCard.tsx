import React from "react";
import { Card } from "react-bootstrap";
import CheckIcon from "assets/icons/check.svg";
import "./index.css";

export default function ItemCard({ item }: any) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 flex justify-center item mb-4">
      <Card className="explore-card">
        <Card.Img
          variant="top"
          src={item.image}
          className="aspect-square object-cover card-img"
        />
        <Card.Body className="mt-auto p-0">
          <div className="flex flex-col col-12 px-3 pt-3 pb-0 h-24">
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
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
