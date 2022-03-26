import { APIS } from '../constants';
import axios, { Method } from 'axios';
import { useAuthToken } from '../contexts/authProvider';
import { notify } from '@oyster/common';

export const useCollectionsAPI = () => {
  const { authToken, removeAuthToken } = useAuthToken();
  const axiosInstance = axios.create({
    baseURL: APIS.base_api_url,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  function runAuthAPIs(method: Method, url: string, data?: string | FormData) {
    return new Promise((resolve, reject) => {
      axiosInstance.defaults.headers.common['x-access-token'] = authToken;
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
   * Craete new collection with uuid and email
   *
   * @param props
   * @returns
   */
  async function createCollection(props: { _id: string }) {
    const result = await runAuthAPIs(
      'post',
      '/collections/create',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get my collections
   *
   * @returns
   */
  async function getMyCollections() {
    const result = await runAuthAPIs('get', '/collections/getMyCollections');
    return result;
  }

  /**
   * Get collection by id
   *
   * @param _id
   * @returns
   */
  async function getCollectionById(id: string) {
    const result = await runAuthAPIs(
      'post',
      '/collections/getCollectionById',
      JSON.stringify({ _id: id }),
    );
    return result;
  }

  /**
   * Update collection step1 (permission)
   *
   * @param props
   * @returns
   */
  async function processStep1(props: { _id: string; permission: string }) {
    const result = await runAuthAPIs(
      'post',
      '/collections/processStep1',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Update colleciton step2 (name, symbol)
   *
   * @param props
   * @returns
   */
  async function processStep2(props: {
    _id: string;
    name: string;
    symbol: string;
    email: string;
  }) {
    const result = await runAuthAPIs(
      'post',
      '/collections/processStep2',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Update collection step3 (image, social links, etc)
   *
   * @param props
   * @returns
   */
  async function processStep3(props: {
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

    axiosInstance.defaults.headers.common[
      'Content-Type'
    ] = `multipart/formdata; boundary=${Date.now()}`;
    const result = await runAuthAPIs(
      'post',
      '/collections/processStep3',
      formData,
    );
    return result;
  }

  /**
   * Update collection step4 (candymachine id, launch time, mint supply, mint price)
   *
   * @param props
   * @returns
   */
  async function processStep4(props: {
    _id: string;
    candymachine_id: string;
    mint_supply: number;
    mint_price: number;
    launch_time: number;
  }) {
    const result = await runAuthAPIs(
      'post',
      '/collections/processStep4',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Submit collection
   *
   * @param props
   * @returns
   */
  async function processStep5(props: {
    _id: string;
    status: string;
    extra_info?: string | null;
  }) {
    const result = await runAuthAPIs(
      'post',
      '/collections/processStep5',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get all collections for review (without draft)
   *
   */
  async function getCollectionsWithoutDraft() {
    const result = await runAuthAPIs(
      'get',
      '/collections/getCollectionsWithoutDraft',
    );
    return result;
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

  function launchpadCollectionBySymbol($symbol) {
    return new Promise((resolve, reject) => {
      const url = APIS.base_url + APIS.launchpad + $symbol;

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
    getMyCollections,
    getCollectionById,
    processStep1,
    processStep2,
    processStep3,
    processStep4,
    processStep5,
    getCollectionsWithoutDraft,
    allCollections,
    newCollections,
    featuredCollectionsCarousel,
    launchpadCollections,
    launchpadCollectionBySymbol,
  };
};
