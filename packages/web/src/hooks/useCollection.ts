import { useEffect, useState } from 'react';
import {
  ExAttribute,
  ExAttrValue,
  ExCollection,
  ExCollectionStats,
} from '../models/exCollection';
import { useCollectionsAPI } from './useCollectionsAPI';
import { useNFTsAPI } from './useNFTsAPI';

const PER_PAGE = 20;

type QUERIES = {
  symbol: string;
  sort: number;
  searchKey?: string;
  attributes?: {};
  min?: number;
  max?: number;
  skip?: number;
  limit?: number;
};

export const useCollection = (symbol: string) => {
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<ExCollection>();
  const [attributes, setAttributes] = useState<ExAttribute[]>([]);
  const [collectionStats, setCollectionStats] = useState<ExCollectionStats>({});
  const [nfts, setNFTs] = useState<any[]>([]);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { getCollectionBySymbol, getCollectionStatsBySymbol } =
    useCollectionsAPI();
  const { getListedNftsByQuery } = useNFTsAPI();

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
          setAttributes(parseAttributes(availableAttributes));
          setCollectionStats({
            floorPrice: parseInt(floorPrice),
            listedCount: parseInt(listedCount),
            listedTotalValue: parseInt(listedTotalValue),
            totalVolume: parseInt(totalVolume),
          });
        }
      });
  }, [symbol]);

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

  function parseAttributes(data: any[] | null): ExAttribute[] {
    const attrs: ExAttribute[] = [];
    try {
      if (data) {
        let prevKey = '';
        const attr: ExAttribute = {
          key: '',
          numbers: [],
        };

        data.forEach((item, index) => {
          const temp: ExAttrValue = {
            value: item['attribute']['value'],
            amount: item['count'],
          };

          if (prevKey !== item['attribute']['trait_type']) {
            if (index > 0) {
              attrs.push(attr);
            }

            attr.key = item['attribute']['trait_type'];
            attr.numbers = [temp];

            prevKey = item['attribute']['trait_type'];
          } else {
            attr.numbers.push(temp);
          }

          if (index === data.length - 1) {
            attrs.push(attr);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    console.log('parseAttributes', attrs);
    return attrs;
  }

  return {
    collection,
    attributes,
    collectionStats,
    nfts,
    loading,
    getListedNFTs,
    skip,
    hasMore,
  };
};
