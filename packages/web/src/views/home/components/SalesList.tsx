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

  const popularCollectionItems = collections.map((it, index) =>
    <CollectionCard
      key={index}
      itemId={`${index}`}
      pubkey={it.pubkey}
      className="home-collection"
    />
  );

  const liveAuctionItems = liveAuctions.map((auction, index) =>
    <AuctionRenderCard
      key={index}
      auctionView={auction}
      itemId={`${index}`}
      className="home-collection"
    />
  );

  const endedAuctionItems = endedAuctions.map((auction, index) =>
    <AuctionRenderCard
      key={index}
      auctionView={auction}
      itemId={`${index}`}
      className="home-collection"
    />
  )

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
        <HorizontalGrid childrens={popularCollectionItems} />
      </div>
      <div className="auction-section">
        <span className="auction-title">Live Auctions</span>
        {isLoading &&
          [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        {!isLoading &&
          <HorizontalGrid childrens={liveAuctionItems} />
        }
      </div>
      <div className="auction-section">
        <span className="auction-title">Finished Auctions</span>
        {isLoading &&
          [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        {!isLoading &&
          <HorizontalGrid childrens={endedAuctionItems} />  
        }
      </div>
    </div>
  );
};
