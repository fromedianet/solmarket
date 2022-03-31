import { useEffect, useState } from 'react';
import {
  ExAttribute,
  ExCollection,
  ExCollectionStats,
  ExNFT,
  Transaction,
} from '../models/exCollection';
import { APIS } from '../constants';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const PER_PAGE = 20;

export const useExCollections = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<ExCollection[]>([]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      // Get collections in selected marketplace.

      const uri = APIS.base_url + APIS.exCollections + id;
      fetch(uri)
        .then(res => res.json())
        .then(result => {
          setCollections(result['data']);
          setLoading(false);
        });
    }
  }, [id]);

  return { loading, collections };
};

export const useExCollection = (symbol: string, market: string) => {
  const [collection, setCollection] = useState<ExCollection>();
  const [attributes, setAttributes] = useState<ExAttribute[]>([]);
  const [collectionStats, setCollectionStats] = useState<ExCollectionStats>({});
  const [nfts, setNFTs] = useState<ExNFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [cursor, setCursor] = useState();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const collectionUri =
      APIS.base_url + APIS.exCollections + market + '/' + encodeURI(symbol);
    fetch(collectionUri)
      .then(res => res.json())
      .then(result => {
        if (result['collection']) {
          setCollection(result['collection']);
        }
        if (result['attributes']) {
          setAttributes(result['attributes']);
        }
        if (result['stats']) {
          setCollectionStats(result['stats']);
        }
      });

    /**
     * Get NFTs
     */
    // getListedNFTsByCollection({
    //   market: market,
    //   symbol: symbol,
    //   sort: 1,
    // });

    /**
     * Get transactions
     */
    getTransactions({
      market: market,
      symbol: symbol,
      sort: 1,
    });
  }, [symbol]);

  const getListedNFTsByCollection = (param: QUERIES) => {
    if (loading) return;
    setLoading(true);
    const uri = APIS.base_url + APIS.listedNFTs;
    let queryBody = {};
    if (param.market === 'magiceden') {
      queryBody = getParamsForMagicEden(param);
    } else if (market === 'solanart') {
      queryBody = getParamsForSolanart(param);
    } else if (market === 'digital_eyes') {
      queryBody = getParamsForDigitalEyes(param);
    } else if (market === 'alpha_art') {
      queryBody = getParamsForAlphaArt(param);
    }

    fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    })
      .then(res => res.json())
      .then(result => {
        setNFTs(result['data']);

        if (param.market === 'magiceden') {
          if (result['data'].length < PER_PAGE) {
            setSkip(0);
            setHasMore(false);
          } else {
            setSkip(prev => prev + PER_PAGE);
            setHasMore(true);
          }
        } else if (param.market === 'solanart') {
          if (result['skip']) {
            setSkip(result['skip']);
            setHasMore(true);
          } else {
            setSkip(0);
            setHasMore(false);
          }
        } else if (param.market === 'digital_eyes') {
          if (result['listedCount'] || result['floorPrice']) {
            setCollectionStats(prev => ({
              ...prev,
              listedCount: result['listedCount'] || 0,
              floorPrice: result['floorPrice'] || 0,
            }));
          }
          if (result['cursor']) {
            setCursor(result['cursor']);
            setHasMore(true);
          } else {
            setCursor(undefined);
            setHasMore(false);
          }
        } else if (param.market === 'alpha_art') {
          if (result['listedCount'] || result['floorPrice']) {
            setCollectionStats(prev => ({
              ...prev,
              listedCount: result['listedCount'] || 0,
              floorPrice: result['floorPrice'] || 0,
            }));
          }
        }

        setLoading(false);
      });
  };

  const getTransactions = (param: QUERIES) => {
    const uri = APIS.base_url + APIS.transactionsByCollection;
    const queryBody = { market: param.market };
    if (param.market === 'magiceden') {
      const query = {
        $match: { collection_symbol: param.symbol },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      queryBody['params'] = encodeURI(`?q=${JSON.stringify(query)}`);
    } else if (param.market === 'solanart' || param.market === 'digital_eyes') {
      queryBody['params'] = encodeURI(`?collection=${param.symbol}`);
    } else if (param.market === 'alpha_art') {
      queryBody['params'] = encodeURI(
        `${param.symbol}?trading_types=1%2C2%2C3&no_foreign_listing=true`,
      );
    }

    fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    })
      .then(res => res.json())
      .then(result => {
        setTransactions(result['data']);
      });
  };

  return {
    collection,
    attributes,
    collectionStats,
    nfts,
    transactions,
    loading,
    getListedNFTsByCollection,
    skip,
    cursor,
    hasMore,
  };
};

