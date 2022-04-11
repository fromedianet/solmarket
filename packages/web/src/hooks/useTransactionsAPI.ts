import { ApiUtils } from '../utils/apiUtils';

export const useTransactionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Get transactions by symbol
   * @param params
   * @returns
   */
  async function getTransactionsBySymbol(symbol: string) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/getTransactionsBySymbol',
      JSON.stringify({ symbol }),
    );
    return result;
  }

  /**
   * Get transactions by mint
   * @param params
   * @returns
   */
  async function getTransactionsByMint(mint: string) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/getTransactionsByMint',
      JSON.stringify({ mint }),
    );
    return result;
  }

  /**
   * Get transactions by mint
   * @param params
   * @returns
   */
  async function getTransactionsByWallet(wallet: string) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/getTransactionsByWallet',
      JSON.stringify({ wallet }),
    );
    return result;
  }

  /**
   * Get offers made
   * @param params
   * @returns
   */
  async function getOffersMade(wallet: string) {
    const result = await runAPI(
      false,
      'post',
      '/audits/getOffersMade',
      JSON.stringify({ wallet }),
    );
    return result;
  }

  /**
   * Get offers received
   * @param params
   * @returns
   */
  async function getOffersReceived(wallet: string) {
    const result = await runAPI(
      false,
      'post',
      '/audits/getOffersReceived',
      JSON.stringify({ wallet }),
    );
    return result;
  }

  return {
    getTransactionsBySymbol,
    getTransactionsByMint,
    getTransactionsByWallet,
    getOffersMade,
    getOffersReceived,
  };
};
