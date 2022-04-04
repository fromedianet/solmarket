import { useEffect, useState } from 'react';
import { NFT, Transaction } from '../models/exCollection';
import { useNFTsAPI } from './useNFTsAPI';
import { useTransactionsAPI } from './useTransactionsAPI';

export const useNFT = (mint: string) => {
  const [nft, setNFT] = useState<NFT>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { getNftByMint } = useNFTsAPI();
  const { getTransactionsByMint } = useTransactionsAPI();

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    getNftByMint(mint)
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setNFT(res['data']);
        }
      })
      .finally(() => setLoading(false));

    getTransactionsByMint(mint)
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setTransactions(res['data']);
        }
      });
  }, [mint]);

  return { nft, transactions, loading };
};
