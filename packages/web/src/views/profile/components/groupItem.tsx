import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { NFT } from '../../../models/exCollection';
import { NFTCard } from '../../marketplace/components/Items';
import { HorizontalGrid } from '../../../components/HorizontalGrid';

export const GroupItem = ({
  item,
}: {
  item: { collection: any; nfts: NFT[] };
}) => {
  return (
    <div className="group-item-container">
      <div className="collection-container">
        <img
          src={item.collection.image}
          className="icon"
          alt={item.collection.symbol}
        />
        {item.collection.symbol && item.collection.symbol !== 'undefined' ? (
          <Link className="link" to={`/marketplace/${item.collection.symbol ? '2' : '1'}/${item.collection.symbol}`}>
            {item.collection.name}
          </Link>
        ) : (
          <span className="link">{item.collection.name}</span>
        )}

        <Tooltip title="Floor price" className="tooltip">
          <span>{`FLOOR: ${
            item.collection.floorPrice === 0 ? '--' : item.collection.floorPrice
          } SOL`}</span>
        </Tooltip>
        <Tooltip title="Number of NFTs" className="tooltip">
          <span>{`ITEMS: ${item.collection.items}`}</span>
        </Tooltip>
        <Tooltip
          title="This is rough estimate using floor price times number of nfts"
          className="tooltip"
        >
          <span>{`TOTAL FLOOR VALUE: ${
            item.collection.totalFloorPrice === 0
              ? '--'
              : item.collection.totalFloorPrice
          } SOL`}</span>
        </Tooltip>
      </div>
      <HorizontalGrid
        childrens={item.nfts.map((item, index) => (
          <NFTCard
            key={index}
            item={item}
            itemId={index.toString()}
            market={item.market}
            collection={item.collectionName}
          />
        ))}
      />
    </div>
  );
};
