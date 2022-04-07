import { useConnection } from '@oyster/common';
import { ParsedAccountData, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { NFT, Transaction } from '../models/exCollection';
import { useNFTsAPI } from './useNFTsAPI';
import { useTransactionsAPI } from './useTransactionsAPI';

export const useNFT = (mint: string) => {
  const connection = useConnection();
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
          const data = res['data'];
          getTokenAccount(mint).then(res => {
            if (res) {
              setNFT({
                ...data,
                ...res,
              });
            }
          });
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

  async function getTokenAccount(mint: string) {
    try {
      const res1 = await connection.getTokenLargestAccounts(
        new PublicKey(mint),
      );
      const token = res1.value[0].address;
      const res2 = await connection.getParsedAccountInfo(new PublicKey(token));
      const tokenAccountData = (res2.value?.data as ParsedAccountData).parsed;
      const owner = tokenAccountData['info']['owner'];
      return {
        tokenAddress: token.toBase58(),
        owner: owner,
      };
    } catch {
      return null;
    }
  }

  return { nft, transactions, loading };
};
