import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';
import { FilterSidebar } from './components/FilterSidebar';

const { Content } = Layout;

export const CollectionView = () => {
  const [isItems, setIsItems] = useState(true);
  const { width } = useWindowDimensions();
  const { handleToggle } = useSetSidebarState();

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

  return (
    <div className="collection-page">
      <div className="collection-info">
        <CollectionInfo />
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
            src="icons/activity.svg"
            style={{ width: '24px', marginRight: '8px' }}
          />
          Activities
        </div>
      </div>
      <Layout hasSider>
        <FilterSidebar />
        <Content className="collection-container"></Content>
      </Layout>
    </div>
  );
};
