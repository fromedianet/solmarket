import { WalletAdapter, WalletError } from '@solana/wallet-adapter-base';
import {
  useWallet,
  WalletProvider as BaseWalletProvider,
} from '@solana/wallet-adapter-react';
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
} from '@solana/wallet-adapter-wallets';
import { Button, Collapse } from 'antd';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { notify } from '../utils';
import { MetaplexModal } from '../components';

const { Panel } = Collapse;

export interface WalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

export const WalletModalContext = createContext<WalletModalContextState>(
  {} as WalletModalContextState,
);

export function useWalletModal(): WalletModalContextState {
  return useContext(WalletModalContext);
}

export const WalletModal: FC = () => {
  const { wallets, select } = useWallet();
  const { visible, setVisible } = useWalletModal();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showWallets, setShowWallets] = useState(false);
  const close = useCallback(() => {
    setVisible(false);
    setShowWallets(false);
  }, [setVisible, setShowWallets]);

  const phantomWallet = useMemo(() => getPhantomWallet(), []);
  const slopeWallet = useMemo(() => getSlopeWallet(), []);
  const solletWallet = useMemo(() => getSolletWallet(), []);
  const solflareWallet = useMemo(() => getSolflareWallet(), []);
  const ledgerWallet = useMemo(() => getLedgerWallet(), []);
  const solongWallet = useMemo(() => getSolongWallet(), []);
  const mathWallet = useMemo(() => getMathWallet(), []);

  const handleConnectWallet = (name: any) => {
    console.log('wallet name', name);
    select(name);
    close();
  };

  return (
    <MetaplexModal visible={visible} onCancel={close}>
      <div className="modal-top-content">
        <img src="/favicon.ico" alt="logo" className="logo" />
        <p className="text">Connect Wallet</p>
      </div>
      <div className="modal-btn-container">
        <Button
          className="wallet-adapter-btn"
          onClick={() => handleConnectWallet(phantomWallet.name)}
        >
          Phantom
          <img src={phantomWallet?.icon} className="end-icon" />
        </Button>
        <Collapse className="modal-collapse" expandIconPosition="right">
          <Panel header="Other Wallets" key="1">
            {wallets.map((wallet, index) => {
              if (wallet.name === 'Phantom') return null;
              return (
                <Button
                  key={index}
                  className="wallet-adapter-btn"
                  onClick={() => handleConnectWallet(wallet.name)}
                >
                  {wallet.name}
                  <img src={wallet?.icon} className="end-icon" />
                </Button>
              );
            })}
          </Panel>
        </Collapse>
      </div>
    </MetaplexModal>
  );
};

export const WalletModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { publicKey } = useWallet();
  const [connected, setConnected] = useState(!!publicKey);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      const keyToDisplay =
        base58.length > 20
          ? `${base58.substring(0, 7)}.....${base58.substring(
              base58.length - 7,
              base58.length,
            )}`
          : base58;

      notify({
        message: 'Wallet update',
        description: 'Connected to wallet ' + keyToDisplay,
      });
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey && connected) {
      notify({
        message: 'Wallet update',
        description: 'Disconnected from wallet',
      });
    }
    setConnected(!!publicKey);
  }, [publicKey, connected, setConnected]);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
      <WalletModal />
    </WalletModalContext.Provider>
  );
};

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      // getTorusWallet({
      //   options: {
      //     // @FIXME: this should be changed for Metaplex, and by each Metaplex storefront
      //     clientId:
      //       'BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ',
      //   },
      // }),
      getLedgerWallet(),
      getSolongWallet(),
      getMathWallet(),
      getSolletWallet(),
    ],
    [],
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
    notify({
      message: 'Wallet error',
      description: error.message,
    });
  }, []);

  return (
    <BaseWalletProvider wallets={wallets} onError={onError} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </BaseWalletProvider>
  );
};

export type WalletSigner = Pick<
  WalletAdapter,
  'publicKey' | 'signTransaction' | 'signAllTransactions'
>;
