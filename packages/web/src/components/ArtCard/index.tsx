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

  image?: string;
  animationURL?: string;

  category?: MetadataCategory;

  name?: string;
  symbol?: string;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className, small, onClose, pubkey, noEvent, ...rest } = props;
  const art = useArt(pubkey);

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
            preview={false}
            pubkey={pubkey}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <div className="card-body">
            <h5>{art.title}</h5>
            <div className="card-collection-name">
              <span>collection_name</span>
              <img src="/icons/check.svg" alt="check" />
            </div>
            {!noEvent && instantSalePrice > 0 && (
              <h5>{`${instantSalePrice} SOL`}</h5>
            )}
          </div>
        </div>
      </>
    );
  };

  const card = (
    <Card
      hoverable={true}
      className={`art-card ${small ? 'small' : ''} ${className ?? ''}`}
      bordered={false}
      // {...rest}
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
        <Link to={`/art/${pubkey}`}>
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
