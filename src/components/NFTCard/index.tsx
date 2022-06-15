import React from "react";
import Link from "next/link";
import { Card } from "antd";

export const NFTCard = (props: {
  item: any;
  collection: string;
  itemId?: string;
  className?: string;
}) => {
  const url = `/item-details/${props.item.market}/${props.item.symbol}/${props.item.mint}`;
  return (
    <Card
      hoverable={true}
      className={`art-card ${props.className}`}
      style={{ maxWidth: 250 }}
      bordered={false}
    >
      <Link href={url}>
        <a>
          <div className="image-over art-image-container">
            <img
              className="art-image no-event"
              src={props.item.image}
              alt={props.item.name}
              title={props.item.name}
              loading="lazy"
            />
          </div>
          <div className="card-caption">
            <span className="card-name">{props.item.name}</span>
            <div className="card-collection-name">
              <span>{props.collection}</span>
              <img src="/icons/check.svg" alt="check" />
            </div>
            {props.item.price > 0 && (
              <span className="card-name">{`${props.item.price} SOL`}</span>
            )}
          </div>
        </a>
      </Link>
    </Card>
  );
};
