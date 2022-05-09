import { useEffect, useState } from 'react';
import {
  ExAttribute,
  ExAttrValue,
  ExCollection,
  ExCollectionStats,
  QUERIES,
  Transaction,
} from '../models/exCollection';
import { useCollectionsAPI } from './useCollectionsAPI';
import { useMEApis } from './useMEApis';
import { useNFTsAPI } from './useNFTsAPI';
import { useTransactionsAPI } from './useTransactionsAPI';

const PER_PAGE = 20;

export const useCollection = (id: string, symbol: string) => {
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<ExCollection>();
  const [attributes, setAttributes] = useState<ExAttribute[]>([]);
  const [collectionStats, setCollectionStats] = useState<ExCollectionStats>({});
  const [nfts, setNFTs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { getCollectionBySymbol, getCollectionStatsBySymbol } =
    useCollectionsAPI();
  const { getListedNftsByQuery } = useNFTsAPI();
  const { getTransactionsBySymbol } = useTransactionsAPI();
  const meApis = useMEApis();

  useEffect(() => {
    // For own marketplace
    loadCollectionBySymbol(symbol, id).then(res => {
      if (res) {
        setCollection(res);
      }
    });

    loadCollectionEscrowStatsBySymbol(symbol, id).then(res => {
      if (res) {
        const {
          availableAttributes,
          floorPrice,
          listedCount,
          listedTotalValue,
          totalVolume,
        } = res;
        setAttributes(_parseAttributes(availableAttributes));
        setCollectionStats({
          floorPrice: parseInt(floorPrice),
          listedCount: parseInt(listedCount),
          listedTotalValue: parseInt(listedTotalValue),
          totalVolume: parseInt(totalVolume),
        });
      }
    });

    loadTransactionsBySymbol(symbol).then(res => {
      setTransactions(res);
    });
  }, [id, symbol]);

  async function loadCollectionBySymbol(symbol: string, id: string) {
    if (id === '1') {
      return await getCollectionBySymbol(symbol);
    } else {
      return await meApis.getCollectionBySymbol(symbol);
    }
  }

  async function loadCollectionEscrowStatsBySymbol(symbol: string, id: string) {
    if (id === '1') {
      return await getCollectionStatsBySymbol(symbol);
    } else {
      return await meApis.getCollectionEscrowStats(symbol);
    }
  }

  async function loadTransactionsBySymbol(symbol: string) {
    let data = await getTransactionsBySymbol(symbol);
    const exData = await meApis.getTransactionsBySymbol(symbol);
    data = data.concat(exData);
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

    getListedNftsByQuery(param)
      // @ts-ignore
      .then((res: {}) => {
        const data = res['data'];
        if (data) {
          setNFTs(data);
          if (data.length < PER_PAGE) {
            setSkip(0);
            setHasMore(false);
          } else {
            setSkip(prev => prev + PER_PAGE);
            setHasMore(true);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  function _parseAttributes(data: any[] | null): ExAttribute[] {
    const attrs: ExAttribute[] = [];
    try {
      if (data) {
        const obj = {};
        data.forEach(item => {
          const key = item['attribute']['trait_type'];
          const temp: ExAttrValue = {
            value: item['attribute']['value'],
            amount: item['count'],
          };
          if (obj[key]) {
            obj[key].push(temp);
          } else {
            obj[key] = [temp];
          }
        });

        Object.keys(obj).forEach(key => {
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
