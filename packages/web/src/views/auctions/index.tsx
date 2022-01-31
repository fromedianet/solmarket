import { Col, Row } from 'antd';
import React from 'react';

import { useMeta } from '../../contexts';
import { CardLoader } from '../../components/MyLoader';
import { Banner } from '../../components/Banner';
import { HowToBuyModal } from '../../components/HowToBuyModal';
import { AuctionViewState, useAuctionsList } from '../../hooks';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';

export const AuctionsView = () => {
  const { isLoading } = useMeta();
  const liveAuctions = useAuctionsList(AuctionViewState.Live);
  const upcomingAuctions = useAuctionsList(AuctionViewState.Upcoming);
  const endedAuctions = useAuctionsList(AuctionViewState.Ended);

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
        <span className="auction-title">Live Auctions</span>
        <Row style={{ width: '100%' }} gutter={[16, 16]}>
          {isLoading &&
            [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
          {!isLoading &&
            liveAuctions.auctions.map(auction => (
              <Col key={auction.auction.pubkey} span={12} md={8} xl={6} xxl={4}>
                <AuctionRenderCard auctionView={auction} />
              </Col>
            ))}
        </Row>
      </div>
      <div className="auction-section">
        <span className="auction-title">Upcoming Auctions</span>
        <Row style={{ width: '100%' }} gutter={[16, 16]}>
          {isLoading &&
            [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
          {!isLoading &&
            upcomingAuctions.auctions.map(auction => (
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
            endedAuctions.auctions.map(auction => (
              <Col key={auction.auction.pubkey} span={12} md={8} xl={6} xxl={4}>
                <AuctionRenderCard auctionView={auction} />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};
