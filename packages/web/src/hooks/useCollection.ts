import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import {
  ExAttribute,
  ExAttrValue,
  ExCollection,
  ExCollectionStats,
  Transaction,
} from '../models/exCollection';
import { useCollectionsAPI } from './useCollectionsAPI';
import { useNFTsAPI } from './useNFTsAPI';
import { useTransactionsAPI } from './useTransactionsAPI';

const PER_PAGE = 20;

export type QUERIES = {
  symbol: string;
  sort: number;
  status: boolean;
  searchKey?: string;
  attributes?: {};
  min?: number;
  max?: number;
  skip?: number;
  limit?: number;
};

export function getQueryPrameter(param: QUERIES) {
  const queries = {
    skip: param.skip ? param.skip : 0,
    limit: PER_PAGE,
  };
  const match = { symbol: param.symbol };
  if (param.searchKey) {
    match['search'] = param.searchKey;
  }
  match['status'] = param.status;

  if (param.min || param.max) {
    const price = {};
    if (param.min) {
      price['gte'] = param.min * LAMPORTS_PER_SOL;
    }
    if (param.max) {
      price['lte'] = param.max * LAMPORTS_PER_SOL;
    }
    match['price'] = price;
  }

  if (param.attributes && Object.keys(param.attributes).length > 0) {
    const attrs: any[] = [];
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      const subAttrs = param.attributes[key].map(val => ({
        trait_type: key,
        value: val,
      }));
      attrs.push(subAttrs);
    });
    match['attributes'] = attrs;
  }

  queries['match'] = match;

  const sortQuery = {};
  if (param.sort === 2) {
    sortQuery['price'] = 1;
  } else if (param.sort === 3) {
    sortQuery['price'] = -1;
  }
  sortQuery['createdAt'] = -1;

  queries['sort'] = sortQuery;

  const result = {
    query: JSON.stringify(queries),
  };

  return result;
}

export const useCollection = (symbol: string) => {
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

  useEffect(() => {
    getCollectionBySymbol(symbol)
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
        }
      });

    getCollectionStatsBySymbol(symbol)
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
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

    getListedNFTs({ symbol: symbol, sort: 1, status: false });

    getTransactionsBySymbol(symbol)
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setTransactions(res['data']);
        }
      });
  }, [symbol]);

  const getListedNFTs = (param: QUERIES) => {
    if (loading) return;
    setLoading(true);

    const query = getQueryPrameter(param);

    getListedNftsByQuery(query)
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
