import { Col, Row } from 'antd';
import React from 'react';

import { useMeta } from '../../../contexts';
import { CardLoader } from '../../../components/MyLoader';
import { Banner } from '../../../components/Banner';
import { HowToBuyModal } from '../../../components/HowToBuyModal';

import { AuctionRenderCard } from '../../../components/AuctionRenderCard';
import { AuctionViewState, useAuctions } from '../../../hooks';
import { HorizontalGrid } from '../../../components/HorizontalGrid';
import { useCollection } from '../../../hooks/useCollection';
import { CollectionCard } from '../../collections/components/CollectionCard';

export const SalesListView = () => {
  const { isLoading } = useMeta();
  const collections = useCollection();
  const liveAuctions = useAuctions(AuctionViewState.Live);
  const endedAuctions = useAuctions(AuctionViewState.Ended);

  const items = collections.map((it, index) => {
    return (
      <CollectionCard
        key={index}
        itemId={`${index}`}
        pubkey={it.pubkey}
        className="home-collection"
      />
    );
  });

  return (
    <div className="main-area">
      <Banner
        src="/solana-logo.jpg"
        headingText="The amazing world of Solana NFT."
        subHeadingText="Buy exclusive Solana NFTs."
        actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
        useBannerBg
      />
      <div className="auction-section">
        <span className="auction-title">Popular Collections</span>
        <HorizontalGrid childrens={items} />
      </div>
      <div className="auction-section">
        <span className="auction-title">Live Auctions</span>
        <Row style={{ width: '100%' }} gutter={[16, 16]}>
          {isLoading &&
            [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
          {!isLoading &&
            liveAuctions.map(auction => (
              <Col key={auction.auction.pubkey} span={12} md={8} xl={6} xxl={4}>
                <AuctionRenderCard auctionView={auction} />
              </Col>
            ))}
        </Row>
      </div>
      <div className="auction-section">
        <span className="auction-title">Finished Auctions</span>
        <Row style={{ width: '100%' }} gutter={[16, 16]}>
          {isLoading &&
            [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
          {!isLoading &&
            endedAuctions.map(auction => (
              <Col key={auction.auction.pubkey} span={12} md={8} xl={6} xxl={4}>
                <AuctionRenderCard auctionView={auction} />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};
