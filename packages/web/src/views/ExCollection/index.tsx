import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';
import { FilterSidebar } from './components/FilterSidebar';
import { Items } from './components/Items';
import { Activities } from './components/Activities';
import { useLocation, useParams } from 'react-router-dom';
import { useExCollection } from '../../hooks/useExCollections';
import { ExNFT } from '../../models/exCollection';
import { CardLoader } from '../../components/MyLoader';

const { Content } = Layout;

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export const ExCollectionView = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const market = useQuery().get('market') || '';
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
    loading,
    getListedNFTsByCollection,
  } = useExCollection(symbol, market);

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
    setList(nfts);
  }, [nfts]);

  useEffect(() => {
    getListedNFTsByCollection({
      market: market,
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
            loading ? (
              [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
            ) : (
              <Items
                list={list}
                sort={sort}
                market={market}
                searchKey={searchKey}
                updateFilters={onUpdateFilters}
                onSearch={val => setSearchKey(val)}
                onSortChange={val => setSort(val)}
                filter={filter}
              />
            )
          ) : (
            <Activities />
          )}
        </Content>
      </Layout>
    </div>
  );
};