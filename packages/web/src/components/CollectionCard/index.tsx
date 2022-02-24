import React from 'react';
import { Card, CardProps } from 'antd';
import { Link } from 'react-router-dom';
import { MetadataCategory, StringPublicKey } from '@oyster/common';
import { useArt } from '../../hooks';
import { ArtContent } from '../ArtContent';

export interface CollectionCardProps extends CardProps {
  pubkey?: StringPublicKey;
  image?: string;
  animationURL?: string;
  category?: MetadataCategory;
  name?: string;
  symbol?: string | undefined;
  description?: string;
  preview?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  noEvent?: boolean;
  height?: number;
  width?: number;
  className?: string;
  itemId?: string;
}

export const CollectionCard = (props: CollectionCardProps) => {
  const {
    pubkey,
    image,
    animationURL,
    category,
    name,
    symbol,
    description,
    preview,
    height,
    width,
    noEvent,
    onClose,
    onClick,
    className
  } = props;
  const collection = useArt(pubkey);

  const cName = collection.title || name;

  const CardContent = () => {
    return (
      <>
        <div className="image-over image-container">
          <ArtContent
            className="image no-event"
            pubkey={pubkey}
            uri={image}
            animationURL={animationURL}
            category={category}
            preview={preview}
            artview={true}
            allowMeshRender={false}
            width={width}
            height={height}
          />
        </div>
        <div className="card-caption">
          <h6>{cName}</h6>
          {symbol && <span className="symbol">{symbol}</span>}
          {description && <span className="description">{description}</span>}
        </div>
      </>
    )
  }

  return (
    <Card
      className={`collection-card ${className && className}`}
      hoverable={true}
      bordered={false}
      onClick={onClick}
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
        <Link to={`/collection/${pubkey}`}>
          <CardContent />
        </Link>
      )}
    </Card>
  );
};
