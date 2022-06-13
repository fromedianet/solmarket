import React, { FC } from "react";
import { ConfettiProvider } from "../components/Confetti";
import { AppLayout } from "../components/Layout";
import {
  AccountsProvider,
  AuthProvider,
  ConnectionProvider,
  SidebarProvider,
  SocketProvider,
  WalletProvider,
} from ".";

export default function Providers(props: { children: any }) {
  return (
    <ConnectionProvider>
      <WalletProvider>
        <AuthProvider>
          <AccountsProvider>
            <ConfettiProvider>
              <SidebarProvider>
                <SocketProvider>
                  <AppLayout>{props.children}</AppLayout>
                </SocketProvider>
              </SidebarProvider>
            </ConfettiProvider>
          </AccountsProvider>
        </AuthProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
