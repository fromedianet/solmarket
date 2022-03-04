import { Attribute, Creator } from '@oyster/common';

export interface ExCollection {
  name: string;
  description: string | undefined;
  symbol: string;
  banner?: string | undefined;
  thumbnail: string;
  discord?: string | undefined;
  twitter?: string | undefined;
  website?: string | undefined;
  createdAt?: string | number | undefined;
  market: string;
}

export type ExAttribute = {
  key: string;
  numbers: ExAttrValue[];
};

export type ExAttrValue = {
  value: string;
  amount?: number | undefined;
  floor?: number | undefined;
};

export type ExCollectionStats = {
  floorPrice?: number | undefined;
  volume?: number | undefined;
  listedCount?: number | undefined;
};

export type ExNFT = {
  mintAddress: string;
  pk?: string;
  name: string;
  image: string;
  collection: string;
  price?: number;
};

export type NFTData = {
  title: string;
  content: string;
  img: string;
  animationURL?: string;
  price?: number;
  collectionName?: string;
  collectionTitle?: string;
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
  transaction: string;
  price: number;
  txType: string;
};
