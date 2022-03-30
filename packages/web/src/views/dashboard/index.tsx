import React from 'react';
import { Button } from 'antd';
import { DashboardHeader } from './header';
import { useAuthToken } from '../../contexts/authProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton } from '@oyster/common';
import { useAuthAPI } from '../../hooks/useAuthAPI';

export const DashboardLayout = React.memo(function AppLayoutImpl(props: any) {
  const wallet = useWallet();
  const { authToken } = useAuthToken();
  const { authentication } = useAuthAPI();

  return (
    <div className="dashboard-layout">
      {wallet.connected ? (
        authToken ? (
          <>
            <DashboardHeader />
            {props.children}
          </>
        ) : (
          <div className="not-configured">
            <Button type="primary" onClick={async () => await authentication()}>
              Sign in
            </Button>
          </div>
        )
      ) : (
        <div className="not-configured">
          <span className="description">Connect wallet to show this page</span>
          <ConnectButton />
        </div>
      )}
    </div>
  );
});
