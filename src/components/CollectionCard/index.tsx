import React from "react";
import { Card, CardProps } from "antd";
import Link from "next/link";
import { ExCollection } from "../../models/exCollection";

export interface CollectionCardProps extends CardProps {
  item: ExCollection;
  itemId?: string;
  className?: string;
  link: string;
}

const CollectionCard = (props: CollectionCardProps) => {
  const { name, description, image } = props.item;

  return (
    <Card className="collection-card" hoverable={true} bordered={false}>
      <Link href={props.link}>
        <a>
          <div className="image-over image-container">
            <img
              src={image}
              className="image no-event image-placeholder"
              alt={name}
              title={name}
            />
          </div>
          <div className="card-caption">
            <span className="name">{name}</span>
            {description && <span className="description">{description}</span>}
          </div>
        </a>
      </Link>
    </Card>
  );
};

export default React.memo(CollectionCard);
