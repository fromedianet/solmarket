import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Spin } from 'antd';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';
import { FilterSidebar } from './components/FilterSidebar';
import { Items } from './components/Items';
import { Activities } from './components/Activities';
import { useParams } from 'react-router-dom';
import { useExCollection } from '../../hooks/useExCollections';
import { ExNFT } from '../../models/exCollection';
import { useQuerySearch } from '@oyster/common';

const { Content } = Layout;
const { TabPane } = Tabs;

export const ExCollectionView = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useQuerySearch();
  const market = searchParams.get('market') || '';
  const { width } = useWindowDimensions();
  const { handleToggle } = useSetSidebarState();
  const [list, setList] = useState<ExNFT[]>([]);
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
    transactions,
    getListedNFTsByCollection,
    skip,
    cursor,
    hasMore,
    loading,
  } = useExCollection(id, market);
  const [refresh, setRefresh] = useState(true);

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
    if (refresh) {
      setList(nfts);
    } else {
      setList(prev => prev.concat(nfts));
    }
  }, [nfts]);

  useEffect(() => {
    onRefresh();
  }, [searchKey, sort, filter]);

  const onUpdateFilters = (priceFilter, attributeFilter) => {
    setFilter({ price: priceFilter, attributes: attributeFilter });
  };

  const onRefresh = () => {
    setRefresh(true);
    getListedNFTsByCollection({
      market: market,
      symbol: id,
      sort: sort,
      searchKey: searchKey,
      attributes: filter.attributes,
      min: filter.price.min,
      max: filter.price.max,
    });
  };

  const fetchMore = () => {
    if (hasMore) {
      setRefresh(false);
      getListedNFTsByCollection({
        market: market,
        symbol: id,
        sort: sort,
        searchKey: searchKey,
        attributes: filter.attributes,
        min: filter.price.min,
        max: filter.price.max,
        skip: skip,
        cursor: cursor,
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
              market={market}
              updateFilters={onUpdateFilters}
              filter={filter}
              attributes={attributes}
            />
            <Content className="collection-container">
              {loading && <Spin />}
              <Items
                list={list}
                sort={sort}
                market={market}
                id={id}
                collection={collection}
                searchKey={searchKey}
                updateFilters={onUpdateFilters}
                onSearch={val => setSearchKey(val)}
                onSortChange={val => setSort(val)}
                onRefresh={onRefresh}
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
          <Activities market={market} id={id} transactions={transactions} />
        </TabPane>
      </Tabs>
    </div>
  );
};
