import { notify } from '@oyster/common';
import axios, { Method } from 'axios';
import { APIS } from '../constants';
import { useAuthToken } from '../contexts/authProvider';

export const ApiUtils = () => {
  const { authToken, removeAuthToken } = useAuthToken();
  const axiosInstance = axios.create({
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
  });

  function runOthersAPI(method: Method, url: string, data?: string | FormData) {
    axiosInstance.defaults.baseURL = APIS.base_others_api_url;
    return new Promise((resolve, reject) => {
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
            notify({
              message: res.data.message,
              type: 'error',
            });
            reject();
          }
        })
        .catch(err => {
          notify({
            message: err.message,
            type: 'error',
          });
          reject();
        });
    });
  }

  function runAPI(
    isAuth: boolean,
    method: Method,
    url: string,
    data?: string | FormData,
  ) {
    return new Promise((resolve, reject) => {
      axiosInstance.defaults.baseURL = APIS.base_api_url;
      if (isAuth) {
        axiosInstance.defaults.headers.common['x-access-token'] = authToken;
      }
      if (data) {
        if (typeof data !== 'string') {
          axiosInstance.defaults.headers.common[
            'Content-Type'
          ] = `multipart/formdata; boundary=${Date.now()}`;
        }
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

  function runMagicEdenAPI(
    method: Method,
    url: string,
    data?: string | FormData | {},
  ) {
    axiosInstance.defaults.baseURL = APIS.magiceden_base_url;
    return new Promise((resolve, reject) => {
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
            notify({
              message: res.data.message,
              type: 'error',
            });
            reject();
          }
        })
        .catch(err => {
          notify({
            message: err.message,
            type: 'error',
          });
          reject();
        });
    });
  }

  return {
    runAPI,
    runOthersAPI,
    runMagicEdenAPI,
  };
};
