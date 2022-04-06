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

  return {
    getTransactionsBySymbol,
    getTransactionsByMint,
  };
};
