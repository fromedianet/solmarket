import { Col, Row } from 'antd';
import React from 'react';

import { useMeta } from '../../contexts';
import { CardLoader } from '../../components/MyLoader';
import { Banner } from '../../components/Banner';
import { HowToBuyModal } from '../../components/HowToBuyModal';

import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { useAuctionsList } from '../home/components/SalesList/hooks/useAuctionsList';

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
  Own = '4',
}

export const AuctionsView = () => {
  const { isLoading } = useMeta();
  const liveAuctions = useAuctionsList(LiveAuctionViewState.All);
  const endedAuctions = useAuctionsList(LiveAuctionViewState.Ended);

  return (
    <div className="main-area">
      <Banner
        src="/main-banner.svg"
        headingText="The amazing world of Metaplex."
        subHeadingText="Buy exclusive Metaplex NFTs."
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
