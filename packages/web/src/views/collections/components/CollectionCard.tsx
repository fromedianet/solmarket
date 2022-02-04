import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { useExtendedArt } from '../../../hooks';
import { ArtContent } from '../../../components/ArtContent';
import { StringPublicKey } from '@oyster/common';

export const CollectionCard = (props: {
  pubkey: StringPublicKey
}) => {
  const art = useExtendedArt(props.pubkey);

  return (
    <Link to={`/collection/${art.data?.symbol}`}>
      <Card
        className='collection-card'
        hoverable={true}
        bordered={false}
      >
        <div className="image-over image-container">
          <ArtContent
            className="image no-event"
            pubkey={props.pubkey}
            uri={art.data?.image}
            animationURL={art.data?.animation_url}
            preview={false}
            artview={true}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <h5>{art.data?.name}</h5>
          <span className='description'>{art.data?.description}</span>
        </div>
      </Card>
    </Link>
  );
};
