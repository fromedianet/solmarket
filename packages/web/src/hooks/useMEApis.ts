/* eslint-disable no-empty */
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { QUERIES } from '../models/exCollection';
import { ApiUtils } from '../utils/apiUtils';

export const useMEApis = () => {
  const { runOthersAPI } = ApiUtils();

  async function getFeaturedCollections(): Promise<any[]> {
    try {
      const result: any = await runOthersAPI('get', '/getFeaturedCollections');
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getAllCollections(): Promise<any[]> {
    try {
      const result: any = await runOthersAPI('get', '/getAllCollections');
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getPopularCollections(params: {
    more?: boolean;
    timeRange: string;
  }): Promise<any[]> {
    try {
      const result: any = await runOthersAPI(
        'post',
        '/getPopularCollections',
        JSON.stringify(params),
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getNewCollections(more?: boolean): Promise<any[]> {
    try {
      const result: any = await runOthersAPI(
        'post',
        '/getNewCollections',
        JSON.stringify({ more }),
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getCollectionBySymbol(symbol: string): Promise<any> {
    try {
      const result: any = await runOthersAPI(
        'get',
        `/getCollectionBySymbol/${symbol}`,
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  async function getCollectionEscrowStats(symbol: string): Promise<any> {
    try {
      const result: any = await runOthersAPI(
        'get',
        `/getCollectionEscrowStats/${symbol}`,
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  async function getMultiCollectionEscrowStats(
    symbols: string[],
  ): Promise<any> {
    try {
      const result: any = await runOthersAPI(
        'post',
        '/getMultiCollectionEscrowStats',
        JSON.stringify({ symbols }),
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return {};
  }

  async function getListedNftsByQuery(queries: QUERIES): Promise<any[]> {
    const params = getQueryParameterForMagicEden(queries);
    if (params) {
      try {
        const result: any = await runOthersAPI(
          'post',
          '/getListedNftsByQuery',
          JSON.stringify({ params }),
        );
        if ('data' in result) {
          return result['data'];
        }
      } catch {}
    }
    return [];
  }

  async function getNFTByMintAddress(mint: string): Promise<any> {
    try {
      const result: any = await runOthersAPI(
        'get',
        `/getNFTByMintAddress/${mint}`,
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  async function getNFTsByEscrowOwner(wallet: string): Promise<any[]> {
    try {
      const result: any = await runOthersAPI(
        'get',
        `/getNFTsByEscrowOwner/${wallet}`,
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getTransactionsBySymbol(symbol: string): Promise<any[]> {
    try {
      const queryData = {
        txType: {
          $in: ['exchange'],
        },
        $match: { collection_symbol: symbol },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      const params = `?q=${encodeURI(JSON.stringify(queryData))}`;
      const result: any = await runOthersAPI(
        'post',
        '/getGlobalActivitiesByQuery',
        JSON.stringify({ params }),
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getTransactionsByMint(mint: string): Promise<any[]> {
    try {
      const queryData = {
        $match: { mint: mint },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      const params = `?q=${encodeURI(JSON.stringify(queryData))}`;
      const result: any = await runOthersAPI(
        'post',
        '/getGlobalActivitiesByQuery',
        JSON.stringify({ params }),
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  return {
    getFeaturedCollections,
    getAllCollections,
    getPopularCollections,
    getNewCollections,
    getCollectionBySymbol,
    getCollectionEscrowStats,
    getMultiCollectionEscrowStats,
    getListedNftsByQuery,
    getNFTByMintAddress,
    getNFTsByEscrowOwner,
    getTransactionsByMint,
    getTransactionsBySymbol,
  };
};

function getQueryParameterForMagicEden(param: QUERIES) {
  if (param.type === 1) return null;
  const queries = {
    $skip: param.skip ? param.skip : 0,
    $limit: 20,
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

  return encodeURI(queryStr);
}
