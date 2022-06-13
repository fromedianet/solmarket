/* eslint-disable no-empty */
import { ApiUtils } from "../utils/apiUtils";

export const useCollectionsAPI = () => {
  const { runAPI } = ApiUtils();
  /**
   * Craete new collection with uuid and email
   *
   * @param props
   * @returns
   */
  async function createCollection(props: { _id: string }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/create",
        data: JSON.stringify(props),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return null;
  }

  /**
   * Get my collections
   *
   * @returns
   */
  async function getMyCollections(): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "get",
        url: "/collections/getMyCollections",
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return [];
  }

  /**
   * Get my listed collections
   *
   * @returns
   */
  async function getMyListedCollections(): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "get",
        url: "/collections/getMyListedCollections",
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return [];
  }

  /**
   * Get collection by id
   *
   * @param _id
   * @returns
   */
  async function getCollectionById(id: string): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/getCollectionById",
        data: JSON.stringify({ _id: id }),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return null;
  }

  /**
   * Update collection step1 (permission)
   *
   * @param props
   * @returns
   */
  async function processStep1(props: {
    _id: string;
    permission: string;
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/processStep1",
        data: JSON.stringify(props),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

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
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/processStep2",
        data: JSON.stringify(props),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

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
    try {
      const formData = new FormData();
      formData.append("_id", props._id);
      if (props.description) formData.append("description", props.description);
      if (props.image) formData.append("image", props.image);
      if (props.banner) formData.append("banner", props.banner);
      formData.append("is_derivative", props.is_derivative.toString());
      if (props.derivative_original_link)
        formData.append(
          "original_derivative_link",
          props.derivative_original_link
        );
      if (props.derivative_original_name)
        formData.append(
          "original_derivative_name",
          props.derivative_original_name
        );
      if (props.primary_category)
        formData.append("primary_category", props.primary_category);
      if (props.secondary_category)
        formData.append("secondary_category", props.secondary_category);
      formData.append("twitter", props.twitter);
      formData.append("discord", props.discord);
      if (props.website) formData.append("website", props.website);

      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/processStep3",
        data: formData,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

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
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/processStep4",
        data: JSON.stringify(props),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

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
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/processStep5",
        data: JSON.stringify(props),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return null;
  }

  /**
   * Get all collections for review (without draft)
   *
   */
  async function getCollectionsWithoutDraft(): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "get",
        url: "/collections/getCollectionsWithoutDraft",
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return [];
  }

  /**
   * Get all live collections
   */
  async function getAllCollections(): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: "get",
        url: "/collections/getAllCollections",
        useCache: true,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return [];
  }

  /**
   * Get all live new collections
   */
  async function getNewCollections(more: boolean): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: "post",
        url: "/collections/getNewCollections",
        data: JSON.stringify({ more }),
        useCache: true,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

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
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: "get",
        url: "/collections/featuredCollectionsCarousel",
        useCache: true,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return {};
  }

  /**
   * Get launchpad collections
   */
  async function getLaunchpadCollections(): Promise<any[]> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: "get",
        url: "/collections/getLaunchpadCollections",
        useCache: true,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return [];
  }

  /**
   * Get collection by symbol
   */
  async function getCollectionBySymbol(symbol: string): Promise<any> {
    try {
    } catch {}
    const result: any = await runAPI({
      isAuth: false,
      method: "post",
      url: "/collections/getCollectionBySymbol",
      data: JSON.stringify({ symbol }),
      useCache: true,
    });
    if ("data" in result) {
      return result["data"];
    }
    return null;
  }

  /**
   * Update collection mint_ended status
   */
  async function updateCandyMachineStatus(props: {
    candymachine_id: string;
    mint_ended: boolean;
  }): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: true,
        method: "post",
        url: "/collections/updateCandyMachineStatus",
        data: JSON.stringify(props),
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return null;
  }

  /**
   * Get collection stats by symbol
   * @param symbol
   * @returns
   */
  async function getCollectionStatsBySymbol(symbol: string): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: "post",
        url: "/collections/getCollectionStatsBySymbol",
        data: JSON.stringify({ symbol }),
        useCache: true,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

    return null;
  }

  /**
   * Get multi collection escrow stats by symbols
   * @param symbols
   * @returns
   */
  async function getMultiCollectionEscrowStats(
    symbols: string[]
  ): Promise<any> {
    try {
      const result: any = await runAPI({
        isAuth: false,
        method: "post",
        url: "/collections/getMultiCollectionEscrowStats",
        data: JSON.stringify({ symbols }),
        useCache: true,
      });
      if ("data" in result) {
        return result["data"];
      }
    } catch {}

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
