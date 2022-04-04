import { ApiUtils } from '../utils/apiUtils';

export const useNFTsAPI = () => {
  const { runAPI } = ApiUtils();
  /**
   * Create new NFT when mint in the LaunchPad
   * @param props
   */
  async function createNft(metadataAddress: string) {
    const result = await runAPI(
      true,
      'post',
      '/nfts/create',
      JSON.stringify({ metadataAddress }),
    );
    return result;
  }

  /**
   * Get listed nfts by query
   * @param props
   * @returns
   */
  async function getListedNftsByQuery(props) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getListedNftsByQuery',
      JSON.stringify(props),
    );
    return result;
  }

  async function getNftByMint(mint: string) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getNftByMint',
      JSON.stringify({ mint }),
    );
    return result;
  }

  return {
    createNft,
    getListedNftsByQuery,
    getNftByMint,
  };
};
