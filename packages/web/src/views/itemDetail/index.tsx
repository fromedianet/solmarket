import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BottomSection } from './bottomSection';
import { InfoSection } from './infoSection';
import { EmptyView } from '../../components/EmptyView';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { useNFT } from '../../hooks/useNFT';

export const ItemDetailView = () => {
  const { mint } = useParams<{ mint: string }>();
  const [priceData, setPriceData] = useState<any[]>([]);
  const history = useHistory();

  const { nft, loading, transactions } = useNFT(mint);

  useEffect(() => {
    const filters = transactions.filter(item => item.txType === 'SALE');
    const data = filters.map(item => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: (item.price || 0),
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
                onRefresh={() => history.go(0)}
              />
              <BottomSection transactions={transactions} nft={nft} />
            </>
          ) : (
            <EmptyView />
          )}
        </div>
      </div>
    </div>
  );
};
