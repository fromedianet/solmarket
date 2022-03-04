import React from 'react';
import { Card } from 'antd';
import { ArtContent } from '../../components/ArtContent';
import { ExCollection } from '../../models/exCollection';
import { Link } from 'react-router-dom';

export const ExCollectionCard = (props: { item: ExCollection }) => {
  return (
    <Link
      to={`/excollection/${encodeURIComponent(props.item.symbol)}?market=${
        props.item.market
      }`}
    >
      <Card className={`collection-card`} hoverable={true} bordered={false}>
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
          <h6>{props.item.name}</h6>
        </div>
      </Card>
    </Link>
  );
};
