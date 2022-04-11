import { Attribute, Creator } from '@oyster/common';

export interface ExCollection {
  name: string;
  description: string | null;
  symbol: string;
  banner?: string | null;
  thumbnail: string;
  discord?: string | null;
  twitter?: string | null;
  website?: string | null;
  market?: string;
  itemId?: string;
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
  mintAddress: string;
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
  animationURL: string | null;
  seller_fee_basis_points: number;
  attributes: Attribute[];
  creators: Creator[];
  price: number;
  collectionName: string;
  bookKeeper?: string | null;
  txType?: string | null;
};

export type NFTData = {
  title: string;
  content: string;
  img: string;
  animationURL?: string;
  price?: number;
  collectionName: string;
  collectionTitle: string;
  mintAddress: string;
  owner?: string;
  tokenAddress?: string;
  updateAuthority: string;
  externalURL?: string;
  propertyCategory: string;
  sellerFeeBasisPoints: number;
  supply: number;
  primarySaleHappened?: boolean;
  tokenDelegateValid?: boolean;
  attributes: Attribute[];
  creators: Creator[];
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
};
