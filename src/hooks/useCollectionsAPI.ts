/* eslint-disable no-empty */
import { ApiUtils } from "../utils/apiUtils";

export const useCollectionsAPI = () => {
  const { runAPI } = ApiUtils();

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
   * Get collection by symbol
   */
  async function getCollectionAndStats(
    symbol: string,
    market: string
  ): Promise<any> {
    try {
    } catch {}
    const result: any = await runAPI({
      isAuth: false,
      method: "post",
      url: "/collections/getCollectionAndStats",
      data: JSON.stringify({ symbol, market }),
      useCache: true,
    });
    if ("data" in result) {
      return result["data"];
    }
    return null;
  }

  return {
    getAllCollections,
    getNewCollections,
    getCollectionAndStats,
  };
};
