import Link from "next/link";
import React, { lazy } from "react";
import { Tooltip } from "antd";
import { NFT } from "../../../models/exCollection";
import { HorizontalGrid } from "../../../components/HorizontalGrid";

const NFTCard = lazy(() => import("../../../components/NFTCard"));

const GroupItem = ({ item }: { item: { collection: any; nfts: NFT[] } }) => {
  return (
    <div className="group-item-container">
      <div className="collection-container">
        <img
          src={item.collection.image}
          className="icon image-placeholder"
          alt={item.collection.symbol}
        />
        {item.collection.symbol && item.collection.symbol !== "undefined" ? (
          <Link
            href={`/marketplace/${
              item.collection.symbol ? "magiceden" : "papercity"
            }/${item.collection.symbol}`}
          >
            <a className="link">{item.collection.name}</a>
          </Link>
        ) : (
          <span className="link">{item.collection.name}</span>
        )}

        <Tooltip title="Floor price" className="tooltip">
          <span>{`FLOOR: ${
            item.collection.floorPrice === 0 ? "--" : item.collection.floorPrice
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
              ? "--"
              : item.collection.totalFloorPrice
          } SOL`}</span>
        </Tooltip>
      </div>
      <HorizontalGrid
        childrens={item.nfts.map((item) => (
          <NFTCard
            key={item.mint}
            item={item}
            itemId={item.mint}
            collection={item.collectionName}
          />
        ))}
      />
    </div>
  );
};

export default React.memo(GroupItem);
