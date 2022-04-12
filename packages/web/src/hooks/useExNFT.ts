import { useEffect, useState } from 'react';
import { NFTData, Transaction } from '../models/exCollection';
import { ApiUtils } from '../utils/apiUtils';
import { MarketType } from '../constants';

export const useExNFT = (
  mintAddress: string,
  market: string,
  price?: number,
  refresh?: number,
) => {
  const { runOthersAPI } = ApiUtils();
  const [nft, setNFT] = useState<NFTData>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    getNFTByMintAddress(mintAddress, price);
    getTransactions(mintAddress, market);
  }, [mintAddress, refresh]);

  function getNFTByMintAddress(mint: string, price?: number) {
    setLoading(true);
    runOthersAPI('get', `/exnft/${mint}`)
      // @ts-ignore
      .then((result: {}) => {
        if (result['data']) {
          if (price && result['data']['price'] === 0) {
            result['data']['price'] = price;
          }
          setNFT(result['data']);
        }
      })
      .finally(() => setLoading(false));
  }

  function getTransactions(mint: string, market: string) {
    const queryBody = { market: market };
    if (market === MarketType.MagicEden) {
      const query = {
        $match: { mint: mint },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      queryBody['params'] = `?q=${encodeURI(JSON.stringify(query))}`;
    } else if (market === MarketType.Solanart) {
      queryBody['params'] = `?address=${mint}`;
    } else if (market === MarketType.DigitalEyes) {
      queryBody['params'] = `?mint=${mint}`;
    } else if (market === MarketType.AlphaArt) {
      queryBody[
        'params'
      ] = `${mint}?trading_types=2%2C1%2C3&no_foreign_listing=true`;
    }

    runOthersAPI('post', '/exnft/transactions', JSON.stringify(queryBody))
      // @ts-ignore
      .then((result: {}) => {
        setTransactions(result['data']);
      });
  }

  return { nft, loading, transactions };
};
