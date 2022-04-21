export interface Offer {
  mint: string;
  metadata: string;
  tradeState: string;
  tokenAccount: string;
  buyer: string;
  bidPrice: number;
  listingPrice: number;
  tokenSize: number;
  txType: string;
  createdAt: string;
  nftCreators: any[];
  market?: string;
}
