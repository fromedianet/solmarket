import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { HorizontalGrid } from '../../../components/HorizontalGrid';
import { NFT } from '../../../models/exCollection';
import { groupBy } from '../../../utils/utils';
import { ProfileCard } from './profileCard';
import { NFTCard } from '../../marketplace/components/Items';

export const ListedItems = ({ items }: { items: NFT[] }) => {
  const [groupNFTs, setGroupNFTs] = useState<Map<string, NFT[]>>(new Map());
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>();

  useEffect(() => {
    const grouped: Map<string, NFT[]> = groupBy(items, item => item.symbol);
    const data: any[] = [];
    grouped.forEach(items => {
      const collection = {
        symbol: items[0].symbol,
        name: items[0].collectionName,
        image: items[0].image,
        items: items.length,
        volume: items.reduce((prev, current) => prev + current.price, 0),
      };
      data.push(collection);
    });
    setGroupNFTs(grouped);
    setCollections(data);
  }, [items]);

  const handleSelect = (symbol: string) => {
    console.log(symbol);
    console.log(groupNFTs.get(symbol));
    setSelectedSymbol(symbol);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2>Collections</h2>
      <HorizontalGrid
        childrens={collections.map((item, index) => (
          <ProfileCard
            key={index}
            item={item}
            itemId={item.symbol}
            onSelect={handleSelect}
          />
        ))}
      />
      {selectedSymbol && groupNFTs.get(selectedSymbol) && (
        <>
          <h2>{`${selectedSymbol} NFTs`}</h2>
          <Row gutter={[16, 16]}>
            {groupNFTs.get(selectedSymbol)!.map((item, index) => (
              <Col key={index} span={12} md={8} lg={6} xl={4}>
                <NFTCard item={item} collection={item.collectionName} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};
