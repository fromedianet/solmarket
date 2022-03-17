import { APIS } from '../constants';

export const useCollectionsAPI = () => {
  /**
   * Craete new collection with uuid and email
   *
   * @param props
   * @returns
   */
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

  /**
   * Get collections by email
   *
   * @param email
   * @returns
   */
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

  /**
   * Get collection by id
   *
   *
   * @param _id
   * @returns
   */
  function getCollectionById(_id: string) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/id/' + _id;
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

  /**
   * Update collection step1 (permission)
   *
   * @param props
   * @returns
   */
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

  /**
   * Update colleciton step2 (name, symbol)
   *
   * @param props
   * @returns
   */
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

  /**
   * Update collection step3 (image, social links, etc)
   *
   * @param props
   * @returns
   */
  function collectionStep3(props: {
    _id: string;
    description: string | null;
    image: File | null;
    banner: File | null;
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
      const formData = new FormData();
      formData.append('_id', props._id);
      if (props.description) formData.append('description', props.description);
      if (props.image) formData.append('image', props.image);
      if (props.banner) formData.append('banner', props.banner);
      formData.append('is_derivative', props.is_derivative.toString());
      if (props.derivative_original_link)
        formData.append(
          'original_derivative_link',
          props.derivative_original_link,
        );
      if (props.derivative_original_name)
        formData.append(
          'original_derivative_name',
          props.derivative_original_name,
        );
      if (props.primary_category)
        formData.append('primary_category', props.primary_category);
      if (props.secondary_category)
        formData.append('secondary_category', props.secondary_category);
      formData.append('twitter', props.twitter);
      formData.append('discord', props.discord);
      if (props.website) formData.append('website', props.website);

      const url = APIS.base_url + APIS.collections + '/step3';
      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  /**
   * Update collection step4 (candymachine id, launch time, mint supply, mint price)
   *
   * @param props
   * @returns
   */
  function collectionStep4(props: {
    _id: string;
    candymachine_ids: string;
    mint_supply: number;
    mint_price: number;
    launch_time: number;
  }) {
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

  /**
   * Submit collection
   *
   * @param props
   * @returns
   */
  function updateCollectionStatus(props: {
    _id: string;
    status: string;
    extra_info?: string | null;
  }) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/updateStatus';
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

  /**
   * Get all collections for review (without draft)
   *
   */
  function getAllCollections() {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.collections + '/all';

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

  /**
   * Get all live collections
   */
  function allCollections() {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.allCollections;

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

  /**
   * Get all live new collections
   */
  function newCollections() {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.newCollections;

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

  /**
   * Get all live collections
   */
  function featuredCollectionsCarousel() {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.featuredCollectionsCarousel;

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

  /**
   * Get all collections for review (without draft)
   *
   */
  function launchpadCollections() {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.launchpadCollections;

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

  return {
    createCollection,
    getCollectionsByEmail,
    getCollectionById,
    collectionStep1,
    collectionStep2,
    collectionStep3,
    collectionStep4,
    updateCollectionStatus,
    getAllCollections,
    allCollections,
    newCollections,
    featuredCollectionsCarousel,
    launchpadCollections,
  };
};
