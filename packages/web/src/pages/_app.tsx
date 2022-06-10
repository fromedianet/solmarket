import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.less';
import { GoogleAnalytics, usePagesViews } from 'nextjs-google-analytics';
import OpenGraphHead from '../components/OpenGraph/OpenGraphHead';

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function App({ Component, pageProps }: AppProps) {
  usePagesViews(gaMeasurementId);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <OpenGraphHead
          ogTitle='PaperCity'
          ogDescription='PaperCity is a marketplace aggregator for NFTs on the Solana platform, incorporating listings from all the most popular marketplaces as well as our own inventory'
          ogUrl='https://papercity.io'
          ogImage='https://papercity-bucket.s3.amazonaws.com/papercity_logo.png'
        />
        <title>PAPERCITY</title>
      </Head>
      <div id="root">
        <GoogleAnalytics
          strategy="lazyOnload"
          gaMeasurementId={gaMeasurementId}
        />
        <Component {...pageProps} />
      </div>
    </>
  );
}
