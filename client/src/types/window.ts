import { Window as KeplrWindow } from "@keplr-wallet/types";

export interface Phantom {
  solana?: any;
}

export interface DWindow extends KeplrWindow {
  phantom: Phantom;
}
