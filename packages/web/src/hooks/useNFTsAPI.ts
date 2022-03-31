import { notify } from '@oyster/common';
import axios, { Method } from 'axios';
import { APIS } from '../constants';
import { useAuthToken } from '../contexts/authProvider';

export const useNFTsAPI = () => {
  const { authToken, removeAuthToken } = useAuthToken();
  const axiosInstance = axios.create({
    baseURL: APIS.base_api_url,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  function runAPI(
    isAuth: boolean,
    method: Method,
    url: string,
    data?: string | FormData,
  ) {
    return new Promise((resolve, reject) => {
      if (isAuth) {
        axiosInstance.defaults.headers.common['x-access-token'] = authToken;
      }

      axiosInstance
        .request({
          method: method,
          url: url,
          data: data,
        })
        .then(res => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            if (res.status === 401) {
              removeAuthToken();
            }
            notify({
              message: res.data.error.message,
              type: 'error',
            });
            reject();
          }
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            removeAuthToken();
          }
          let errMessage = err.message;
          if (err.response && err.response.data) {
            errMessage = err.response.data.error
              ? err.response.data.error.message
              : err.response.data.details;
          }
          notify({
            message: errMessage,
            type: 'error',
          });
          reject();
        });
    });
  }

  /**
   * Create new NFT when mint in the LaunchPad
   * @param props
   */
  async function createNft(metadataAddress: string) {
    const result = await runAPI(
      true,
      'post',
      '/nfts/create',
      JSON.stringify({ metadataAddress }),
    );
    return result;
  }

  async function getListedNftsByQuery(props) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getListedNftsByQuery',
      JSON.stringify(props),
    );
    return result;
  }

  return {
    createNft,
    getListedNftsByQuery,
  };
};
