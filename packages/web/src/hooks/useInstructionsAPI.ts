import { ApiUtils } from '../utils/apiUtils';

export const useInstructionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Get instruction to placeBid on a NFT
   *
   * @param props
   * @returns
   */
  async function placeBid(props: {
    buyer: string;
    seller: string;
    auctionHouseAddress: string;
    tokenMint: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/placeBid',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instruction to buyNow on a NFT
   *
   * @param props
   * @returns
   */
   async function buyNow(props: {
    buyer: string;
    seller: string;
    auctionHouseAddress: string;
    tokenMint: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/buyNow',
      JSON.stringify(props),
    );
    return result;
  }

  return { placeBid, buyNow };
};
