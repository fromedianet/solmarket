import { ApiUtils } from '../utils/apiUtils';

export const useCollectionsAPI = () => {
  const { runAPI } = ApiUtils();
  /**
   * Craete new collection with uuid and email
   *
   * @param props
   * @returns
   */
  async function createCollection(props: { _id: string }): Promise<any> {
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
  async function getMyCollections(): Promise<any[]> {
    const result: any = await runAPI(true, 'get', '/collections/getMyCollections');
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get my listed collections
   *
   * @returns
   */
  async function getMyListedCollections(): Promise<any[]> {
    const result: any = await runAPI(
      true,
      'get',
      '/collections/getMyListedCollections',
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get collection by id
   *
   * @param _id
   * @returns
   */
  async function getCollectionById(id: string): Promise<any> {
    const result: any = await runAPI(
      true,
      'post',
      '/collections/getCollectionById',
      JSON.stringify({ _id: id }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
  }

  /**
   * Update collection step1 (permission)
   *
   * @param props
   * @returns
   */
  async function processStep1(props: { _id: string; permission: string }): Promise<any> {
    const result: any = await runAPI(
      true,
      'post',
      '/collections/processStep1',
      JSON.stringify(props),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
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
  }): Promise<any> {
    const result: any = await runAPI(
      true,
      'post',
      '/collections/processStep2',
      JSON.stringify(props),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
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
  }): Promise<any> {
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

    const result: any = await runAPI(
      true,
      'post',
      '/collections/processStep3',
      formData,
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
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
  }): Promise<any> {
    const result: any = await runAPI(
      true,
      'post',
      '/collections/processStep4',
      JSON.stringify(props),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
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
  }): Promise<any> {
    const result: any = await runAPI(
      true,
      'post',
      '/collections/processStep5',
      JSON.stringify(props),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
  }

  /**
   * Get all collections for review (without draft)
   *
   */
  async function getCollectionsWithoutDraft(): Promise<any[]> {
    const result: any = await runAPI(
      true,
      'get',
      '/collections/getCollectionsWithoutDraft',
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get all live collections
   */
  async function getAllCollections(): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'get',
      '/collections/getAllCollections',
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get all live new collections
   */
  async function getNewCollections(more?: boolean): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'post',
      '/collections/getNewCollections',
      JSON.stringify({ more }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
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
  async function featuredCollectionsCarousel(): Promise<any> {
    const result: any = await runAPI(
      false,
      'get',
      '/collections/featuredCollectionsCarousel',
    );
    if ('data' in result) {
      return result['data'];
    } else {
      return {};
    }
  }

  /**
   * Get launchpad collections
   */
  async function getLaunchpadCollections(): Promise<any[]> {
    const result: any = await runAPI(
      false,
      'get',
      '/collections/getLaunchpadCollections',
    );
    if ('data' in result) {
      return result['data'];
    }
    return [];
  }

  /**
   * Get collection by symbol
   */
  async function getCollectionBySymbol(symbol: string): Promise<any> {
    const result: any = await runAPI(
      false,
      'post',
      '/collections/getCollectionBySymbol',
      JSON.stringify({ symbol }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
  }

  /**
   * Update collection mint_ended status
   */
  async function updateCandyMachineStatus(props: {
    candymachine_id: string;
    mint_ended: boolean;
  }) {
    const result = await runAPI(
      true,
      'post',
      '/collections/updateCandyMachineStatus',
      JSON.stringify(props),
    );
    return result;
  }

  /**
   * Get collection stats by symbol
   * @param symbol
   * @returns
   */
  async function getCollectionStatsBySymbol(symbol: string): Promise<any> {
    const result: any = await runAPI(
      false,
      'post',
      '/collections/getCollectionStatsBySymbol',
      JSON.stringify({ symbol }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return null;
  }

  /**
   * Get multi collection escrow stats by symbols
   * @param symbols
   * @returns
   */
  async function getMultiCollectionEscrowStats(symbols: string[]): Promise<any> {
    const result: any = await runAPI(
      false,
      'post',
      '/collections/getMultiCollectionEscrowStats',
      JSON.stringify({ symbols }),
    );
    if ('data' in result) {
      return result['data'];
    }
    return {};
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
    updateCandyMachineStatus,
    getMultiCollectionEscrowStats,
  };
};
