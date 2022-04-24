import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomSection } from './BottomSection';
import { useConnection, useQuerySearch } from '@oyster/common';
import { useExNFT } from '../../hooks/useExNFT';
import { InfoSection } from './InfoSection';
import { EmptyView } from '../../components/EmptyView';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { NFTData, Transaction } from '../../models/exCollection';
import { useWallet } from '@solana/wallet-adapter-react';
import { ApiUtils } from '../../utils/apiUtils';
import { toast } from 'react-toastify';

export const ExNFTView = () => {
  const params = useParams<{ id: string }>();
  const id = params.id || '';
  const searchParams = useQuerySearch();
  const market = searchParams.get('market') || '';
  const price = searchParams.get('price') || '0';
  const collection = searchParams.get('collection') || '';
  const wallet = useWallet();
  const connection = useConnection();
  const { runMagicEdenAPI } = ApiUtils();
  const [loading, setLoading] = useState(false);
  const [nft, setNFT] = useState<NFTData>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);

  const { getExNFTByMintAddress, getExTransactions } = useExNFT();

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
      const nftRes = await getExNFTByMintAddress(id, parseFloat(price));
      const txRes = await getExTransactions(id, market);

      return {
        nft: nftRes,
        transactions: txRes,
      };
    }
    return null;
  }

  const onBuy = async () => {
    if (wallet.publicKey && nft?.v2) {
      const buyer = wallet.publicKey.toBase58();
      const seller = nft.owner;
      const tokenMint = nft.mintAddress;
      const tokenATA = nft.tokenAddress;
      const price = nft.price;
      const auctionHouseAddress = nft.v2.auctionHouseKey;
      const sellerExpiry = nft.v2.expiry;
      const sellerReferral = nft.v2.sellerReferral;

      // eslint-disable-next-line no-async-promise-executor
      const resolveWithData = new Promise(async (resolve, reject) => {
        try {
          // const url = `/instructions/buy_now?buyer=${buyer}&seller=${seller}&tokenMint=${tokenMint}&tokenATA=${tokenATA}&price=${price}&auctionHouseAddress=${auctionHouseAddress}&sellerExpiry=${sellerExpiry}&sellerReferral=${sellerReferral}`;
          // const res: any = await runMagicEdenAPI('get', url);
          // if (res.tx.data) {
          //   const result = await buyNowME({
          //     connection,
          //     wallet,
          //     data: res.tx.data,
          //   });
          //   if (!result['err']) {
          //     resolve('');
          //     return;
          //   }
          // }
          reject();
        } catch (e) {
          reject();
        }
      });

      toast.promise(
        resolveWithData,
        {
          pending: 'Buying now...',
          error: 'Buy now rejected.',
          success: 'Buy now successed. NFT data maybe updated in a minute',
        },
        {
          position: 'top-center',
          theme: 'dark',
          autoClose: 6000,
          hideProgressBar: false,
          pauseOnFocusLoss: false,
        },
      );
    }
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
