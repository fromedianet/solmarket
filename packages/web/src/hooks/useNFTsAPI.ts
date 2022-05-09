import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { QUERIES } from '../models/exCollection';
import { ApiUtils } from '../utils/apiUtils';

export const useNFTsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Create new NFT when mint NFT manually
   * @param props
   */
  async function createNft(metadataAddress: string) {
    const result = await runAPI(
      true,
      'post',
      '/nfts/create',
      JSON.stringify({ metadataAddress }),
    );
    return result;
  }

  /**
   * Get listed nfts by query
   * @param props
   * @returns
   */
  async function getListedNftsByQuery(param: QUERIES) {
    const pcQuery = getQueryPrameter(param);
    const meQuery = getQueryParameterForMagicEden(param);
    const queryBody = {
      pcQuery: pcQuery,
      meQuery: meQuery,
      sort: param.sort,
    };
    const result = await runAPI(
      false,
      'post',
      '/nfts/getListedNftsByQuery',
      JSON.stringify(queryBody),
    );
    return result;
  }

  function getQueryPrameter(param: QUERIES) {
    if (param.type === 2) return null;
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

  /**
   * Get NFT by mint address
   * @param mint
   * @returns
   */
  async function getNftByMint(mint: string) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getNftByMint',
      JSON.stringify({ mint }),
    );
    return result;
  }

  /**
   * Get NFTs by wallet
   * @returns
   */
  async function getNFTsByWallet(wallet: string) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getNFTsByWallet',
      JSON.stringify({ wallet }),
    );
    return result;
  }

  async function updateInfo(params: {
    mint: string;
    tokenAddress: string;
    owner: string;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/updateInfo',
      JSON.stringify(params),
    );
    return result;
  }

  return {
    createNft,
    getListedNftsByQuery,
    getNftByMint,
    getNFTsByWallet,
    updateInfo,
  };
};
