export type WalletStates = Array<[Wallets, boolean]>;

export enum Wallets {
  none = "none",
  phantom = "phantom",
}

export type PendingTx = { amount: number; hash: string } | null;
export type State = {
  activeWallet: Wallets;
  isLoading: boolean;
  pending_tx: PendingTx;
};