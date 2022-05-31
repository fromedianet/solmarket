import React, { useMemo } from 'react';
import { Card, CardProps, Badge } from 'antd';
import { MetadataCategory, StringPublicKey } from '@oyster/common';
import { ArtContent } from '../ArtContent';
import { AuctionView, useArt, useAuctions } from '../../hooks';
import { Artist } from '../../types';
import { Link } from 'react-router-dom';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

export interface ArtCardProps extends CardProps {
  pubkey?: StringPublicKey;
  collectionPubKey?: StringPublicKey;
  image?: string;
  animationURL?: string;

  category?: MetadataCategory;

  name?: string;
  symbol?: string | undefined;
  description?: string;
  creators?: Artist[];
  preview?: boolean;
  small?: boolean;
  onClose?: () => void;
  noEvent?: boolean;

  height?: number;
  artview?: boolean;
  width?: number;

  count?: string;
}

export const ArtCard = (props: ArtCardProps) => {
  const {
    className,
    small,
    category,
    image,
    animationURL,
    name,
    symbol,
    preview,
    // creators,
    // description,
    onClose,
    pubkey,
    collectionPubKey,
    height,
    artview,
    width,
    // count,
    noEvent,
    ...rest
  } = props;
  const art = useArt(pubkey || '');
  const cPubKey = art?.collection || collectionPubKey;
  let collectionName;
  if (cPubKey) {
    const collection = useArt(cPubKey);
    collectionName = collection.title;
  }
  // const artCreators = art?.creators || creators || [];
  const artName = art?.title || name || ' ';

  let auctionView: AuctionView | undefined;
  const auctions = useAuctions();
  const filters = auctions.filter(
    item => item.thumbnail.metadata.pubkey === pubkey,
  );
  if (filters.length > 0) {
    auctionView = filters[0];
  }

  const instantSalePrice = useMemo(
    () =>
      (auctionView?.auction?.info.priceFloor.minPrice || new BN(0)).toNumber() /
      LAMPORTS_PER_SOL,
    [auctionView?.auction],
  );

  const CardContent = () => {
    return (
      <>
        <div className="image-over art-image-container">
          <ArtContent
            className="art-image no-event"
            pubkey={pubkey}
            uri={image}
            animationURL={animationURL}
            category={category}
            preview={preview}
            height={height}
            width={width}
            artview={artview}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <h6>{artName}</h6>
          <div className="card-collection-name">
            <span>{collectionName || symbol}</span>
            <img src="/icons/check.svg" alt="check" />
          </div>
          {!noEvent && instantSalePrice > 0 && (
            <h6>{`${instantSalePrice} SOL`}</h6>
          )}
        </div>
      </>
    );
  };

  const card = (
    <Card
      hoverable={true}
      className={`art-card ${small ? 'small' : ''} ${className ?? ''}`}
      bordered={false}
      {...rest}
    >
      {onClose && (
        <button
          className="card-close-button"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onClose && onClose();
          }}
        >
          X
        </button>
      )}
      {noEvent ? (
        <CardContent />
      ) : (
        <Link to={`/item-details/papercity/${collectionName}/${pubkey}`}>
          <CardContent />
        </Link>
      )}
    </Card>
  );

  return art.creators?.find(c => !c.verified) ? (
    <Badge.Ribbon text="Unverified">{card}</Badge.Ribbon>
  ) : (
    card
  );
};
