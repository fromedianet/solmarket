import React, { useEffect, useState } from 'react';
import { useMeta } from '../../../contexts';
import { CardLoader } from '../../../components/MyLoader';
import { Banner } from '../../../components/Banner';
import { HowToBuyModal } from '../../../components/HowToBuyModal';
import { HorizontalGrid } from '../../../components/HorizontalGrid';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { HomeCard } from '../../../components/HomeCard';

export const SalesListView = () => {
  const { isLoading } = useMeta();

  const { featuredCollectionsCarousel } = useCollectionsAPI();
  const [featuredCollections, setFeaturedCollections] = useState({});

  useEffect(() => {
    featuredCollectionsCarousel()
      // @ts-ignore
      .then((res: {}) => {
        if ('data' in res) {
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
                    <HomeCard
                      key={index}
                      item={item}
                      link={`/launchpad/${item['symbol']}`}
                    />
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
    </div>
  );
};
