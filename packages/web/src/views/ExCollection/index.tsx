import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
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

export const ExCollectionView = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useQuerySearch();
  const market = searchParams.get('market') || '';
  const [isItems, setIsItems] = useState(true);
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
    getListedNFTsByCollection,
    skip,
    cursor,
    hasMore,
  } = useExCollection(id, market);

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
    if (skip > 0 || cursor) {
      setList(prev => prev.concat(nfts));
    } else {
      setList(nfts);
    }
  }, [nfts]);

  useEffect(() => {
    getListedNFTsByCollection({
      market: market,
      symbol: id,
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
      <div className="collection-tabs">
        <div
          className={`my-tab ${isItems && 'my-tab-active'}`}
          onClick={() => setIsItems(true)}
        >
          <img
            src="/icons/list.svg"
            style={{ width: '24px', marginRight: '8px' }}
          />
          Items
        </div>
        <div
          className={`my-tab ${!isItems && 'my-tab-active'}`}
          onClick={() => setIsItems(false)}
        >
          <img
            src="/icons/activity.svg"
            style={{ width: '24px', marginRight: '8px' }}
          />
          Activities
        </div>
      </div>
      <Layout hasSider>
        <FilterSidebar
          market={market}
          updateFilters={onUpdateFilters}
          filter={filter}
          attributes={attributes}
        />
        <Content className="collection-container">
          {isItems ? (
            <Items
              list={list}
              sort={sort}
              market={market}
              id={id}
              searchKey={searchKey}
              updateFilters={onUpdateFilters}
              onSearch={val => setSearchKey(val)}
              onSortChange={val => setSort(val)}
              filter={filter}
              hasMore={hasMore}
              fetchMore={fetchMore}
            />
          ) : (
            <Activities />
          )}
        </Content>
      </Layout>
    </div>
  );
};
