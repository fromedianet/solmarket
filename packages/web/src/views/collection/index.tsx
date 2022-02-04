import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';
import { FilterSidebar } from './components/FilterSidebar';

const { Content } = Layout;

export const CollectionView = () => {
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
      <Layout hasSider>
        <FilterSidebar />
        <Content></Content>
      </Layout>
    </div>
  );
};
