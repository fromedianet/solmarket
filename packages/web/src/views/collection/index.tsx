import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';
import { FilterSidebar } from './components/FilterSidebar';
import { Items } from './components/Items';
import { Activities } from './components/Activities';
import { useMeta } from '@oyster/common';
import { useParams } from 'react-router-dom';
import { useExtendedArt } from '../../hooks';
import { useAttributesByCollection } from '../../hooks/useAttributes';

const { Content } = Layout;

export const CollectionView = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useExtendedArt(id);
  const [isItems, setIsItems] = useState(true);
  const { width } = useWindowDimensions();
  const { handleToggle } = useSetSidebarState();
  const [attributes, setAttributes] = useState({});
  const [filter, setFilter] = useState({
    price: {
      symbol: 'SOL',
      min: undefined,
      max: undefined,
    },
    attributes: {},
  });

  const { metadata } = useMeta();
  const list = metadata.filter(item => item.info.collection?.key === id);

  const attrs = useAttributesByCollection(id);

  useEffect(() => {
    setAttributes(attrs);
  }, [id, attrs]);

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

  const onUpdateFilters = (priceFilter, attributeFilter) => {
    setFilter({ price: priceFilter, attributes: attributeFilter });
  };

  return (
    <div className="collection-page">
      <div className="collection-info">
        <CollectionInfo data={data} />
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
        <FilterSidebar updateFilters={onUpdateFilters} filter={filter} attributes={attributes} />
        <Content className="collection-container">
          {isItems ? (
            <Items
              list={list}
              updateFilters={onUpdateFilters}
              filter={filter}
            />
          ) : (
            <Activities />
          )}
        </Content>
      </Layout>
    </div>
  );
};
