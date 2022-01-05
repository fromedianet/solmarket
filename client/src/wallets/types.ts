import { ReactNode } from "react";

export type Props = {
  children: ReactNode;
};
export type State = {
  loading: boolean;
  connected: boolean;
  balance: number;
  address: string;
  provider: any | null;
};
export type Setters = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};
