import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { Link } from 'react-router-dom';
import { CardLoader } from '../../components/MyLoader';
import { HorizontalGrid } from '../../components/HorizontalGrid';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { HomeCard } from '../../components/HomeCard';
import { useExCollectionsAPI } from '../../hooks/useExCollections';
import { MarketType } from '../../constants';
import { ExCollection } from '../../models/exCollection';
import { CarouselView } from './components/carousel';

export const SalesListView = () => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState({
    launchpad: [],
    upcoming: [],
    popular1: [],
    popular7: [],
    popular30: [],
    new: [],
  });
  const [carouselData, setCarouselData] = useState<ExCollection[]>([]);
  const [popularStatus, setPopularStatus] = useState('7d');
  const { featuredCollectionsCarousel } = useCollectionsAPI();
  const { getPopularCollections, getNewCollections } = useExCollectionsAPI();

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    loadAllData()
      .then((res: any) => {
        setCollections(res);
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

    const data: ExCollection[] = [];
    if (result['launchpad'].length > 0) {
      data.push({
        ...result['launchpad'][0],
        type: 'launchpad',
      });
    }

    if (result['new'].length > 0) {
      data.push({
        ...result['new'][0],
        type: 'collection',
      });
    }

    if (result['popular7'].length > 0) {
      data.push({
        ...result['popular7'][0],
        type: 'collection',
      });
    }

    setCarouselData(data);

    return result;
  }

  return (
    <div className="main-area">
      {loading ? <CardLoader /> : <CarouselView data={carouselData} />}
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Launchpad Drops</span>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : collections['launchpad'] && (
              <HorizontalGrid
                childrens={collections['launchpad'].map((item, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={item['_id']}
                    link={`/launchpad/${item['symbol']}`}
                    showCountdown={true}
                  />
                ))}
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
          <Link to="/collections?type=popular" className="see-all">
            See All
          </Link>
        </div>
        {loading ? (
          [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
        ) : popularStatus === '1d' ? (
          <HorizontalGrid
            childrens={collections['popular1'].map((item, index) => (
              <HomeCard
                key={index}
                item={item}
                itemId={item['_id']}
                link={
                  item['market']
                    ? `/excollection/${item['symbol']}?market=${item['market']}`
                    : `/marketplace/${item['symbol']}`
                }
              />
            ))}
          />
        ) : popularStatus === '7d' ? (
          <HorizontalGrid
            childrens={collections['popular7'].map((item, index) => (
              <HomeCard
                key={index}
                item={item}
                itemId={item['_id']}
                link={
                  item['market']
                    ? `/excollection/${item['symbol']}?market=${item['market']}`
                    : `/marketplace/${item['symbol']}`
                }
              />
            ))}
          />
        ) : (
          <HorizontalGrid
            childrens={collections['popular30'].map((item, index) => (
              <HomeCard
                key={index}
                item={item}
                itemId={item['_id']}
                link={
                  item['market']
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
          : collections['upcoming'] && (
              <HorizontalGrid
                childrens={collections['upcoming'].map((item, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={item['_id']}
                    link={`/launchpad/${item['symbol']}`}
                  />
                ))}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">New Collections</span>
          <Link to="/collections?type=new" className="see-all">
            See All
          </Link>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : collections['new'] && (
              <HorizontalGrid
                childrens={collections['new'].map((item, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={item['_id']}
                    link={
                      item['market']
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
