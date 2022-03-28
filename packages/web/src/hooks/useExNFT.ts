import { useEffect, useState } from 'react';
import { NFTData, Transaction } from '../models/exCollection';
import { APIS } from '../constants';

export const useExNFT = (
  mintAddress: string,
  market: string,
  price?: number,
) => {
  const [nft, setNFT] = useState<NFTData>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    getNFTByMintAddress(mintAddress, price);
    getTransactions(mintAddress, market);
  }, [mintAddress]);

  function getNFTByMintAddress(mint: string, price?: number) {
    setLoading(true);
    const uri = APIS.base_url + APIS.getNFTByMintAddress + mint;
    fetch(uri)
      .then(res => res.json())
      .then(result => {
        if (result['data']) {
          if (price && result['data']['price'] === 0) {
            result['data']['price'] = price;
          }
          setNFT(result['data']);
        }
        setLoading(false);
      });
  }

  function getTransactions(mint: string, market: string) {
    const uri = APIS.base_url + APIS.transactionsByMint;
    const queryBody = { market: market };
    if (market === 'magiceden') {
      const query = {
        $match: { mint: mint },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      queryBody['params'] = `?q=${encodeURI(JSON.stringify(query))}`;
    } else if (market === 'solanart') {
      queryBody['params'] = `?address=${mint}`;
    } else if (market === 'digital_eyes') {
      queryBody['params'] = `?mint=${mint}`;
    } else if (market === 'alpha_art') {
      queryBody[
        'params'
      ] = `${mint}?trading_types=2%2C1%2C3&no_foreign_listing=true`;
    }

    fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    })
      .then(res => res.json())
      .then(result => {
        setTransactions(result['data']);
      });
  }

  return { nft, loading, transactions };
};
