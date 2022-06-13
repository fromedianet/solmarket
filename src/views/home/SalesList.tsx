import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CardLoader } from "../../components/CardLoader";
import { HorizontalGrid } from "../../components/HorizontalGrid";
import { useCollectionsAPI } from "../../hooks/useCollectionsAPI";
import { useNFTsAPI } from "../../hooks/useNFTsAPI";
import { HomeCard } from "../../components/HomeCard";
import { ExCollection } from "../../models/exCollection";
import { useMEApis } from "../../hooks/useMEApis";
import { NFTCard } from "../../components/NFTCard";

export const SalesListView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState({
    popular: [],
    new: [],
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const { featuredCollectionsCarousel } = useCollectionsAPI();
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

    getRecentSales().then((res: any[]) => {
      setRecentSales(res);
    });

    getRecentListings().then((res: any[]) => {
      setRecentListings(res);
    });
  }, []);

  async function loadAllData() {
    const result = {};

    // Own marketplace
    const featuredData = await featuredCollectionsCarousel();

    // MagicEden
    const popular = await meApis.getPopularCollections(false);
    const exNews = await meApis.getNewCollections();

    let newData: ExCollection[] = featuredData["new"] || [];
    newData = newData.concat(exNews);
    result["new"] = newData;
    result["popular"] = popular;

    return result;
  }

  return (
    <div className="main-area">
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Popular Collections</span>
          <a
            onClick={() => router.push("/collections/popular")}
            className="see-all"
          >
            See All
          </a>
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
          <a
            onClick={() => router.push("/collections/new")}
            className="see-all"
          >
            See All
          </a>
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
          : recentSales && (
              <HorizontalGrid
                childrens={recentSales.map((item, index) => (
                  <NFTCard
                    key={index}
                    item={item}
                    itemId={item.mint}
                    collection={item.collectionName}
                    className="w-200"
                  />
                ))}
              />
            )}
      </div>
      <div className="home-section">
        <div className="section-header">
          <span className="section-title">Recent Listings</span>
        </div>
        {loading
          ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          : recentListings && (
              <HorizontalGrid
                childrens={recentListings.map((item, index) => (
                  <NFTCard
                    key={index}
                    item={item}
                    itemId={item.mint}
                    collection={item.collectionName}
                    className="w-200"
                  />
                ))}
              />
            )}
      </div>
    </div>
  );
};
