import { WRAPPED_SOL_MINT } from '@oyster/common';
import { clusterApiUrl, Connection } from '@solana/web3.js';

export * from './labels';
export * from './apis';

export const QUOTE_MINT = WRAPPED_SOL_MINT;
export const MINIMUM_SAFE_FEE_AUCTION_CREATION = 0.06; //sol
export const MAX_PACKS_CREATION_COUNT = 100;
export const ME_AUCTION_HOUSE_ID =
  'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe';

export enum MarketType {
  All = 'all',
  PaperCity = 'papercity',
  MagicEden = 'magiceden',
  Solanart = 'solanart',
  DigitalEyes = 'digital_eyes',
  AlphaArt = 'alpha_art',
}

export const meConnection = new Connection(
  clusterApiUrl('mainnet-beta'),
  'finalized',
);
