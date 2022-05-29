/* eslint-disable no-empty */
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/buyNow',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/list',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/cancelList',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/placeBid',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/cancelBid',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
    bidPrice: number;
    listPrice: number;
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/acceptOffer',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/deposit',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/withdraw',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/withdrawFromFee',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/withdrawFromTreasury',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
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
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/buyNowME',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}

    return null;
  }

  /**
   * Get AuctionHouse object
   *
   * @param auctionHouseAddress
   * @returns
   */
  async function getAuctionHouse(props: {
    auctionHouseAddress: string;
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: 'post',
        url: '/instructions/getAuctionHouse',
        data: JSON.stringify(props),
      });
      if ('data' in result) {
        return result['data'];
      }
    } catch {}
    return null;
  }

  return {
    buyNow,
    list,
    cancelList,
    placeBid,
    cancelBid,
    acceptOffer,
    deposit,
    withdraw,
    withdrawFromFee,
    withdrawFromTreasury,
    buyNowME,
    getAuctionHouse,
  };
};
