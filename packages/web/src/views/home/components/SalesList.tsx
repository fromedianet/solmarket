import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { useMeta } from '../../../contexts';
import { CardLoader } from '../../../components/MyLoader';
import { Banner } from '../../../components/Banner';
import { HowToBuyModal } from '../../../components/HowToBuyModal';
import { AuctionRenderCard } from '../../../components/AuctionRenderCard';
import { AuctionViewState, useAuctions } from '../../../hooks';
import { HorizontalGrid } from '../../../components/HorizontalGrid';
import { Link } from 'react-router-dom';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { HomeCard } from '../../../components/HomeCard';

export const SalesListView = () => {
  const [auctionStatus, setAuctionStatus] = useState(AuctionViewState.Live);
  const { isLoading } = useMeta();
  const liveAuctions = useAuctions(AuctionViewState.Live);
  const upcomingAuctions = useAuctions(AuctionViewState.Upcoming);
  const endedAuctions = useAuctions(AuctionViewState.Ended);

  const { featuredCollectionsCarousel } = useCollectionsAPI();
  const [featuredCollections, setFeaturedCollections] = useState({});

  useEffect(() => {
    featuredCollectionsCarousel()
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setFeaturedCollections(res['data']);
        }
      });
  }, []);

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
          <span className="section-title">Launchpad Drops</span>
        </div>
        {isLoading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['launchpad-collections'] && (
              <HorizontalGrid
                childrens={featuredCollections['launchpad-collections'].map(
                  (item, index) => (
                    <HomeCard
                      key={index}
                      item={item}
                      link={`/launchpad/${item['symbol']}`}
                      showCountdown={true}
                    />
                  ),
                )}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Upcoming Collections</span>
        </div>
        {isLoading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['upcoming-collections'] && (
              <HorizontalGrid
                childrens={featuredCollections['upcoming-collections'].map(
                  (item, index) => (
                    <HomeCard key={index} item={item} link={`/launchpad/${item['symbol']}`} />
                  ),
                )}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">New Collections</span>
        </div>
        {isLoading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['new-collections'] && (
              <HorizontalGrid
                childrens={featuredCollections['new-collections'].map(
                  (item, index) => (
                    <HomeCard
                      key={index}
                      item={item}
                      link={`/marketplace/${item['symbol']}`}
                    />
                  ),
                )}
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
        {isLoading && [...Array(2)].map((_, idx) => <CardLoader key={idx} />)}
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
