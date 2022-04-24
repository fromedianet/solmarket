import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomSection } from './bottomSection';
import { InfoSection } from './infoSection';
import { EmptyView } from '../../components/EmptyView';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { useNFTsAPI } from '../../hooks/useNFTsAPI';
import { NFT, Transaction } from '../../models/exCollection';
import { useQuerySearch } from '@oyster/common';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
import { useExNftAPI } from '../../hooks/useExNftAPI';
import { useMECollectionsAPI } from '../../hooks/useMECollectionsAPI';

export const ItemDetailView = () => {
  const params = useParams<{ mint: string }>();
  const mint = params.mint || '';
  const searchParams = useQuerySearch();
  const market = searchParams.get('market');
  const [nft, setNFT] = useState<NFT>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [nftList, setNFTList] = useState<NFT[]>([]);
  const [refresh, setRefresh] = useState(0);
  const { getNftByMint, getListedNftsByQuery } = useNFTsAPI();
  const { getTransactionsByMint } = useTransactionsAPI();
  const { getExNFTByMintAddress, getExTransactions } = useExNftAPI();
  const { getMEListedNFTsByCollection } = useMECollectionsAPI();
  // const { nft, loading, transactions } = useNFT(mint, refresh);

  useEffect(() => {
    getNFT().then(res => {
      if (res) setNFT(res);
    });

    getTransactions().then(res => setTransactions(res));
  }, [mint, market, refresh]);

  useEffect(() => {
    const filters = transactions.filter(item => item.txType === 'SALE');
    const data = filters.map(item => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: item.price || 0,
    }));

    setPriceData(data.reverse());
  }, [transactions]);

  useEffect(() => {
    if (nft) {
      getListedNFTs(nft).then(res => setNFTList(res));
    }
  }, [nft]);

  async function getNFT() {
    if (!mint) return undefined;
    if (loading) return;
    setLoading(true);

    let result: any = {};
    if (market) {
      const res: any = await getExNFTByMintAddress({
        market: market,
        mint: mint,
        price: undefined,
      });
      if (res) {
        result = res;
      }
    } else {
      const res: any = await getNftByMint(mint);
      if ('data' in res) {
        result = res['data'];
      }
    }

    setLoading(false);
    return result;
  }

  async function getTransactions() {
    let result: any[] = [];
    if (!mint) return result;
    if (market) {
      const res = await getExTransactions(mint, market);
      if (res) {
        result = res;
      }
    } else {
      const res: any = await getTransactionsByMint(mint);
      if ('data' in res) {
        result = res['data'];
      }
    }
    return result;
  }

  async function getListedNFTs(nftItem: NFT) {
    let result: any[] = [];
    const param = {
      symbol: nftItem.symbol,
      market: nftItem.market,
      sort: 1,
      status: false,
    };
    if (nftItem.market) {
      const res: any = await getMEListedNFTsByCollection(param);
      if (res) result = res;
    } else {
      const res: any = await getListedNftsByQuery(param);
      if ('data' in res) {
        result = res['data'];
      }
    }
    result = result.filter(item => item.mint != nftItem.mint);
    return result;
  }

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container art-container">
          {loading ? (
            <Spin />
          ) : nft ? (
            <>
              <InfoSection
                nft={nft}
                priceData={priceData}
                onRefresh={() => setRefresh(Date.now())}
              />
              <BottomSection
                transactions={transactions}
                nft={nft}
                nftList={nftList}
              />
            </>
          ) : (
            <EmptyView />
          )}
        </div>
      </div>
    </div>
  );
};
