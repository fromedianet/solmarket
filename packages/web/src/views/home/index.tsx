import { Layout } from 'antd';
import React from 'react';
// import { useStore } from '@oyster/common';
// import { useMeta } from '../../contexts';
import { SalesListView } from './SalesList';
// import { SetupView } from './setup';

export const HomeView = () => {
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
