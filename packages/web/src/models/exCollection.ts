export interface ExCollection {
  name: string;
  description: string | undefined;
  symbol: string;
  image: string;
  thumbnail: string;
  discord?: string | undefined;
  twitter?: string | undefined;
  website?: string | undefined;
  createdAt?: string | number | undefined;
  market: string;
}
