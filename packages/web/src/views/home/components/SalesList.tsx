import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { Link } from 'react-router-dom';
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
  const [featuredCollections, setFeaturedCollections] = useState({
    launchpad: [],
    upcoming: [],
    popular1: [],
    popular7: [],
    popular30: [],
    new: [],
  });
  const [popularStatus, setPopularStatus] = useState('7d');
  const { featuredCollectionsCarousel } = useCollectionsAPI();
  const { getPopularCollections, getNewCollections } = useExCollectionsAPI();

  useEffect(() => {
    setLoading(true);
    loadAllData()
      .then((res: any) => {
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
                      itemId={item['_id']}
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
          <Radio.Group
            defaultValue={popularStatus}
            buttonStyle="solid"
            className="section-radio"
          >
            <Radio.Button value="1d" onClick={() => setPopularStatus('1d')}>
              24 hours
            </Radio.Button>
            <Radio.Button value="7d" onClick={() => setPopularStatus('7d')}>
              7 days
            </Radio.Button>
            <Radio.Button value="30d" onClick={() => setPopularStatus('30d')}>
              30 days
            </Radio.Button>
          </Radio.Group>
          <Link to={`/collections/popular`} className="see-all">
            See All
          </Link>
        </div>
        {loading ? (
          [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
        ) : popularStatus === '1d' ? (
          <HorizontalGrid
            childrens={featuredCollections['popular1'].map((item, index) => (
              <HomeCard
                key={index}
                item={item}
                itemId={item['_id']}
                link={
                  item['market'] === MarketType.MagicEden
                    ? `/excollection/${item['symbol']}?market=${item['market']}`
                    : `/marketplace/${item['symbol']}`
                }
              />
            ))}
          />
        ) : popularStatus === '7d' ? (
          <HorizontalGrid
            childrens={featuredCollections['popular7'].map((item, index) => (
              <HomeCard
                key={index}
                item={item}
                itemId={item['_id']}
                link={
                  item['market'] === MarketType.MagicEden
                    ? `/excollection/${item['symbol']}?market=${item['market']}`
                    : `/marketplace/${item['symbol']}`
                }
              />
            ))}
          />
        ) : (
          <HorizontalGrid
            childrens={featuredCollections['popular30'].map((item, index) => (
              <HomeCard
                key={index}
                item={item}
                itemId={item['_id']}
                link={
                  item['market'] === MarketType.MagicEden
                    ? `/excollection/${item['symbol']}?market=${item['market']}`
                    : `/marketplace/${item['symbol']}`
                }
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
                      itemId={item['_id']}
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
                    itemId={item['_id']}
                    link={
                      item['market'] === MarketType.MagicEden
                        ? `/excollection/${item['symbol']}?market=${item['market']}`
                        : `/marketplace/${item['symbol']}`
                    }
                  />
                ))}
              />
            )}
      </div>
    </div>
  );
};
