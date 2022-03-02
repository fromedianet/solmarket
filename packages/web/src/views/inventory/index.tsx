import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Col, Input } from 'antd';
import { TITLE } from './constants';
import { useExCollection } from './hooks/useExCollection';
import { ExCollection } from '../../models/exCollection';
import { ExCollectionCard } from './ExCollectionCard';
import { CardLoader } from '../../components/MyLoader';
import { EmptyView } from '../../components/EmptyView';

const { Search } = Input;

export const InventoryView = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, collections } = useExCollection(id);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<ExCollection[]>([]);
  const [items, setItems] = useState<ExCollection[]>([]);
  const PER_COUNT = 20;

  useEffect(() => {
    if (!loading) {
      setFilters(collections);
    }
  }, [id, collections, loading]);

  useEffect(() => {
    setHasMore(true);
    setItems(filters.slice(0, PER_COUNT));
  }, [filters]);

  const fetchMoreData = () => {
    if (items.length === filters.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setItems(prev =>
        prev.concat(filters.slice(prev.length, prev.length + PER_COUNT)),
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
      <div className="inventory-page">
        <h1>{TITLE[id]}</h1>
        <Search
          placeholder="Search collections by name"
          className="search-control"
          onChange={onChange}
          allowClear
        />
        <h2>Collections</h2>
        {loading ? (
          [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
        ) : items.length > 0 ? (
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
                <ExCollectionCard item={item} />
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
