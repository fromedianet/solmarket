import React, { useEffect, useState } from 'react';
import { CardLoader } from '../../../components/MyLoader';
import { Banner } from '../../../components/Banner';
import { HowToBuyModal } from '../../../components/HowToBuyModal';
import { HorizontalGrid } from '../../../components/HorizontalGrid';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { HomeCard } from '../../../components/HomeCard';
import { useExCollectionsAPI } from '../../../hooks/useExCollections';
import { MarketType } from '../../../constants';
import { ExCollection } from '../../../models/exCollection';

export const SalesListView = () => {
  const [loading, setLoading] = useState(false);
  const [featuredCollections, setFeaturedCollections] = useState({});

  const { featuredCollectionsCarousel } = useCollectionsAPI();
  const { getPopularCollections, getNewCollections } = useExCollectionsAPI();

  useEffect(() => {
    setLoading(true);
    loadAllData()
      .then(res => {
        setFeaturedCollections(res);
      })
      .finally(() => setLoading(false));
  }, []);

  async function loadAllData() {
    const result = {};
    // Own marketplace
    const featuredData = await featuredCollectionsCarousel();

    // MagicEden
    const popular1 = await getPopularCollections({
      market: MarketType.MagicEden,
      timeRange: '1d',
    });
    const popular7 = await getPopularCollections({
      market: MarketType.MagicEden,
      timeRange: '7d',
    });
    const popular30 = await getPopularCollections({
      market: MarketType.MagicEden,
      timeRange: '30d',
    });
    const exNews = await getNewCollections({ market: MarketType.MagicEden });

    result['launchpad'] = featuredData['launchpad'] || [];
    result['upcoming'] = featuredData['upcoming'] || [];
    let newData: ExCollection[] = featuredData['new'] || [];
    newData = newData.concat(exNews);
    result['new'] = newData;
    result['popular1'] = popular1;
    result['popular7'] = popular7;
    result['popular30'] = popular30;

    return result;
  }

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
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['launchpad'] && (
              <HorizontalGrid
                childrens={featuredCollections['launchpad'].map(
                  (item, index) => (
                    <HomeCard
                      key={index}
                      item={item}
                      itemId={index}
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
          <span className="section-title">Popular Collections</span>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['new'] && (
              <HorizontalGrid
                childrens={featuredCollections['new'].map((item, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={index}
                    link={`/marketplace/${item['symbol']}`}
                  />
                ))}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Upcoming Launches</span>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['upcoming'] && (
              <HorizontalGrid
                childrens={featuredCollections['upcoming'].map(
                  (item, index) => (
                    <HomeCard
                      key={index}
                      item={item}
                      itemId={index}
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
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : featuredCollections['new'] && (
              <HorizontalGrid
                childrens={featuredCollections['new'].map((item, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={index}
                    link={`/marketplace/${item['symbol']}`}
                  />
                ))}
              />
            )}
      </div>
    </div>
  );
};
