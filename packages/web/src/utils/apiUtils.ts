import { notify } from '@oyster/common';
import axios, { Method } from 'axios';
import { APIS } from '../constants';
import { useAuthToken } from '../contexts/authProvider';

const expiry = 60 * 60; // 60 minutes

export const ApiUtils = () => {
  const { authToken, removeAuthToken } = useAuthToken();
  const axiosInstance = axios.create({
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
  });

  function runOthersAPI(props: {
    method: Method;
    url: string;
    data?: string | FormData;
    useCache?: boolean;
    showError?: boolean;
  }) {
    axiosInstance.defaults.baseURL = APIS.base_others_api_url;
    const cacheKey = APIS.base_others_api_url + props.url;
    if (props.useCache) {
      const cached = localStorage.getItem(cacheKey);
      const whenCached = localStorage.getItem(cacheKey + ':ts');
      if (cached !== null && whenCached !== null) {
        const age = (Date.now() - parseInt(whenCached)) / 1000;
        if (age < expiry) {
          // it was in sessionStorage! Yay!
          // Even though 'whenCached' is a string, this operation
          // works because the minus sign converts the
          // string to an integer and it will work.
          return Promise.resolve(JSON.parse(cached));
        } else {
          // We need to clean up this old key
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(cacheKey + ':ts');
        }
      }
    }
    return new Promise((resolve, reject) => {
      axiosInstance
        .request({
          method: props.method,
          url: props.url,
          data: props.data,
        })
        .then(res => {
          if (res.status === 200) {
            if (props.useCache) {
              try {
                localStorage.setItem(cacheKey, JSON.stringify(res.data));
                localStorage.setItem(cacheKey + ':ts', Date.now().toString());
              } catch (e) {
                console.error('localStorage setItem error', e);
                localStorage.clear();
              }
            }
            resolve(res.data);
          } else {
            if (props.showError) {
              notify({
                message: res.data.message,
                type: 'error',
              });
            }
            reject();
          }
        })
        .catch(err => {
          console.error('runOthersAPI error', err);
          if (props.showError) {
            notify({
              message: err.message,
              type: 'error',
            });
          }
          reject();
        });
    });
  }

  function runAPI(props: {
    isAuth: boolean;
    method: Method;
    url: string;
    data?: string | FormData;
    showError?: boolean;
    useCache?: boolean;
  }) {
    return new Promise((resolve, reject) => {
      axiosInstance.defaults.baseURL = APIS.base_api_url;
      const cacheKey = APIS.base_others_api_url + props.url;
      if (props.useCache) {
        const cached = localStorage.getItem(cacheKey);
        const whenCached = localStorage.getItem(cacheKey + ':ts');
        if (cached !== null && whenCached !== null) {
          const age = (Date.now() - parseInt(whenCached)) / 1000;
          if (age < expiry) {
            // it was in sessionStorage! Yay!
            // Even though 'whenCached' is a string, this operation
            // works because the minus sign converts the
            // string to an integer and it will work.
            return Promise.resolve(JSON.parse(cached));
          } else {
            // We need to clean up this old key
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheKey + ':ts');
          }
        }
      }
      if (props.isAuth) {
        axiosInstance.defaults.headers.common['x-access-token'] = authToken;
      }
      if (props.data) {
        if (typeof props.data !== 'string') {
          axiosInstance.defaults.headers.common[
            'Content-Type'
          ] = `multipart/formdata; boundary=${Date.now()}`;
        }
      }

      axiosInstance
        .request({
          method: props.method,
          url: props.url,
          data: props.data,
        })
        .then(res => {
          if (res.status === 200) {
            if (props.useCache) {
              try {
                localStorage.setItem(cacheKey, JSON.stringify(res.data));
                localStorage.setItem(cacheKey + ':ts', Date.now().toString());
              } catch (e) {
                console.error('localStorage setItem error', e);
                localStorage.clear();
              }
            }
            resolve(res.data);
          } else {
            if (res.status === 401) {
              removeAuthToken();
            }
            if (props.showError) {
              notify({
                message: res.data.error.message,
                type: 'error',
              });
            }

            reject();
          }
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            removeAuthToken();
          }
          if (props.showError) {
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
          }
          reject();
        });
    });
  }

  return {
    runAPI,
    runOthersAPI,
  };
};
