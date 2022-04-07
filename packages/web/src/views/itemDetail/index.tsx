import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomSection } from './bottomSection';
import { InfoSection } from './infoSection';
import { EmptyView } from '../../components/EmptyView';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { useNFT } from '../../hooks/useNFT';
import { useNFTsAPI } from '../../hooks/useNFTsAPI';
import { NFT } from '../../models/exCollection';
import { getQueryPrameter } from '../../hooks/useCollection';

export const ItemDetailView = () => {
  const { mint } = useParams<{ mint: string }>();
  const [priceData, setPriceData] = useState<any[]>([]);
  const [nftList, setNFTList] = useState<NFT[]>([]);
  const [refresh, setRefresh] = useState(0);
  const { getListedNftsByQuery } = useNFTsAPI();
  const { nft, loading, transactions } = useNFT(mint, refresh);

  useEffect(() => {
    const filters = transactions.filter(item => item.txType === 'SALE');
    const data = filters.map(item => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: item.price || 0,
    }));

    setPriceData(data);
  }, [transactions]);

  useEffect(() => {
    if (nft) {
      const query = getQueryPrameter({
        symbol: nft.symbol,
        sort: 1,
        status: false,
      });
      getListedNftsByQuery(query)
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            const data = res['data'].filter(item => item.mint !== nft.mint);
            setNFTList(data);
          }
        });
    }
  }, [nft]);

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
