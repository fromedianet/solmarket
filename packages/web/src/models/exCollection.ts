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
  key: string,
  numbers: ExAttrValue[],
}

export type ExAttrValue = {
  value: string,
  amount?: number | undefined,
  floor?: number | undefined,
}

export type ExCollectionStats = {
  floorPrice?: number | undefined,
  volume?: number | undefined,
  listedCount? : number | undefined,
}

export interface ExNFT {
  mintAddress: string,
  pk?: string,
  name: string,
  image: string,
  collection: string,
  price?: number,
}
