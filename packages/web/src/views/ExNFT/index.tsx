import React, { useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomSection } from './BottomSection';
import { MetaplexModal, useQuerySearch } from '@oyster/common';
import { useExNFT } from '../../hooks/useExNFT';
import { InfoSection } from './InfoSection';
import { EmptyView } from '../../components/EmptyView';

export const ExNFTView = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useQuerySearch();
  const market = searchParams.get('market') || '';
  const price = searchParams.get('price') || '0';
  const [showBuyModal, setShowBuyModal] = useState(false);

  const { nft, loading, transactions } = useExNFT(
    id,
    market,
    parseFloat(price),
  );

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container art-container">
          {loading ? (
            <Spin />
          ) : nft ? (
            <>
              <InfoSection nft={nft} onBuy={() => {}} onRefresh={() => {}} />
              <BottomSection
                transactions={transactions}
                market={market}
                price={price}
                mint={id}
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
