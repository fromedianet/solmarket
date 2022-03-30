import React from 'react';
import { Card, CardProps } from 'antd';
import { Link } from 'react-router-dom';
import { ArtContent } from '../ArtContent';
import { ExCollection } from '../../models/exCollection';

export interface CollectionCardProps extends CardProps {
  item: ExCollection;
  itemId?: string;
  className?: string;
  link: string;
}

export const CollectionCard = (props: CollectionCardProps) => {
  const { name, description, thumbnail } = props.item;

  return (
    <Card
      className='collection-card'
      hoverable={true}
      bordered={false}
    >
      <Link to={props.link}>
        <div className="image-over image-container">
          <ArtContent
            className="image no-event"
            uri={thumbnail}
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
