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

  /**
   * Get NFT by mint address
   * @param mint
   * @returns
   */
  async function getNftByMint(mint: string) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getNftByMint',
      JSON.stringify({ mint }),
    );
    return result;
  }

  /**
   * Get NFTs by wallet
   * @returns
   */
  async function getNFTsByWallet(wallet: string) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/getNFTsByWallet',
      JSON.stringify({ wallet }),
    );
    return result;
  }

  async function updateInfo(params: {
    mint: string,
    tokenAddress: string,
    owner: string,
  }) {
    const result = await runAPI(
      false,
      'post',
      '/nfts/updateInfo',
      JSON.stringify(params),
    );
    return result;
  }

  return {
    createNft,
    getListedNftsByQuery,
    getNftByMint,
    getNFTsByWallet,
    updateInfo,
  };
};
