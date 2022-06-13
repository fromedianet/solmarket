import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "antd/dist/antd.css";
import "../styles/index.less";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const IndexDBComponent = dynamic(() => import("../contexts/IndexDBComponent"), {
  ssr: false,
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function App({ Component, pageProps }: AppProps) {
  usePagesViews(gaMeasurementId);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PAPERCITY</title>
      </Head>
      <div id="root">
        <GoogleAnalytics
          strategy="lazyOnload"
          gaMeasurementId={gaMeasurementId}
        />
        <ToastContainer />
        <IndexDBComponent />
        <Component {...pageProps} />
      </div>
    </>
  );
}
