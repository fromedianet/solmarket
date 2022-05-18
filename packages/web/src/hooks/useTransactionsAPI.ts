/* eslint-disable no-empty */
import { ApiUtils } from '../utils/apiUtils';

export const useTransactionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Get transactions by symbol
   * @param params
   * @returns
   */
  async function getTransactionsBySymbol(symbol: string): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/transactions/getTransactionsBySymbol',
        data: JSON.stringify({ symbol }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  /**
   * Get transactions by mint
   * @param params
   * @returns
   */
  async function getTransactionsByMint(mint: string): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/transactions/getTransactionsByMint',
        data: JSON.stringify({ mint }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  /**
   * Get transactions by wallet
   * @param params
   * @returns
   */
  async function getTransactionsByWallet(wallet: string): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/transactions/getTransactionsByWallet',
        data: JSON.stringify({ wallet }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  /**
   * Get offers made
   * @param params
   * @returns
   */
  async function getOffersMade(wallet: string): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/audits/getOffersMade',
        data: JSON.stringify({ wallet }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  /**
   * Get offers received
   * @param params
   * @returns
   */
  async function getOffersReceived(wallet: string): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/audits/getOffersReceived',
        data: JSON.stringify({ wallet }),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return [];
  }

  async function getOffersByMints(params: {
    mints: string[];
    owner: string;
  }): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/audits/getOffersByMints',
        data: JSON.stringify(params),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

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
