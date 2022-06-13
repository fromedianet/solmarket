import { StringPublicKey } from "../utils/ids";

export enum MetadataCategory {
  Audio = "audio",
  Video = "video",
  Image = "image",
  VR = "vr",
  HTML = "html",
}

export type MetadataFile = {
  uri: string;
  type: string;
};

export type Attribute = {
  trait_type?: string;
  display_type?: string;
  value: string | number;
};

export type Collection = {
  key: StringPublicKey;
  verified: number;
};

export class Creator {
  address: StringPublicKey;
  verified: boolean;
  share: number;

  constructor(args: {
    address: StringPublicKey;
    verified: boolean;
    share: number;
  }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

export interface IMetadataExtension {
  name: string;
  symbol: string;
  collection: string;
  creators: Creator[] | null;
  description: string;
  // preview image absolute URI
  image: string;
  animation_url?: string;

  attributes?: Attribute[];

  // stores link to item on meta
  external_url: string;

  seller_fee_basis_points: number;

  properties: {
    files?: FileOrString[];
    category: MetadataCategory;
    maxSupply?: number;
    creators?: {
      address: string;
      shares: number;
    }[];
  };
}

export type FileOrString = MetadataFile | string;
