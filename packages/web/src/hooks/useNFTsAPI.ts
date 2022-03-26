import { APIS } from '../constants';

export const useNFTsAPI = () => {
  function createNFT(data: {}) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.nfts;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  return {
    createNFT,
  };
};
