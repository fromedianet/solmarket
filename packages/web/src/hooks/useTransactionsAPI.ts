import { ApiUtils } from '../utils/apiUtils';

export const useTransactionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * List NFT
   * @param params
   * @returns
   */
  async function callList(params: {
    transaction: string;
    seller: string;
    mint: string;
    symbol: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/list',
      JSON.stringify(params),
    );
    return result;
  }

  /**
   * Cancel list NFT
   * @param params
   * @returns
   */
  async function callCancelList(params: {
    transaction: string;
    seller: string;
    mint: string;
    symbol: string;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/cancelList',
      JSON.stringify(params),
    );
    return result;
  }

  /**
   * Place bid
   * @param params
   * @returns
   */
  async function callPlaceBid(params: {
    transaction: string;
    buyer: string;
    mint: string;
    symbol: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/placeBid',
      JSON.stringify(params),
    );
    return result;
  }

  /**
   * Cancel bid
   * @param params
   * @returns
   */
  async function callCancelBid(params: {
    transaction: string;
    buyer: string;
    mint: string;
    symbol: string;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/cancelBid',
      JSON.stringify(params),
    );
    return result;
  }

  /**
   * Sell NFT
   * @param params
   * @returns
   */
  async function callSell(params: {
    transaction: string;
    seller: string;
    buyer: string;
    mint: string;
    symbol: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/sell',
      JSON.stringify(params),
    );
    return result;
  }

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
    callList,
    callCancelList,
    callPlaceBid,
    callCancelBid,
    callSell,
    getTransactionsBySymbol,
    getTransactionsByMint,
  };
};
