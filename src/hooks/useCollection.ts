import { useEffect, useState } from "react";
import { MarketType } from "../constants";
import {
  ExAttribute,
  ExAttrValue,
  ExCollection,
  ExCollectionStats,
  QUERIES,
  Transaction,
} from "../models/exCollection";
import { useCollectionsAPI } from "./useCollectionsAPI";
import { useMEApis } from "./useMEApis";
import { useNFTsAPI } from "./useNFTsAPI";
import { useTransactionsAPI } from "./useTransactionsAPI";

const PER_PAGE = 20;

export const useCollection = (market: string, symbol: string) => {
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<ExCollection>();
  const [attributes, setAttributes] = useState<ExAttribute[]>([]);
  const [collectionStats, setCollectionStats] = useState<ExCollectionStats>({});
  const [nfts, setNFTs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { getCollectionAndStats } = useCollectionsAPI();
  const { getListedNftsByQuery } = useNFTsAPI();
  const { getTransactionsBySymbol } = useTransactionsAPI();
  const meApis = useMEApis();

  useEffect(() => {
    // For own marketplace
    getCollectionAndStats(symbol, market).then((res) => {
      if (res) {
        if (res["collection"]) {
          setCollection(res["collection"]);
        }
        if (res["stats"]) {
          const {
            availableAttributes,
            floorPrice,
            listedCount,
            listedTotalValue,
            volumeAll,
          } = res["stats"];
          setAttributes(_parseAttributes(availableAttributes));
          setCollectionStats({
            floorPrice: parseFloat(floorPrice),
            listedCount: parseInt(listedCount),
            listedTotalValue: parseFloat(listedTotalValue),
            volumeAll: parseFloat(volumeAll),
          });
        }
      }
    });

    loadTransactionsBySymbol(symbol).then((res) => {
      setTransactions(res);
    });
  }, [market, symbol]);

  async function loadTransactionsBySymbol(symbol: string) {
    let data = await getTransactionsBySymbol(symbol);
    const exData = await meApis.getTransactionsBySymbol(symbol, market);
    let txs = data.map((k) => k.transaction);
    exData.forEach((item) => {
      if (!txs.includes(item.transaction)) {
        data.push(item);
        txs.push(item.transaction);
      }
    });
    data.sort((a, b) => {
      if (b.blockTime > a.blockTime) {
        return 1;
      } else if (b.blockTime < a.blockTime) {
        return -1;
      } else {
        if (b.id > a.id) {
          return 1;
        } else if (b.id < a.id) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    return data;
  }

  const getListedNFTs = (param: QUERIES) => {
    if (loading) return;
    setLoading(true);

    loadListedNFTs(param)
      .then((data) => {
        setNFTs(data);
        if (data.length > 0) {
          if (data.length < PER_PAGE) {
            setSkip(0);
            setHasMore(false);
          } else {
            setSkip((prev) => prev + PER_PAGE);
            setHasMore(true);
          }
        } else {
          setSkip(0);
          setHasMore(false);
        }
      })
      .finally(() => setLoading(false));
  };

  async function loadListedNFTs(param: QUERIES) {
    let data = await getListedNftsByQuery(param);

    if (
      market === MarketType.DigitalEyes ||
      market === MarketType.Solanart ||
      market === MarketType.AlphaArt
    ) {
      const exData = await meApis.getListedNftsByQuery(param, market);
      data = data.concat(exData);

      if (param.sort === 2) {
        data.sort((a, b) => {
          if (a.price < b.price) {
            return -1;
          }
          if (a.price > b.price) {
            return 1;
          }
          return 0;
        });
      } else if (param.sort === 3) {
        data.sort((a, b) => {
          if (a.price > b.price) {
            return -1;
          }
          if (a.price < b.price) {
            return 1;
          }
          return 0;
        });
      }
    }

    return data;
  }

  function _parseAttributes(data: any[] | null): ExAttribute[] {
    const attrs: ExAttribute[] = [];
    try {
      if (data) {
        const obj = {};
        data.forEach((item) => {
          const key = item["attribute"]["trait_type"];
          const temp: ExAttrValue = {
            value: item["attribute"]["value"],
            amount: item["count"],
          };
          if (obj[key]) {
            obj[key].push(temp);
          } else {
            obj[key] = [temp];
          }
        });

        Object.keys(obj).forEach((key) => {
          attrs.push({
            key: key,
            numbers: obj[key],
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
    return attrs;
  }

  return {
    collection,
    attributes,
    collectionStats,
    transactions,
    nfts,
    loading,
    getListedNFTs,
    skip,
    hasMore,
  };
};
