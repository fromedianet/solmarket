/* eslint-disable no-empty */
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { MarketType } from '../constants';
import { QUERIES } from '../models/exCollection';
import { ApiUtils } from '../utils/apiUtils';

export const useNFTsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Create new NFT when mint NFT manually
   * @param props
   */
  async function createNft(metadataAddress: string): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: 'post',
        url: '/nfts/create',
        data: JSON.stringify({ metadataAddress }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  /**
   * Get listed nfts by query
   * @param props
   * @returns
   */
  async function getListedNftsByQuery(param: QUERIES) {
    try {
      const pcQuery = getQueryPrameter(param);
      const meQuery = getQueryParameterForMagicEden(param);
      const queryBody = {
        pcQuery: pcQuery,
        meQuery: meQuery,
        sort: param.sort,
      };
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/nfts/getListedNftsByQuery',
        data: JSON.stringify(queryBody),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}
    return [];
  }

  function getQueryPrameter(param: QUERIES) {
    if (param.type !== MarketType.All && param.type !== MarketType.PaperCity)
      return null;
    const queries = {
      skip: param.skip ? param.skip : 0,
      limit: 20,
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

    return JSON.stringify(queries);
  }

  function getQueryParameterForMagicEden(param: QUERIES) {
    if (param.type !== MarketType.All && param.type !== MarketType.MagicEden)
      return null;
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

  /**
   * Get NFT by mint address
   * @param mint
   * @returns
   */
  async function getNftByMint(mint: string): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/nfts/getNftByMint',
        data: JSON.stringify({ mint }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  /**
   * Get NFTs by wallet
   * @returns
   */
  async function getNFTsByWallet(wallet: string): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/nfts/getNFTsByWallet',
        data: JSON.stringify({ wallet }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function updateInfo(params: {
    mint: string;
    tokenAddress: string;
    owner: string;
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/nfts/updateInfo',
        data: JSON.stringify(params),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  return {
    createNft,
    getListedNftsByQuery,
    getNftByMint,
    getNFTsByWallet,
    updateInfo,
  };
};
