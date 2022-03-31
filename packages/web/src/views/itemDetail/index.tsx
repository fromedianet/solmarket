import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BottomSection } from './bottomSection';
import { MetaplexModal } from '@oyster/common';
import { InfoSection } from './infoSection';
import { EmptyView } from '../../components/EmptyView';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { useNFT } from '../../hooks/useNFT';

export const ItemDetailView = () => {
  const { mint } = useParams<{ mint: string }>();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const history = useHistory();

  const { nft, loading, transactions } = useNFT(mint);

  useEffect(() => {
    const filters = transactions.filter(item => item.txType === 'SALE');
    const data = filters.map(item => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: (item.price || 0) / LAMPORTS_PER_SOL,
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
                priceData={priceData}
                onBuy={() => {}}
                onRefresh={() => history.go(0)}
              />
              <BottomSection transactions={transactions} nft={nft} />
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
