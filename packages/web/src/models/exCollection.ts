import { Attribute, Creator } from '@oyster/common';

export interface ExCollection {
  _id: string;
  name: string;
  description: string | null;
  symbol: string;
  banner?: string | null;
  image: string;
  discord: string;
  twitter: string;
  website?: string | null;
  market?: string;
  itemId?: string;
  createdAt: string;
  type?: string;
}

export type ExAttribute = {
  key: string;
  numbers: ExAttrValue[];
};

export type ExAttrValue = {
  value: string;
  amount?: number | null;
  floor?: number | null;
};

export type ExCollectionStats = {
  floorPrice?: number;
  totalVolume?: number;
  listedCount?: number;
  listedTotalValue?: number;
};

export type ExNFT = {
  mint: string;
  pk?: string;
  name: string;
  image: string;
  collection?: string;
  price?: number;
};

export type NFT = {
  mint: string;
  owner: string;
  tokenAddress: string;
  metadataAddress: string;
  name: string;
  symbol: string;
  description: string | null;
  image: string;
  animationURL?: string;
  externalURL?: string;
  seller_fee_basis_points: number;
  attributes: Attribute[];
  creators: Creator[];
  price: number;
  collectionName: string;
  bookKeeper?: string | null;
  escrowPubkey?: string | null;
  txType?: string | null;
  market?: string | null;
  v2?: V2 | null;
};

export type Transaction = {
  key: string;
  name: string;
  image: string;
  blockTime: number;
  buyer: string | null;
  collection: string;
  mint: string;
  seller: string | null;
  transaction: string | null;
  price: number | undefined;
  txType: string;
  market?: string;
};

export type V2 = {
  auctionHouseKey: string;
  expiry: number;
  sellerReferral: string;
};

export type QUERIES = {
  symbol: string;
  type: number; // 0: All, 1: PaperCity, 2: MagicEden
  sort: number;
  status?: boolean;
  searchKey?: string;
  attributes?: {};
  min?: number;
  max?: number;
  skip?: number;
  limit?: number;
  cursor?: number;
};
