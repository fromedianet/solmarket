import React from 'react';
import { Button } from 'antd';
import bs58 from 'bs58';
import { DashboardHeader } from './header';
import { useAuthToken } from '../../contexts/authProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton } from '@oyster/common';
import { useAuthAPI } from '../../hooks/useAuthAPI';

export const DashboardLayout = React.memo(function AppLayoutImpl(props: any) {
  const wallet = useWallet();
  const { authToken, setAuthToken, removeAuthToken } = useAuthToken();
  const { fetchNonce, signin } = useAuthAPI();

  const getNonce = async () => {
    if (wallet.publicKey) {
      try {
        const nonce = await fetchNonce(wallet.publicKey.toBase58());
        return nonce;
      } catch (e) {
        return null;
      }
    }
  }

  const login = async () => {
    const nonce = await getNonce();
    if (nonce) {
      const message = 'Sign in with PaperCity.\n\n' + 
        'No password needed.\n\n' +
        'Click "Sign" or "Approve" only means you have proved this wallet is owned by you.\n\n' +
        'This request will not trigger any blockchain transaction or cost any gas fee.\n\n' +
        'Your authentication status will be reset in 24 hours.\n\n' +
        `nonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      // @ts-ignore
      const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");
      console.log(signedMessage.publicKey.toBase58(), bs58.encode(signedMessage.signature));
      const result = await signin(signedMessage.publicKey.toBase58(), bs58.encode(signedMessage.signature));
      if (result) {
        // @ts-ignore
        setAuthToken(result["token"], result["isAdmin"]);
      } else {
        removeAuthToken();
      }
    }
  }

  return (
    <div className="dashboard-layout">
      {wallet.connected ? (
        authToken ? (
          <>
            <DashboardHeader />
            {props.children}
          </>
        ) : (
          <div className='not-configured'>
            <Button type='primary' onClick={login}>Sign in</Button>
          </div>
        )
      ) : (
        <div className="not-configured">
          <span className='description'>Connect wallet to show this page</span>
          <ConnectButton />
        </div>
      )}
    </div>
  );
});
