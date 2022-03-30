import { APIS } from '../constants';
import axios from 'axios';
import { notify } from '@oyster/common';
import bs58 from 'bs58';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuthToken } from '../contexts/authProvider';

export const useAuthAPI = () => {
  const wallet = useWallet();
  const { setAuthToken, removeAuthToken } = useAuthToken();

  const axiosInstance = axios.create({
    baseURL: APIS.base_api_url,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
  });

  function fetchNonce(wallet: string) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ wallet });
      axiosInstance
        .post('/nonce/fetch', data)
        .then(res => {
          if (res.status === 200) {
            resolve(res.data.data.nonce);
          } else {
            notify({
              message: res.data.message,
              description: res.data.details,
              type: 'error',
            });
            reject();
          }
        })
        .catch(err => {
          if (err.response) {
            notify({
              message: err.response.data.message,
              description: err.response.data.details,
              type: 'error',
            });
          } else {
            notify({
              message: err.message,
              type: 'error',
            });
          }
          reject();
        });
    });
  }

  function signin(publicKey: string, signature: string) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ publicKey, signature });
      axiosInstance
        .post('/user/login', data)
        .then(res => {
          if (res.status === 200) {
            resolve(res.data.data);
          } else {
            notify({
              message: res.data.error.message,
              type: 'error',
            });
            reject();
          }
        })
        .catch(err => {
          let errMessage = err.message;
          if (err.response && err.response.data.error.message) {
            errMessage = err.response.data.error.message;
          }
          notify({
            message: errMessage,
            type: 'error',
          });
          reject();
        });
    });
  }

  async function getNonce() {
    if (wallet.publicKey) {
      try {
        const nonce = await fetchNonce(wallet.publicKey.toBase58());
        return nonce;
      } catch (e) {
        return null;
      }
    }
  }

  async function authentication() {
    const nonce = await getNonce();
    if (nonce) {
      const message =
        'Sign in with PaperCity.\n\n' +
        'No password needed.\n\n' +
        'Click "Sign" or "Approve" only means you have proved this wallet is owned by you.\n\n' +
        'This request will not trigger any blockchain transaction or cost any gas fee.\n\n' +
        'Your authentication status will be reset in 24 hours.\n\n' +
        `nonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      // @ts-ignore
      const signedMessage = await window.solana.signMessage(
        encodedMessage,
        'utf8',
      );
      const result = await signin(
        signedMessage.publicKey.toBase58(),
        bs58.encode(signedMessage.signature),
      );
      if (result) {
        // @ts-ignore
        setAuthToken(result['token'], result['isAdmin']);
      } else {
        removeAuthToken();
      }
    }
  }

  return {
    authentication,
  };
};
