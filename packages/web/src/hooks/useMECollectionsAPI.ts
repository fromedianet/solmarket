import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { QUERIES } from "../models/exCollection";
import { ApiUtils } from "../utils/apiUtils"

export const useMECollectionsAPI = () => {
  const { runOthersAPI } = ApiUtils();

  async function getNewCollections(params: { market: string; more?: boolean }) {
    try {
      const result: any = await runOthersAPI(
        'post',
        '/new_collections',
        JSON.stringify(params),
      );
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function getPopularCollections(params: {
    market: string;
    timeRange: string;
    more?: boolean;
  }) {
    try {
      const result: any = await runOthersAPI(
        'post',
        '/popular_collections',
        JSON.stringify(params),
      );
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function getAllCollections(market: string) {
    try {
      const result: any = await runOthersAPI('get', `/excollections/${market}`);
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function getMECollectionBySymbol(market: string, symbol: string) {
    try {
      const result = await runOthersAPI('get', `/excollections/${market}/${encodeURI(symbol)}`);
      return result;
    } catch (e) {
      console.error(e);
    }
    return {};
  }

  async function getMEListedNFTsByCollection(param: QUERIES) {
    const queryBody = getParamsForMagicEden(param);
    try {
      const result: any = await runOthersAPI('post', '/excollections/list', JSON.stringify(queryBody));
      if ('data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  const PER_PAGE = 20;
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

  async function getMETransactionsBySymbol(param: QUERIES) {
    const query = {
      $match: { collection_symbol: param.symbol },
      $sort: { blockTime: -1, createdAt: -1 },
      $skip: 0,
    };
    const queryBody = {
      market: param.market,
      params: encodeURI(`?q=${JSON.stringify(query)}`)
    };

    try {
      const result: any = await runOthersAPI(
        'post',
        '/excollections/transactions',
        JSON.stringify(queryBody),
      );
      if ('data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  return {
    getAllCollections,
    getPopularCollections,
    getNewCollections,
    getMECollectionBySymbol,
    getMEListedNFTsByCollection,
    getMETransactionsBySymbol,
  };
}