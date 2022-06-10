import { Layout } from 'antd';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useLocalCache } from '../../hooks/useLocalCache';
import { SalesListView } from './SalesList';

export const HomeView = () => {
  const localCache = useLocalCache();
  useEffect(() => {
    localCache.clearAll().then(() => {});
  }, []);

  return (
    <Layout>
      <Head>
        <meta property="og:title" content="PaperCity" />
        <meta
          property="og:description"
          content="PaperCity is a marketplace aggregator for NFTs on the Solana platform, incorporating listings from all the most popular marketplaces as well as our own inventory"
        />
        <meta property="og:url" content="https://papercity.io" />
        <meta
          property="og:image"
          content="https://papercity-bucket.s3.amazonaws.com/papercity_logo-02.png"
        />
        <meta property="og:type" content="article" />
      </Head>
      <SalesListView />
    </Layout>
  );
};
