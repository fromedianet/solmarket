import { ApiUtils } from '../utils/apiUtils';

export const useTransactionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Get transactions by symbol
   * @param params
   * @returns
   */
  async function getTransactionsBySymbol(symbol: string): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/transactions/getTransactionsBySymbol',
      JSON.stringify({ symbol }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get transactions by mint
   * @param params
   * @returns
   */
  async function getTransactionsByMint(mint: string): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/transactions/getTransactionsByMint',
      JSON.stringify({ mint }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get transactions by wallet
   * @param params
   * @returns
   */
  async function getTransactionsByWallet(wallet: string): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/transactions/getTransactionsByWallet',
      JSON.stringify({ wallet }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get offers made
   * @param params
   * @returns
   */
  async function getOffersMade(wallet: string): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/audits/getOffersMade',
      JSON.stringify({ wallet }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get offers received
   * @param params
   * @returns
   */
  async function getOffersReceived(wallet: string): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/audits/getOffersReceived',
      JSON.stringify({ wallet }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  async function getOffersByMints(params: {
    mints: string[];
    owner: string;
  }): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/audits/getOffersByMints',
      JSON.stringify(params),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  return {
    getTransactionsBySymbol,
    getTransactionsByMint,
    getTransactionsByWallet,
    getOffersMade,
    getOffersReceived,
    getOffersByMints,
  };
};
