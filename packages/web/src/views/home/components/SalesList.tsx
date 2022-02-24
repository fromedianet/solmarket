import React, { useState } from 'react';
import { Radio } from 'antd';
import { useMeta } from '../../../contexts';
import { CardLoader } from '../../../components/MyLoader';
import { Banner } from '../../../components/Banner';
import { HowToBuyModal } from '../../../components/HowToBuyModal';
import { AuctionRenderCard } from '../../../components/AuctionRenderCard';
import { AuctionViewState, useAuctions } from '../../../hooks';
import { HorizontalGrid } from '../../../components/HorizontalGrid';
import { useCollection } from '../../../hooks/useCollection';
import { Link } from 'react-router-dom';
import { CollectionCard } from '../../../components/CollectionCard';

export const SalesListView = () => {
  const [collectionStatus, setCollectionStatus] = useState('all');
  const [auctionStatus, setAuctionStatus] = useState(AuctionViewState.Live);
  const { isLoading } = useMeta();
  const collections = useCollection();
  const liveAuctions = useAuctions(AuctionViewState.Live);
  const upcomingAuctions = useAuctions(AuctionViewState.Upcoming);
  const endedAuctions = useAuctions(AuctionViewState.Ended);

  return (
    <div className="main-area">
      <Banner
        src="/solana-logo.jpg"
        headingText="The amazing world of Solana NFT."
        subHeadingText="Buy exclusive Solana NFTs."
        actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
        useBannerBg
      />
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Collections</span>
          <Radio.Group
            defaultValue={collectionStatus}
            buttonStyle="solid"
            className="section-radio"
          >
            <Radio.Button
              value="all"
              onClick={() => setCollectionStatus('all')}
            >
              All
            </Radio.Button>
            <Radio.Button
              value="new"
              onClick={() => setCollectionStatus('new')}
            >
              New
            </Radio.Button>
          </Radio.Group>
          <Link
            to={`/collections?type=${collectionStatus}`}
            className="see-all"
          >
            See All
          </Link>
        </div>
        {isLoading ? (
          [...Array(10)].map((_, idx) => <CardLoader key={idx} />)
        ) : (
          <HorizontalGrid
            childrens={collections.map((it, index) => (
              <CollectionCard
                key={index}
                itemId={`${index}`}
                pubkey={it.pubkey}
                className="home-collection"
                preview={false}
              />
            ))}
          />
        )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Auctions</span>
          <Radio.Group
            defaultValue={auctionStatus}
            buttonStyle="solid"
            className="section-radio"
          >
            <Radio.Button
              value={AuctionViewState.Live}
              onClick={() => setAuctionStatus(AuctionViewState.Live)}
            >
              Live
            </Radio.Button>
            <Radio.Button
              value={AuctionViewState.Upcoming}
              onClick={() => setAuctionStatus(AuctionViewState.Upcoming)}
            >
              Upcoming
            </Radio.Button>
            <Radio.Button
              value={AuctionViewState.Ended}
              onClick={() => setAuctionStatus(AuctionViewState.Ended)}
            >
              Ended
            </Radio.Button>
          </Radio.Group>
          <Link to={`/auctions`} className="see-all">
            See All
          </Link>
        </div>
        {isLoading && [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        {!isLoading && auctionStatus === AuctionViewState.Live && (
          <HorizontalGrid
            childrens={liveAuctions.map((auction, index) => (
              <AuctionRenderCard
                key={index}
                auctionView={auction}
                itemId={`${index}`}
                className="home-collection"
              />
            ))}
          />
        )}
        {!isLoading && auctionStatus === AuctionViewState.Upcoming && (
          <HorizontalGrid
            childrens={upcomingAuctions.map((auction, index) => (
              <AuctionRenderCard
                key={index}
                auctionView={auction}
                itemId={`${index}`}
                className="home-collection"
              />
            ))}
          />
        )}
        {!isLoading && auctionStatus === AuctionViewState.Ended && (
          <HorizontalGrid
            childrens={endedAuctions.map((auction, index) => (
              <AuctionRenderCard
                key={index}
                auctionView={auction}
                itemId={`${index}`}
                className="home-collection"
              />
            ))}
          />
        )}
      </div>
    </div>
  );
};