export type QUERIES = {
  market: string;
  symbol: string;
  sort: number;
  searchKey?: string;
  attributes?: {};
  min?: number;
  max?: number;
  skip?: number;
  cursor?: number;
};

function getParamsForMagicEden(param: QUERIES) {
  const queries = {
    $skip: param.skip ? param.skip : 0,
    $limit: PER_PAGE,
  };
  const match = {};
  match['collectionSymbol'] = param.symbol;
  if (param.searchKey) {
    match['$text'] = {
      $search: param.searchKey,
    };
  }
  if (param.min || param.max) {
    const takerAmount = {};
    if (param.min) {
      takerAmount['$gte'] = param.min * LAMPORTS_PER_SOL;
    }
    if (param.max) {
      takerAmount['$lte'] = param.max * LAMPORTS_PER_SOL;
    }
    match['takerAmount'] = takerAmount;
  }

  if (param.attributes && Object.keys(param.attributes).length > 0) {
    const attrs: any[] = [];
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      const subAttrs = param.attributes[key].map(val => ({
        attributes: {
          $elemMatch: {
            trait_type: key,
            value: val,
          },
        },
      }));
      attrs.push({ $or: subAttrs });
    });

    match['$and'] = attrs;
  }

  queries['$match'] = match;

  const sortQuery = {};
  if (param.sort === 2) {
    sortQuery['takerAmount'] = 1;
  } else if (param.sort === 3) {
    sortQuery['takerAmount'] = -1;
  }
  sortQuery['createdAt'] = -1;

  queries['$sort'] = sortQuery;

  const queryStr = `?q=${JSON.stringify(queries)}`;

  const result = {
    market: param.market,
    params: encodeURI(queryStr),
  };

  return result;
}

function getParamsForSolanart(param: QUERIES) {
  let queries = '?collection=' + param.symbol;
  queries += '&listed=true&fits=any&bid=all';
  queries += '&page=' + (param.skip ? param.skip : 0);
  queries += '&limit=' + PER_PAGE;
  if (param.min) {
    queries += '&min=' + param.min;
  }
  if (param.max) {
    queries += '&max=' + param.max;
  }
  let order = 'recent';
  if (param.sort === 2) {
    order = 'price-ASC';
  } else if (param.sort === 3) {
    order = 'price-DESC';
  }
  queries += '&order=' + order;
  if (param.searchKey && param.searchKey.length > 0) {
    queries += '&search=' + param.searchKey;
  }
  if (param.attributes && Object.keys(param.attributes).length > 0) {
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      param.attributes[key].forEach(val => {
        queries += `&trait[]=${key}: ${val}`;
      });
    });
  }

  queries = queries.replaceAll(' ', '+');

  const result = {
    market: param.market,
    params: encodeURI(queries),
  };

  return result;
}

function getParamsForDigitalEyes(param: QUERIES) {
  let queries = '?collection=' + param.symbol;
  if (param.sort === 1) {
    queries += '&addEpoch=desc';
  } else if (param.sort === 2) {
    queries += '&price=asc';
  } else if (param.sort === 3) {
    queries += '&price=desc';
  }
  if (param.attributes && Object.keys(param.attributes).length > 0) {
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      param.attributes[key].forEach(val => {
        queries += `&${key}=${val}`;
      });
    });
  }
  if (param.cursor) {
    queries += `&cursor=${param.cursor}`;
  }

  const result = {
    market: param.market,
    params: encodeURI(queries),
  };

  return result;
}

function getParamsForAlphaArt(param: QUERIES) {
  const queries = {};
  queries['collectionId'] = param.symbol;
  queries['status'] = ['BUY_NOW'];
  if (param.sort === 2) {
    queries['orderBy'] = 'PRICE_LOW_TO_HIGH';
  } else if (param.sort === 3) {
    queries['orderBy'] = 'PRICE_HIGH_TO_LOW';
  } else {
    queries['orderBy'] = 'RECENTLY_LISTED';
  }

  if (param.attributes && Object.keys(param.attributes).length > 0) {
    queries['traits'] = Object.keys(param.attributes).map(key => ({
      key: key,
      // @ts-ignore
      values: param.attributes[key],
    }));
  } else {
    queries['traits'] = [];
  }

  const result = {
    market: param.market,
    params: queries,
  };
  return result;
}
