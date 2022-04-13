import { Col, Row } from 'antd';
import React from 'react';
import { CardLoader } from '../../components/MyLoader';
import { AuctionViewState, useAuctions } from '../../hooks';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { useMeta } from '@oyster/common';

export const AuctionsView = () => {
  const { isLoading } = useMeta();
  const liveAuctions = useAuctions(AuctionViewState.Live);
  const upcomingAuctions = useAuctions(AuctionViewState.Upcoming);
  const endedAuctions = useAuctions(AuctionViewState.Ended);

  return (
    <div className="main-area">
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
        <span className="auction-title">Upcoming Auctions</span>
        <Row style={{ width: '100%' }} gutter={[16, 16]}>
          {isLoading &&
            [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
          {!isLoading &&
            upcomingAuctions.map(auction => (
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
