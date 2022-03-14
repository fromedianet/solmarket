import { APIS } from '../constants';

export const useCollectionsAPI = () => {
  function createCollection(props: { _id: string; email: string }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collectionCreate;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(props),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function getCollectionsByEmail(email: string) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/email/' + email;

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function getCollectionById(_id: string) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/' + _id;
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function collectionStep1(props: { _id: string; permission: string }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/step1';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(props),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function collectionStep2(props: {
    _id: string;
    name: string;
    symbol: string;
  }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/step2';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(props),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function collectionStep3(props: {
    _id: string;
    description: string | null;
    image: string;
    banner: string | null;
    is_derivative: number;
    derivative_original_link: string | null;
    derivative_original_name: string | null;
    primary_category: string | null;
    secondary_category: string | null;
    twitter: string;
    discord: string;
    website: string | null;
  }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/step3';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(props),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function collectionStep4(props: { _id: string; candymachine_ids: string }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/step4';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(props),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  function collectionSubmit(props: {
    _id: string;
    launch_time: EpochTimeStamp;
    mint_supply: number;
    mint_price: number;
  }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/submit';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(props),
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  return {
    createCollection,
    getCollectionsByEmail,
    getCollectionById,
    collectionStep1,
    collectionStep2,
    collectionStep3,
    collectionStep4,
    collectionSubmit,
  };
};
