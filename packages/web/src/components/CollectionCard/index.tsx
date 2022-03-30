import React from 'react';
import { Card, CardProps } from 'antd';
import { Link } from 'react-router-dom';
import { ArtContent } from '../ArtContent';
import { Collection } from '../../models/collection';

export interface CollectionCardProps extends CardProps {
  collection: Collection;
  itemId?: string;
  className?: string;
}

export const CollectionCard = (props: CollectionCardProps) => {
  const { name, symbol, description, image } = props.collection;

  return (
    <Card
      className={`collection-card ${props.className && props.className}`}
      hoverable={true}
      bordered={false}
    >
      <Link to={`/marketplace/${symbol}`}>
        <div className="image-over image-container">
          <ArtContent
            className="image no-event"
            uri={image}
            preview={false}
            artview={true}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <span className="name">{name}</span>
          {description && <span className="description">{description}</span>}
        </div>
      </Link>
    </Card>
  );
};
