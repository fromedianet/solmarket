import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Spin } from 'antd';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';
import { FilterSidebar } from './components/FilterSidebar';
import { Items } from './components/Items';
import { Activities } from './components/Activities';
import { useParams } from 'react-router-dom';
import { useCollection } from '../../hooks/useCollection';

const { Content } = Layout;
const { TabPane } = Tabs;

export const MarketplaceView = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { width } = useWindowDimensions();
  const { handleToggle } = useSetSidebarState();
  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    price: {
      symbol: 'SOL',
      min: undefined,
      max: undefined,
    },
    attributes: {},
  });
  const [searchKey, setSearchKey] = useState('');
  const [sort, setSort] = useState(1);

  const {
    collection,
    attributes,
    collectionStats,
    nfts,
    skip,
    hasMore,
    loading,
    getListedNFTs,
  } = useCollection(symbol);

  function useComponentWillUnmount(cleanupCallback = () => {}) {
    const callbackRef = React.useRef(cleanupCallback);
    callbackRef.current = cleanupCallback; // always up to date
    React.useEffect(() => {
      return () => callbackRef.current();
    }, []);
  }

  useEffect(() => {
    if (width > 768) {
      handleToggle(true);
    }
  });

  useComponentWillUnmount(() => {
    if (width > 768) {
      handleToggle(false);
    }
  });

  useEffect(() => {
    if (skip > 0) {
      setList(prev => prev.concat(nfts));
    } else {
      setList(nfts);
    }
  }, [nfts]);

  useEffect(() => {
    getListedNFTs({
      symbol: symbol,
      sort: sort,
      searchKey: searchKey,
      attributes: filter.attributes,
      min: filter.price.min,
      max: filter.price.max,
    });
  }, [searchKey, sort, filter]);

  const onUpdateFilters = (priceFilter, attributeFilter) => {
    setFilter({ price: priceFilter, attributes: attributeFilter });
  };

  const fetchMore = () => {
    if (hasMore) {
      getListedNFTs({
        symbol: symbol,
        sort: sort,
        searchKey: searchKey,
        attributes: filter.attributes,
        min: filter.price.min,
        max: filter.price.max,
        skip: skip,
      });
    }
  };

  return (
    <div className="collection-page">
      {collection && collection.banner && (
        <img src={collection.banner} className="collection-background" />
      )}
      <div className="collection-info">
        <CollectionInfo collection={collection} stats={collectionStats} />
      </div>
      <Tabs defaultActiveKey="items" centered style={{ overflow: 'unset' }}>
        <TabPane
          key="items"
          tab={
            <span>
              <img
                src="/icons/list.svg"
                style={{ width: '24px', marginRight: '8px' }}
              />
              Items
            </span>
          }
        >
          <Layout hasSider>
            <FilterSidebar
              updateFilters={onUpdateFilters}
              filter={filter}
              attributes={attributes}
            />
            <Content className="collection-container">
              {loading && <Spin />}
              <Items
                collection={collection}
                list={list}
                sort={sort}
                searchKey={searchKey}
                updateFilters={onUpdateFilters}
                onSearch={val => setSearchKey(val)}
                onSortChange={val => setSort(val)}
                filter={filter}
                hasMore={hasMore}
                fetchMore={fetchMore}
              />
            </Content>
          </Layout>
        </TabPane>
        <TabPane
          key="activities"
          tab={
            <span>
              <img
                src="/icons/activity.svg"
                style={{ width: '24px', marginRight: '8px' }}
              />
              Activities
            </span>
          }
        >
          <Activities />
        </TabPane>
      </Tabs>
    </div>
  );
};
