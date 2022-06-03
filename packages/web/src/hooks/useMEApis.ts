/* eslint-disable no-empty */
import { MarketType } from '../constants';
import { QUERIES } from '../models/exCollection';
import { ApiUtils } from '../utils/apiUtils';

export const useMEApis = () => {
  const { runOthersAPI } = ApiUtils();

  async function getFeaturedCollections(): Promise<any[]> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: '/getFeaturedCollections',
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getAllCollections(): Promise<any[]> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: '/getAllCollections',
        useCache: true,
      });
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
      const result: any = await runOthersAPI({
        method: 'post',
        url: '/getPopularCollections',
        data: JSON.stringify(params),
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getNewCollections(more?: boolean): Promise<any[]> {
    try {
      const result: any = await runOthersAPI({
        method: 'post',
        url: '/getNewCollections',
        data: JSON.stringify({ more }),
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getCollection(symbol: string, market: string): Promise<any> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: `/getCollection/${market}/${symbol}`,
        useCache: true,
      });
      return result;
    } catch {}

    return null;
  }

  async function getCollectionBySymbol(symbol: string): Promise<any> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: `/getCollectionBySymbol/${symbol}`,
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  async function getCollectionEscrowStats(symbol: string): Promise<any> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: `/getCollectionEscrowStats/${symbol}`,
        useCache: true,
      });
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
      const result: any = await runOthersAPI({
        method: 'post',
        url: '/getMultiCollectionEscrowStats',
        data: JSON.stringify({ symbols }),
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return {};
  }

  async function getListedNftsByQuery(
    queries: QUERIES,
    market: string,
  ): Promise<any[]> {
    const params = getQueryParameter(queries, market);
    if (params) {
      try {
        const result: any = await runOthersAPI({
          method: 'post',
          url: '/getListedNftsByQuery',
          data: JSON.stringify(params),
          useCache: true,
        });
        if ('data' in result) {
          return result['data'];
        }
      } catch {}
    }
    return [];
  }

  async function getNFTByMintAddress(
    mint: string,
    market: string,
  ): Promise<any> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: `/getNFTByMintAddress/${market}/${mint}`,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  async function getNFTsByEscrowOwner(wallet: string): Promise<any[]> {
    try {
      const result: any = await runOthersAPI({
        method: 'get',
        url: `/getNFTsByEscrowOwner/${wallet}`,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getTransactionsBySymbol(
    symbol: string,
    market: string,
  ): Promise<any[]> {
    try {
      let params;
      if (market === MarketType.MagicEden) {
        const queryData = {
          txType: {
            $in: ['exchange'],
          },
          $match: { collection_symbol: symbol },
          $sort: { blockTime: -1, createdAt: -1 },
          $skip: 0,
        };
        params = `?q=${encodeURI(JSON.stringify(queryData))}`;
      } else if (market === MarketType.Solanart) {
        params = `/nft/get-collection-transactions?network=mainnet&solana_nft_collection_api_id=snftcol-LjHSKp6nS627wIm&symbol=${symbol}`;
      } else if (market === MarketType.DigitalEyes) {
        params = `?collection=${encodeURI(symbol)}&type=SALE`;
      } else if (market === MarketType.AlphaArt) {
        params = `/collection/${symbol}?trading_types=1&no_foreign_listing=true`;
      } else {
        return [];
      }

      const result: any = await runOthersAPI({
        method: 'post',
        url: '/getGlobalActivitiesByQuery',
        data: JSON.stringify({ params, market }),
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getTransactionsByMint(
    mint: string,
    market: string,
  ): Promise<any[]> {
    try {
      let params;
      if (market === MarketType.MagicEden) {
        const queryData = {
          $match: { mint: mint },
          $sort: { blockTime: -1, createdAt: -1 },
          $skip: 0,
        };
        params = `?q=${encodeURI(JSON.stringify(queryData))}`;
      } else if (market === MarketType.Solanart) {
        params = `/wallet/get-transactions?address=${mint}&network=mainnet`;
      } else if (market === MarketType.DigitalEyes) {
        params = `?mint=${mint}&type=SALE`;
      } else if (market === MarketType.AlphaArt) {
        params = `/token/${mint}?trading_types=2%2C1%2C3&no_foreign_listing=true`;
      } else {
        return [];
      }

      const result: any = await runOthersAPI({
        method: 'post',
        url: '/getGlobalActivitiesByQuery',
        data: JSON.stringify({ params, market }),
        useCache: true,
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getTransactionsByWallet(wallet: string): Promise<any[]> {
    try {
      const queryData = {
        $match: {
          $or: [{ seller_address: wallet }, { buyer_address: wallet }],
        },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      const params = `?q=${encodeURI(JSON.stringify(queryData))}`;
      const result: any = await runOthersAPI({
        method: 'post',
        url: '/getGlobalActivitiesByQuery',
        data: JSON.stringify({ params, market: MarketType.MagicEden }),
        useCache: true,
      });
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
    getCollection,
    getCollectionBySymbol,
    getCollectionEscrowStats,
    getMultiCollectionEscrowStats,
    getListedNftsByQuery,
    getNFTByMintAddress,
    getNFTsByEscrowOwner,
    getTransactionsByMint,
    getTransactionsBySymbol,
    getTransactionsByWallet,
  };
};

function getQueryParameter(param: QUERIES, market: string) {
  if (
    market === MarketType.Solanart &&
    (param.type === MarketType.All || param.type === MarketType.Solanart)
  ) {
    let queries = '?collection=' + param.symbol;
    queries += '&listed=true&fits=any&bid=all';
    queries += '&page=' + (param.skip ? param.skip : 0);
    queries += '&limit=20';
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
      market: market,
      params: encodeURI(queries),
    };

    return result;
  } else if (
    market === MarketType.DigitalEyes &&
    (param.type === MarketType.All || param.type === MarketType.DigitalEyes)
  ) {
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
      market: market,
      params: encodeURI(queries),
    };

    return result;
  } else if (
    market === MarketType.AlphaArt &&
    (param.type === MarketType.All || param.type === MarketType.AlphaArt)
  ) {
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
      market: market,
      params: queries,
    };
    return result;
  }
}
