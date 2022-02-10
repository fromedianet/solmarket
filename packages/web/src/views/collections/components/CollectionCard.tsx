import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { useExtendedArt } from '../../../hooks';
import { ArtContent } from '../../../components/ArtContent';
import { StringPublicKey } from '@oyster/common';

export const CollectionCard = (props: { pubkey: StringPublicKey }) => {
  const { ref, data } = useExtendedArt(props.pubkey);

  return (
    <Link ref={ref} to={`/collection/${data?.symbol}`}>
      <Card className="collection-card" hoverable={true} bordered={false}>
        <div className="image-over image-container">
          <ArtContent
            className="image no-event"
            pubkey={props.pubkey}
            uri={data?.image}
            animationURL={data?.animation_url}
            preview={false}
            artview={true}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <h6>{data?.symbol}</h6>
          <span className="description">{data?.description}</span>
        </div>
      </Card>
    </Link>
  );
};
