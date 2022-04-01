import { notify } from '@oyster/common';
import axios, { Method } from 'axios';
import { APIS } from '../constants';

const OthersApiInstance = axios.create({
  baseURL: APIS.base_others_api_url,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export function runOthersAPI(
  method: Method,
  url: string,
  data?: string | FormData,
) {
  return new Promise((resolve, reject) => {
    OthersApiInstance.request({
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
