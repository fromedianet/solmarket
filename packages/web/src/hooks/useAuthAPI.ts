import { APIS } from '../constants';
import axios from 'axios';
import { notify } from '@oyster/common';

export const useAuthAPI = () => {
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

  return {
    fetchNonce,
    signin,
  };
};
