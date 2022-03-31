import React, { useEffect, useState } from 'react';
import { Col, Input } from 'antd';
import { CollectionCard } from '../../components/CollectionCard';
import { useQuerySearch } from '@oyster/common';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { CardLoader } from '../../components/MyLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyView } from '../../components/EmptyView';
import { ExCollection } from '../../models/exCollection';

const { Search } = Input;

export const CollectionsView = () => {
  const searchParams = useQuerySearch();
  const type = searchParams.get('type');
  const { getAllCollections, getNewCollections } = useCollectionsAPI();
  const [collections, setCollections] = useState<ExCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<ExCollection[]>([]);
  const [items, setItems] = useState<ExCollection[]>([]);
  const PER_PAGE = 20;

  useEffect(() => {
    setLoading(true);
    if (type === 'new') {
      getNewCollections()
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setCollections(res['data']);
            setFilters(res['data']);
          }
        })
        .finally(() => setLoading(false));
    } else {
      getAllCollections()
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setCollections(res['data']);
            setFilters(res['data']);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [type]);

  useEffect(() => {
    setHasMore(true);
    setItems(filters.slice(0, PER_PAGE));
  }, [filters]);

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

  const onChange = event => {
    const key = event.target.value;
    setFilters(
      collections.filter(item =>
        item.name.toLocaleLowerCase().includes(key.toLocaleLowerCase()),
      ),
    );
  };

  return (
    <div className="main-area">
      <div className="collections-page">
        <h1>{type === 'new' ? 'New Collections' : 'All Collections'}</h1>
        <Search
          placeholder="Search collections by name"
          className="collection-search"
          onChange={onChange}
          allowClear
        />
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
                  link={`/marketplace/${item.symbol}`}
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
