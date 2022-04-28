export interface Offer {
  name: string;
  image: string;
  symbol: string;
  mint: string;
  tokenAccount: string;
  bidPrice: number;
  listingPrice: number;
  buyer: string;
  seller?: string;
  tradeState?: string;
  escrowPubkey?: string;
  auctionHouseKey?: string;
  createdAt: string;
  market?: string;
}
