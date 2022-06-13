import { Layout } from "antd";
import React, { useEffect } from "react";
import { useLocalCache } from "../../hooks/useLocalCache";
import { SalesListView } from "./SalesList";

export default function HomeView() {
  const localCache = useLocalCache();
  useEffect(() => {
    localCache.clearAll().then(() => {});
  }, []);

  return (
    <Layout>
      <SalesListView />
    </Layout>
  );
}
