import { useRouter } from "next/router";
import React from "react";
import { Tooltip } from "antd";
import { NFT } from "../../../models/exCollection";
import { HorizontalGrid } from "../../../components/HorizontalGrid";
import { NFTCard } from "../../../components/NFTCard";

export const GroupItem = ({
  item,
}: {
  item: { collection: any; nfts: NFT[] };
}) => {
  const router = useRouter();
  return (
    <div className="group-item-container">
      <div className="collection-container">
        <img
          src={item.collection.image}
          className="icon"
          alt={item.collection.symbol}
        />
        {item.collection.symbol && item.collection.symbol !== "undefined" ? (
          <a
            onClick={() =>
              router.push(
                `/marketplace/${
                  item.collection.symbol ? "magiceden" : "papercity"
                }/${item.collection.symbol}`
              )
            }
            className="link"
          >
            {item.collection.name}
          </a>
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
        childrens={item.nfts.map((item, index) => (
          <NFTCard
            key={index}
            item={item}
            itemId={index.toString()}
            collection={item.collectionName}
          />
        ))}
      />
    </div>
  );
};
