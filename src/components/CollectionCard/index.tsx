import React from "react";
import { Card, CardProps } from "antd";
import { useRouter } from "next/router";
import { ExCollection } from "../../models/exCollection";

export interface CollectionCardProps extends CardProps {
  item: ExCollection;
  itemId?: string;
  className?: string;
  link: string;
}

export const CollectionCard = (props: CollectionCardProps) => {
  const { name, description, image } = props.item;
  const router = useRouter();

  return (
    <Card className="collection-card" hoverable={true} bordered={false}>
      <a onClick={() => router.push(props.link)}>
        <>
          <div className="image-over image-container">
            <img
              src={image}
              className="image no-event"
              alt={name}
              title={name}
              loading="lazy"
            />
          </div>
          <div className="card-caption">
            <span className="name">{name}</span>
            {description && <span className="description">{description}</span>}
          </div>
        </>
      </a>
    </Card>
  );
};
