import { ApiUtils } from '../utils/apiUtils';

export const useInstructionsAPI = () => {
  const { runAPI } = ApiUtils();

  /**
   * Get instructions to buyNow on a NFT
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

  /**
   * Get instructions to list on a NFT
   *
   * @param props
   * @returns
   */
  async function list(props: {
    seller: string;
    auctionHouseAddress: string;
    tokenMint: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/list',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to cancelList on a NFT
   *
   * @param props
   * @returns
   */
  async function cancelList(props: {
    seller: string;
    auctionHouseAddress: string;
    tokenMint: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/cancelList',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to placeBid on a NFT
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
   * Get instructions to cancelBid on a NFT
   *
   * @param props
   * @returns
   */
  async function cancelBid(props: {
    buyer: string;
    auctionHouseAddress: string;
    tokenMint: string;
    tokenAccount: string;
    tradeState: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/cancelBid',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to cancelBidAndWithdraw on a NFT
   *
   * @param props
   * @returns
   */
  async function cancelBidAndWithdraw(props: {
    buyer: string;
    auctionHouseAddress: string;
    tokenMint: string;
    tokenAccount: string;
    tradeState: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/cancelBidAndWithdraw',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to acceptOffer on a NFT
   *
   * @param props
   * @returns
   */
  async function acceptOffer(props: {
    buyer: string;
    seller: string;
    auctionHouseAddress: string;
    tokenMint: string;
    tokenAccount: string;
    metadata: string;
    bidPrice: number;
    listPrice: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/acceptOffer',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to deposit
   *
   * @param props
   * @returns
   */
  async function deposit(props: {
    pubkey: string;
    auctionHouseAddress: string;
    amount: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/deposit',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to withdraw
   *
   * @param props
   * @returns
   */
  async function withdraw(props: {
    pubkey: string;
    auctionHouseAddress: string;
    amount: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/withdraw',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to withdraw from fee
   *
   * @param props
   * @returns
   */
  async function withdrawFromFee(props: {
    pubkey: string;
    auctionHouseAddress: string;
    amount: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/withdrawFromFee',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to withdraw from treasury
   *
   * @param props
   * @returns
   */
  async function withdrawFromTreasury(props: {
    pubkey: string;
    auctionHouseAddress: string;
    amount: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/withdrawFromTreasury',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to buyNow on MagicEden
   *
   * @param props
   * @returns
   */
  async function buyNowME(props: {
    buyer: string;
    seller: string;
    auctionHouseAddress: string;
    tokenMint: string;
    escrowPubkey: string;
    expiry: number;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/buyNowME',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get instructions to placeBid on MagicEden
   *
   * @param props
   * @returns
   */
  async function placeBidME(props: {
    buyer: string;
    auctionHouseAddress: string;
    tokenMint: string;
    price: number;
  }) {
    const result = await runAPI(
      false,
      'post',
      '/instructions/placeBidME',
      JSON.stringify(props),
    );
    return result;
  }

  return {
    buyNow,
    list,
    cancelList,
    placeBid,
    cancelBid,
    cancelBidAndWithdraw,
    acceptOffer,
    deposit,
    withdraw,
    withdrawFromFee,
    withdrawFromTreasury,
    buyNowME,
    placeBidME,
  };
};
