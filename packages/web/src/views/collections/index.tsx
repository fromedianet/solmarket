import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Radio, Select } from 'antd';
import { CollectionCard } from '../../components/CollectionCard';
import { useQuerySearch } from '@oyster/common';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { CardLoader } from '../../components/MyLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyView } from '../../components/EmptyView';
import { ExCollection } from '../../models/exCollection';
import { useExCollectionsAPI } from '../../hooks/useExCollections';
import { MarketType } from '../../constants';

const { Search } = Input;

const MARKETPLACES = [
  MarketType.All,
  MarketType.PaperCity,
  MarketType.MagicEden,
];

export const CollectionsView = () => {
  const searchParams = useQuerySearch();
  const type = searchParams.get('type') || 'all';
  const { getAllCollections, getNewCollections } = useCollectionsAPI();
  const exAPI = useExCollectionsAPI();
  const [collections, setCollections] = useState<ExCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [title, setTitle] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [filters, setFilters] = useState<ExCollection[]>([]);
  const [items, setItems] = useState<ExCollection[]>([]);
  const PER_PAGE = 20;

  useEffect(() => {
    setLoading(true);
    loadCollections(type)
      .then(res => {
        setCollections(res);
        setFilters(res);
      })
      .finally(() => {
        setLoading(false);
      });

    if (type === 'new') {
      setTitle('New Collections');
    } else if (type === 'popular') {
      setTitle('Popular Collections');
    } else {
      setTitle('All Collections');
    }
  }, [type, timeRange]);

  useEffect(() => {
    setHasMore(true);
    setItems(filters.slice(0, PER_PAGE));
  }, [filters]);

  async function loadCollections(type: string) {
    let data: ExCollection[] = [];
    if (type === 'new') {
      data = await getNewCollections();
      const exData = await exAPI.getNewCollections({
        market: MarketType.MagicEden,
        more: true,
      });
      data = data.concat(exData);
    } else if (type === 'popular') {
      data = await exAPI.getPopularCollections({
        market: MarketType.MagicEden,
        timeRange: timeRange,
        more: true,
      });
    } else {
      data = await getAllCollections();
      const exData = await exAPI.getAllCollections(MarketType.MagicEden);
      data = data.concat(exData);
    }
    return data;
  }

  const fetchMoreData = () => {
    if (items.length === filters.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setItems(prev =>
        prev.concat(filters.slice(prev.length, prev.length + PER_PAGE)),
      );
    }, 500);
  };

  const onSearchKey = event => {
    const key = event.target.value;
    setFilters(
      collections.filter(item =>
        item.name.toLocaleLowerCase().includes(key.toLocaleLowerCase()),
      ),
    );
  };

  const onChangeMarketType = (val: MarketType) => {
    if (val === MarketType.All) {
      setFilters(collections);
    } else if (val === MarketType.PaperCity) {
      setFilters(collections.filter(item => !item.market));
    } else {
      setFilters(
        collections.filter(item => item.market == val),
      );
    }
  };

  return (
    <div className="main-area">
      <div className="collections-page">
        <div className="title-container">
          <h1>{title}</h1>
          <Select
            style={{ width: 120 }}
            defaultValue={MarketType.All}
            onChange={onChangeMarketType}
          >
            {MARKETPLACES.map((item, index) => (
              <Select.Option key={index} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Row className="search-container">
          <Col span={24} md={24} lg={14}>
            <Search
              placeholder="Search collections by name"
              className="search-content"
              onChange={onSearchKey}
              allowClear
            />
          </Col>
          {type === 'popular' && (
            <Col span={24} md={24} lg={10} className="radio-content">
              <Radio.Group
                defaultValue={timeRange}
                buttonStyle="solid"
                className="section-radio "
              >
                <Radio.Button value="1d" onClick={() => setTimeRange('1d')}>
                  24 hours
                </Radio.Button>
                <Radio.Button value="7d" onClick={() => setTimeRange('7d')}>
                  7 days
                </Radio.Button>
                <Radio.Button value="30d" onClick={() => setTimeRange('30d')}>
                  30 days
                </Radio.Button>
              </Radio.Group>
            </Col>
          )}
        </Row>

        {loading ? (
          [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
        ) : items.length > 0 ? (
          // @ts-ignore
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            className="ant-row"
          >
            {items.map((item, index) => (
              <Col
                key={index}
                span={12}
                md={8}
                lg={8}
                xl={6}
                xxl={4}
                style={{ padding: 8 }}
              >
                <CollectionCard
                  item={item}
                  link={
                    item.market
                      ? `/excollection/${item.symbol}?market=${item.market}`
                      : `/marketplace/${item.symbol}`
                  }
                />
              </Col>
            ))}
          </InfiniteScroll>
        ) : (
          <EmptyView />
        )}
      </div>
    </div>
  );
};
