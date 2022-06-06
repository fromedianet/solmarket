import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { useLocalCache } from '../../hooks/useLocalCache';
// import { useStore } from '@oyster/common';
// import { useMeta } from '../../contexts';
import { SalesListView } from './SalesList';
// import { SetupView } from './setup';

export const HomeView = () => {
  const localCache = useLocalCache();
  useEffect(() => {
    localCache
      .clearAll()
      .then(result => console.log('Clear all expired caches', result));
  }, []);
  // const { isLoading, store } = useMeta();
  // const { isConfigured } = useStore();

  // const showAuctions = (store && isConfigured) || isLoading;

  // return <Layout>{showAuctions ? <SalesListView /> : <SetupView />}</Layout>;
  return (
    <Layout>
      <SalesListView />
    </Layout>
  );
};
