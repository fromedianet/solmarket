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
import { useMECollectionsAPI } from './useMECollectionsAPI';
import { useNFTsAPI } from './useNFTsAPI';
import { useTransactionsAPI } from './useTransactionsAPI';

const PER_PAGE = 20;

export const useCollection = (symbol: string, market?: string) => {
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
  const { getMECollectionBySymbol, getMEListedNFTsByCollection, getMETransactionsBySymbol } = useMECollectionsAPI();

  useEffect(() => {
    if (market) {
      // For MagicEden
      getMECollectionBySymbol(market, symbol)
        // @ts-ignore
        .then((result: {}) => {
          if ('collection' in result) {
            setCollection(result['collection']);
          }
          if ('attributes' in result) {
            setAttributes(result['attributes']);
          }
          if ('stats' in result) {
            setCollectionStats(result['stats']);
          }
        });

      getMETransactionsBySymbol({
        market: market,
        symbol: symbol,
        sort: 1,
      }).then((data: []) => {
        setTransactions(data);
      });
    } else {
      // For own marketplace
      getCollectionBySymbol(symbol)
        // @ts-ignore
        .then((res: {}) => {
          if ('data' in res) {
            setCollection(res['data']);
          }
        });

      getCollectionStatsBySymbol(symbol)
        // @ts-ignore
        .then((res: {}) => {
          if ('data' in res) {
            const {
              availableAttributes,
              floorPrice,
              listedCount,
              listedTotalValue,
              totalVolume,
            } = res['data'];
            setAttributes(_parseAttributes(availableAttributes));
            setCollectionStats({
              floorPrice: parseInt(floorPrice),
              listedCount: parseInt(listedCount),
              listedTotalValue: parseInt(listedTotalValue),
              totalVolume: parseInt(totalVolume),
            });
          }
        });

      getTransactionsBySymbol(symbol)
        // @ts-ignore
        .then((res: {}) => {
          if ('data' in res) {
            setTransactions(res['data']);
          }
        });
    }
    
  }, [symbol, market]);

  const getListedNFTs = (param: QUERIES, market?: string) => {
    if (loading) return;
    setLoading(true);

    if (market) {
      getMEListedNFTsByCollection(param)
        .then((data: []) => {
          setNFTs(data);
          if (data.length < PER_PAGE) {
            setSkip(0);
            setHasMore(false);
          } else {
            setSkip(prev => prev + PER_PAGE);
            setHasMore(true);
          }
        })
        .finally(() => setLoading(false));
    } else {
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
    }
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
