import React from "react";
import { Card } from "antd";
import { useRouter } from "next/router";
import { ArtContent } from "../ArtContent";

export const NFTCard = (props: {
  item: any;
  collection: string;
  itemId?: string;
  className?: string;
}) => {
  const router = useRouter();
  const url = `/item-details/${props.item.market}/${props.item.symbol}/${props.item.mint}`;
  return (
    <Card
      hoverable={true}
      className={`art-card ${props.className}`}
      style={{ maxWidth: 250 }}
      bordered={false}
    >
      <a onClick={() => router.push(url)}>
        <>
          <div className="image-over art-image-container">
            <ArtContent
              className="art-image no-event"
              uri={props.item.image}
              preview={false}
              artview={true}
              allowMeshRender={false}
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
        </>
      </a>
    </Card>
  );
};
