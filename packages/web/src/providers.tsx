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
import { AuthProvider } from './contexts/authProvider';
import SidebarProvider from './contexts/sidebar';
import { SocketProvider } from './contexts/socketProvider';
import { DashboardLayout } from './views/dashboard';

export const Providers: FC = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {isDashboard ? (
        <ConnectionProvider>
          <WalletProvider>
            <AuthProvider>
              <DashboardLayout>{children}</DashboardLayout>
            </AuthProvider>
          </WalletProvider>
        </ConnectionProvider>
      ) : (
        <ConnectionProvider>
          <WalletProvider>
            <AccountsProvider>
              <StoreProvider
                ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
                storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
              >
                <MetaProvider>
                  <AuthProvider>
                    <LoaderProvider>
                      <ConfettiProvider>
                        <SidebarProvider>
                          <SocketProvider>
                            <AppLayout>{children}</AppLayout>
                          </SocketProvider>
                        </SidebarProvider>
                      </ConfettiProvider>
                    </LoaderProvider>
                  </AuthProvider>
                </MetaProvider>
              </StoreProvider>
            </AccountsProvider>
          </WalletProvider>
        </ConnectionProvider>
      )}
    </>
  );
};
