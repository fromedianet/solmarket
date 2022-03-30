import React from 'react';
import { Card } from 'antd';
import { ArtContent } from '../../components/ArtContent';
import { ExCollection } from '../../models/exCollection';
import { Link } from 'react-router-dom';

export const ExCollectionCard = (props: { item: ExCollection }) => {
  return (
    <Card className={`collection-card`} hoverable={true} bordered={false}>
      <Link
        to={`/excollection/${encodeURIComponent(props.item.symbol)}?market=${
          props.item.market
        }`}
      >
        <div className="image-over image-container">
          <ArtContent
            className="image no-event"
            uri={props.item.thumbnail}
            preview={false}
            artview={true}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <span className='name'>{props.item.name}</span>
          {props.item.description && (
            <span className='description'>{props.item.description}</span>
          )}
        </div>
      </Link>
    </Card>
  );
};
