import { ApiUtils } from '../utils/apiUtils';

export const useTransactionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Listing NFT
   * @param params 
   * @returns 
   */
  async function listing(params: {
    transaction: string,
    seller: string,
    mint: string,
    symbol: string,
    price: number
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/listing',
      JSON.stringify(params),
    );
    return result;
  }

  /**
   * Cancel listing NFT
   * @param params 
   * @returns 
   */
  async function cancelListing(params: {
    transaction: string,
    seller: string,
    mint: string,
    symbol: string,
  }) {
    const result = await runAPI(
      false,
      'post',
      '/transactions/cancelListing',
      JSON.stringify(params),
    );
    return result;
  }

  /**
   * Place bid
   * @param params 
   * @returns 
   */
  async function placeBid(params: {
    transaction: string,
    buyer: string,
    mint: string,
    symbol: string,
    price: number
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
  async function cancelBid(params: {
    transaction: string,
    buyer: string,
    mint: string,
    symbol: string,
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
  async function sell(params: {
    transaction: string,
    seller: string,
    buyer: string,
    mint: string,
    symbol: string,
    price: number
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
    listing,
    cancelListing,
    placeBid,
    cancelBid,
    sell,
    getTransactionsBySymbol,
    getTransactionsByMint,
  };
};
