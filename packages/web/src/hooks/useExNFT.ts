import { ApiUtils } from '../utils/apiUtils';
import { MarketType } from '../constants';

export const useExNFT = () => {
  const { runOthersAPI } = ApiUtils();

  async function getExNFTByMintAddress(mint: string, price?: number) {
    try {
      const result: any = await runOthersAPI('get', `/exnft/${mint}`);
      if (result && 'data' in result) {
        if (price && result['data']['price'] === 0) {
          result['data']['price'] = price;
        }
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async function getExTransactions(mint: string, market: string) {
    const queryBody = { market: market };
    if (market === MarketType.MagicEden) {
      const query = {
        $match: { mint: mint },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      queryBody['params'] = `?q=${encodeURI(JSON.stringify(query))}`;
    } else if (market === MarketType.Solanart) {
      queryBody['params'] = `?address=${mint}`;
    } else if (market === MarketType.DigitalEyes) {
      queryBody['params'] = `?mint=${mint}`;
    } else if (market === MarketType.AlphaArt) {
      queryBody[
        'params'
      ] = `${mint}?trading_types=2%2C1%2C3&no_foreign_listing=true`;
    }

    try {
      const result: any = await runOthersAPI(
        'post',
        '/exnft/transactions',
        JSON.stringify(queryBody),
      );
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function getExNFTsByOwner(wallet: string, market: string) {
    try {
      const result: any = await runOthersAPI(
        'get',
        `/getNFTsByOwner/${market}/${wallet}`,
      );
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function getExNFTsByEscrowOwner(wallet: string, market: string) {
    try {
      const result: any = await runOthersAPI(
        'get',
        `/getNFTsByEscrowOwner/${market}/${wallet}`,
      );
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function getExGlobalActivities(wallet: string, market: string) {
    const queryBody = { market: market };
    const query = {
      $match: {
        $or: [{ seller_address: wallet }, { buyer_address: wallet }],
      },
      $sort: { blockTime: -1, createdAt: -1 },
      $skip: 0,
    };
    queryBody['params'] = `?q=${encodeURI(JSON.stringify(query))}`;

    try {
      const result: any = await runOthersAPI(
        'post',
        '/globalActivities',
        JSON.stringify(queryBody),
      );
      if (result && 'data' in result) {
        return result['data'];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  return {
    getExNFTByMintAddress,
    getExTransactions,
    getExNFTsByOwner,
    getExNFTsByEscrowOwner,
    getExGlobalActivities,
  };
};
