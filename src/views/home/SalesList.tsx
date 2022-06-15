import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CardLoader } from "../../components/CardLoader";
import { HorizontalGrid } from "../../components/HorizontalGrid";
import { useCollectionsAPI } from "../../hooks/useCollectionsAPI";
import { useNFTsAPI } from "../../hooks/useNFTsAPI";
import { HomeCard } from "../../components/HomeCard";
import { useMEApis } from "../../hooks/useMEApis";
import { NFTCard } from "../../components/NFTCard";

export const SalesListView = () => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState({
    popular: [],
    new: [],
    recentSales: [],
    recentListings: [],
  });
  const { getNewCollections } = useCollectionsAPI();
  const { getRecentListings, getRecentSales } = useNFTsAPI();
  const meApis = useMEApis();

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    loadAllData()
      .then((res: any) => {
        setCollections(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function loadAllData() {
    const newCollections = await getNewCollections(false);
    const popular = await meApis.getPopularCollections(false);
    const recentSales = await getRecentSales();
    const recentListings = await getRecentListings();

    const result = {
      popular: popular,
      new: newCollections,
      recentSales: recentSales,
      recentListings: recentListings,
    };

    return result;
  }

  return (
    <div className="main-area">
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Popular Collections</span>
          <Link href="/collections/popular">
            <a className="see-all">See All</a>
          </Link>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : collections["popular"] && (
              <HorizontalGrid
                childrens={collections["popular"].map((item: any, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={item["_id"]}
                    link={`/marketplace/${
                      item.market ? item.market : "papercity"
                    }/${item["symbol"]}`}
                  />
                ))}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">New Collections</span>
          <Link href="/collections/new">
            <a className="see-all">See All</a>
          </Link>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : collections["new"] && (
              <HorizontalGrid
                childrens={collections["new"].map((item: any, index) => (
                  <HomeCard
                    key={index}
                    item={item}
                    itemId={item["_id"]}
                    link={`/marketplace/${
                      item.market ? item.market : "papercity"
                    }/${item["symbol"]}`}
                  />
                ))}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Recent Sales</span>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : collections["recentSales"] && (
              <HorizontalGrid
                childrens={collections["recentSales"].map(
                  (item: any, index) => (
                    <NFTCard
                      key={index}
                      item={item}
                      itemId={item.mint}
                      collection={item.collectionName}
                      className="w-200"
                    />
                  )
                )}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Recent Listings</span>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : collections["recentListings"] && (
              <HorizontalGrid
                childrens={collections["recentListings"].map(
                  (item: any, index) => (
                    <NFTCard
                      key={index}
                      item={item}
                      itemId={item.mint}
                      collection={item.collectionName}
                      className="w-200"
                    />
                  )
                )}
              />
            )}
      </div>
    </div>
  );
};
