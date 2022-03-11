import {
  AccountsProvider,
  ConnectionProvider,
  StoreProvider,
  WalletProvider,
  MetaProvider,
} from '@oyster/common';
import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ConfettiProvider } from './components/Confetti';
import { AppLayout } from './components/Layout';
import { LoaderProvider } from './components/Loader';
import { CoingeckoProvider } from './contexts/coingecko';
import SidebarProvider from './contexts/sidebar';
import { SPLTokenListProvider } from './contexts/tokenList';

export const Providers: FC = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      {isDashboard ? (
        children
      ) : (
        <ConnectionProvider>
          <WalletProvider>
            <AccountsProvider>
              <SPLTokenListProvider>
                <CoingeckoProvider>
                  <StoreProvider
                    ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
                    storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
                  >
                    <MetaProvider>
                      <LoaderProvider>
                        <ConfettiProvider>
                          <SidebarProvider>
                            <AppLayout>{children}</AppLayout>
                          </SidebarProvider>
                        </ConfettiProvider>
                      </LoaderProvider>
                    </MetaProvider>
                  </StoreProvider>
                </CoingeckoProvider>
              </SPLTokenListProvider>
            </AccountsProvider>
          </WalletProvider>
        </ConnectionProvider>
      )}
    </>
  );
};
