import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomSection } from './BottomSection';
import { MetaplexModal, useQuerySearch } from '@oyster/common';
import { useExNFT } from '../../hooks/useExNFT';
import { InfoSection } from './InfoSection';
import { EmptyView } from '../../components/EmptyView';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';

export const ExNFTView = () => {
  const params = useParams<{ id: string }>();
  const id = params.id || '';
  const searchParams = useQuerySearch();
  const market = searchParams.get('market') || '';
  const price = searchParams.get('price') || '0';
  const collection = searchParams.get('collection') || '';
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);

  const { nft, loading, transactions } = useExNFT(
    id,
    market,
    parseFloat(price),
    refresh,
  );

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
                market={market}
                collection={collection}
                priceData={priceData}
                onBuy={() => {}}
                onRefresh={() => setRefresh(Date.now())}
              />
              <BottomSection
                transactions={transactions}
                mintAddress={id}
                market={market}
                collection={collection}
                collectionName={nft.collectionTitle || collection}
              />
            </>
          ) : (
            <EmptyView />
          )}
        </div>
      </div>
      <MetaplexModal
        visible={showBuyModal}
        closable={false}
        className="main-modal"
      >
        <div className="buy-modal">
          <div>
            <Spin />
            <span className="header-text">Do not close this window</span>
          </div>
          <span className="main-text">
            After wallet approval, your transaction will be finished in about
            3s.
          </span>
          <div className="content">
            <span>
              While you are waiting. Join our <a>discord</a> & <a>twitter</a>{' '}
              community for weekly giveaways
            </span>
          </div>
        </div>
      </MetaplexModal>
    </div>
  );
};
