import { ApiUtils } from '../utils/apiUtils';

export const useCollectionsAPI = () => {
  const { runAPI } = ApiUtils();
  /**
   * Craete new collection with uuid and email
   *
   * @param props
   * @returns
   */
  async function createCollection(props: { _id: string }) {
    const result = await runAPI(
      true,
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
    const result = await runAPI(true, 'get', '/collections/getMyCollections');
    return result;
  }

  /**
   * Get my listed collections
   *
   * @returns
   */
  async function getMyListedCollections() {
    const result = await runAPI(
      true,
      'get',
      '/collections/getMyListedCollections',
    );
    return result;
  }

  /**
   * Get collection by id
   *
   * @param _id
   * @returns
   */
  async function getCollectionById(id: string) {
    const result = await runAPI(
      true,
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
    const result = await runAPI(
      true,
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
    const result = await runAPI(
      true,
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

    const result = await runAPI(
      true,
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
    const result = await runAPI(
      true,
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
    reject_info?: string | null;
  }) {
    const result = await runAPI(
      true,
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
    const result = await runAPI(
      true,
      'get',
      '/collections/getCollectionsWithoutDraft',
    );
    return result;
  }

  /**
   * Get all live collections
   */
  async function getAllCollections() {
    const result = await runAPI(false, 'get', '/collections/getAllCollections');
    return result;
  }

  /**
   * Get all live new collections
   */
  async function getNewCollections() {
    const result = await runAPI(false, 'get', '/collections/getNewCollections');
    return result;
  }

  /**
   * Get featured collections
   *
   * Type
   * - launchpad-collections : launch_time is less than 1 day and mint_ended is false
   * - upcoming-collections : launch_time is greater than 1 day
   * - new-collecitons : mint_ended is true and updatedAt is less than 7 days
   * - collections : mint_ended is tru and updatedAt is greater than 7 days
   */
  async function featuredCollectionsCarousel() {
    const result = await runAPI(
      false,
      'get',
      '/collections/featuredCollectionsCarousel',
    );
    return result;
  }

  /**
   * Get launchpad collections
   */
  async function getLaunchpadCollections() {
    const result = await runAPI(
      false,
      'get',
      '/collections/getLaunchpadCollections',
    );
    return result;
  }

  /**
   * Get collection by symbol
   */
  async function getCollectionBySymbol(symbol: string) {
    const result = await runAPI(
      false,
      'post',
      '/collections/getCollectionBySymbol',
      JSON.stringify({ symbol }),
    );
    return result;
  }

  /**
   * Update collection mint_ended status
   */
  async function updateCollectionMintStatus(props: {
    symbol: string;
    mint_ended: boolean;
  }) {
    const result = await runAPI(
      true,
      'post',
      '/collections/updateCollectionMintStatus',
      JSON.stringify(props),
    );
    return result;
  }

  async function getCollectionStatsBySymbol(symbol: string) {
    const result = await runAPI(
      false,
      'post',
      '/collections/getCollectionStatsBySymbol',
      JSON.stringify({ symbol }),
    );
    return result;
  }

  return {
    createCollection,
    getMyCollections,
    getMyListedCollections,
    getCollectionById,
    processStep1,
    processStep2,
    processStep3,
    processStep4,
    processStep5,
    getCollectionsWithoutDraft,
    getAllCollections,
    getNewCollections,
    featuredCollectionsCarousel,
    getLaunchpadCollections,
    getCollectionBySymbol,
    getCollectionStatsBySymbol,
    updateCollectionMintStatus,
  };
};
