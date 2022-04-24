import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomSection } from './BottomSection';
import { useQuerySearch } from '@oyster/common';
import { useExNftAPI } from '../../hooks/useExNftAPI';
import { InfoSection } from './InfoSection';
import { EmptyView } from '../../components/EmptyView';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { NFT, Transaction } from '../../models/exCollection';

export const ExNFTView = () => {
  const params = useParams<{ id: string }>();
  const id = params.id || '';
  const searchParams = useQuerySearch();
  const market = searchParams.get('market') || '';
  const price = searchParams.get('price') || '0';
  const collection = searchParams.get('collection') || '';
  const [loading, setLoading] = useState(false);
  const [nft, setNFT] = useState<NFT>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);

  const { getExNFTByMintAddress, getExTransactions } = useExNftAPI();

  useEffect(() => {
    setLoading(true);
    loadData()
      .then(res => {
        if (res) {
          setNFT(res.nft);
          setTransactions(res.transactions);
        }
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    const filters = transactions.filter(item => item.txType === 'SALE');
    const data = filters.map(item => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: item.price || 0,
    }));
    if (data.length > 0) {
      setPriceData(data);
    }
  }, [transactions]);

  async function loadData() {
    if (id && market) {
      const nftRes = await getExNFTByMintAddress({
        market: market,
        mint: id,
        price: parseFloat(price)
      });
      const txRes = await getExTransactions(id, market);

      return {
        nft: nftRes,
        transactions: txRes,
      };
    }
    return null;
  }

  const onBuy = async () => {
  };

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container art-container">
          {loading ? (
            <Spin size="large" />
          ) : nft ? (
            <>
              <InfoSection
                nft={nft}
                market={market}
                collection={nft.symbol || collection}
                priceData={priceData}
                onBuy={onBuy}
                onRefresh={() => setRefresh(Date.now())}
              />
              <BottomSection
                transactions={transactions}
                mintAddress={id}
                market={market}
                collection={nft.symbol || collection}
                collectionName={nft.collectionName || collection}
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
