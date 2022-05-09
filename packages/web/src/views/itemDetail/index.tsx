import React, { useEffect, useState } from 'react';
import { Spin, Button, Divider } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { BottomSection } from './bottomSection';
import { InfoSection } from './infoSection';
import { EmptyView } from '../../components/EmptyView';
import { getDateStringFromUnixTimestamp } from '../../utils/utils';
import { useNFTsAPI } from '../../hooks/useNFTsAPI';
import { NFT, Transaction as TransactionData } from '../../models/exCollection';
import {
  AUCTION_HOUSE_ID,
  MetaplexModal,
  sendTransaction,
  useConnection,
  useQuerySearch,
} from '@oyster/common';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
import { meConnection } from '../../constants';
import { Offer } from '../../models/offer';
import { useWallet } from '@solana/wallet-adapter-react';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';
import { toast } from 'react-toastify';
import { Connection, Message, Transaction } from '@solana/web3.js';
import { useSocket } from '../../contexts';
import { showEscrow } from '../../actions/showEscrow';
import { useMEApis } from '../../hooks/useMEApis';

export const ItemDetailView = () => {
  const params = useParams<{ mint: string }>();
  const mint = params.mint || '';
  const searchParams = useQuerySearch();
  const market = searchParams.get('market');
  const wallet = useWallet();
  const connection = useConnection();
  const { socket } = useSocket();
  const [nft, setNFT] = useState<NFT>();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [nftList, setNFTList] = useState<NFT[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [myOffer, setMyOffer] = useState<Offer>();
  const [refresh, setRefresh] = useState(0);
  const [biddingBalance, setBiddingBalance] = useState(0);
  const [cancelVisible, setCancelVisible] = useState(false);
  const { getNftByMint, getListedNftsByQuery } = useNFTsAPI();
  const { getTransactionsByMint, getOffersByMints } = useTransactionsAPI();
  const { buyNow, list, cancelList, placeBid, cancelBid, buyNowME } =
    useInstructionsAPI();
  const meApis = useMEApis();

  useEffect(() => {
    if (nft) {
      if (socket && !nft.market) {
        socket.on('syncedAuctionHouse', (params: any[]) => {
          if (params.some(k => k.mint === nft.mint)) {
            setRefresh(Date.now());
          }
        });

        socket.on('syncedNFTsByOwner', (params: any) => {
          if (params.wallet === wallet.publicKey?.toBase58()) {
            setRefresh(Date.now());
          }
        });
      }
    }
  }, [socket, nft]);

  useEffect(() => {
    getNFT().then(res => {
      if (res) setNFT(res);
    });

    getTransactions().then(res => setTransactions(res));
  }, [mint, market, refresh]);

  useEffect(() => {
    const filters = transactions.filter(
      item => item.txType === 'SALE' || item.txType === 'Auction Settled',
    );
    const data = filters.map(item => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: item.price || 0,
    }));

    setPriceData(data.reverse());
  }, [transactions]);

  useEffect(() => {
    if (nft) {
      getListedNFTs(nft).then(res => setNFTList(res));
      getEscrowBalance().then(val => setBiddingBalance(val));
      getOffers(mint, nft.owner).then(res => {
        setOffers(res);
      });
    }
  }, [nft, wallet]);

  useEffect(() => {
    if (wallet.publicKey && offers.length > 0) {
      const offer = offers.find(k => k.buyer === wallet.publicKey!.toBase58());
      if (offer) {
        setMyOffer(offer);
      }
    }
  }, [wallet, offers]);

  async function getNFT() {
    if (!mint) return undefined;
    if (loadingPage) return;
    setLoadingPage(true);

    let result = await getNftByMint(mint);
    if (!result) {
      result = await meApis.getNFTByMintAddress(mint);
    }

    setLoadingPage(false);
    return result;
  }

  async function getTransactions(): Promise<any[]> {
    let data = await getTransactionsByMint(mint);
    const exData = await meApis.getTransactionsByMint(mint);
    data = data.concat(exData);
    data.sort((a, b) => {
      if (b.blockTime > a.blockTime) {
        return 1;
      } else if (b.blockTime < a.blockTime) {
        return -1;
      } else {
        if (b.id > a.id) {
          return 1;
        } else if (b.id < a.id) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    return data;
  }

  async function getListedNFTs(nftItem: NFT) {
    let result: any[] = [];
    const param = {
      symbol: nftItem.symbol,
      sort: 1,
      type: 0,
      status: false,
    };
    const res: any = await getListedNftsByQuery(param);
    if ('data' in res) {
      result = res['data'];
    }
    result = result.filter(item => item.mint != nftItem.mint);
    return result;
  }

  async function getOffers(mintAddress: string, owner: string) {
    let list: Offer[] = await getOffersByMints({
      mints: [mintAddress],
      owner: owner,
    });

    list = list.map((item, index) => ({
      ...item,
      key: index,
    }));
    return list;
  }

  const onListNow = async (price: number) => {
    if (!wallet.publicKey || !nft) return;

    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result: any = await list({
          seller: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: nft.mint,
          price: price,
        });
        if (result && 'data' in result) {
          const status = await runInstructions(result['data'], connection);
          if (!status['err']) {
            socket.emit('syncAuctionHouse', { mint: nft.mint });
            resolve('');
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
    );
  };

  const onCancelList = async () => {
    if (!wallet.publicKey || !nft) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result: any = await cancelList({
          seller: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: nft.mint,
          price: nft.price,
        });
        if (result && 'data' in result) {
          const status = await runInstructions(result['data'], connection);
          if (!status['err']) {
            socket.emit('syncAuctionHouse', { mint: nft.mint });
            resolve('');
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
    );
  };

  const onBuyNow = async () => {
    if (!wallet.publicKey || !nft) return;
    if (nft.market && !nft.v2) {
      // For ME v1 it redirects to the MagicEden site
      window.open(`https://magiceden.io/item-details/${nft.mint}`, '_blank');
      return;
    }
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (nft.market) {
          if (nft.v2 && nft.escrowPubkey) {
            const result: any = await buyNowME({
              buyer: wallet.publicKey!.toBase58(),
              seller: nft.owner,
              auctionHouseAddress: nft.v2.auctionHouseKey,
              tokenMint: nft.mint,
              escrowPubkey: nft.escrowPubkey,
              expiry: nft.v2.expiry,
              price: nft.price,
            });
            if (result && 'data' in result) {
              const status = await runInstructions(
                result['data'],
                meConnection,
              );
              if (!status['err']) {
                setTimeout(() => {
                  socket.emit('syncGetNFTsByOwner', {
                    wallet: wallet.publicKey?.toBase58(),
                  });
                }, 20000);
                resolve('');
                return;
              }
            }
          }
        } else {
          const result: any = await buyNow({
            buyer: wallet.publicKey!.toBase58(),
            seller: nft.owner,
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: nft.mint,
            price: nft.price,
          });
          if (result && 'data' in result) {
            const status = await runInstructions(result['data'], connection);
            if (!status['err']) {
              socket.emit('syncAuctionHouse', { mint: nft.mint });
              resolve('');
              return;
            }
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
    );
  };

  const onPlaceBid = async (price: number) => {
    if (!wallet.publicKey || !nft) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        // Own marketplace placeBid
        const result: any = await placeBid({
          buyer: wallet.publicKey!.toBase58(),
          seller: nft.owner,
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: nft.mint,
          price: price,
        });
        if (result && 'data' in result) {
          const status = await runInstructions(result['data'], connection);
          if (!status['err']) {
            socket.emit('syncAuctionHouse', { mint: nft.mint });
            resolve('');
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
    );
  };

  const onCancelBid = (offer: Offer) => {
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await cancelBid({
          buyer: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: offer.mint,
          tokenAccount: offer.tokenAccount,
          tradeState: offer.tradeState!,
          price: offer.bidPrice,
        });
        if (result && 'data' in result) {
          const status = await runInstructions(result['data'], connection);
          if (!status['err']) {
            socket.emit('syncAuctionHouse', {
              wallet: wallet.publicKey!.toBase58(),
            });
            resolve('');
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
    );
  };

  async function getEscrowBalance() {
    let result = 0;
    if (wallet.publicKey && nft) {
      result = await showEscrow(connection, wallet.publicKey);
    }
    return result;
  }

  async function runInstructions(data: Buffer, _connection: Connection) {
    let status: any = { err: true };
    try {
      const transaction = Transaction.populate(Message.from(data));
      console.log('---- transaction ---', transaction);
      const { txid } = await sendTransaction(
        _connection,
        wallet,
        transaction.instructions,
        [],
      );

      if (txid) {
        status = await _connection.confirmTransaction(txid, 'confirmed');
      }
    } catch (e) {
      console.error('----- runInstructions error ------------', e);
    }
    return status;
  }

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container art-container">
          {loadingPage ? (
            <Spin />
          ) : nft ? (
            <>
              <InfoSection
                nft={nft}
                loading={loading}
                market={market}
                biddingBalance={biddingBalance}
                priceData={priceData}
                myOffer={myOffer}
                onRefresh={() => setRefresh(Date.now())}
                onListNow={onListNow}
                onCancelList={onCancelList}
                onBuyNow={onBuyNow}
                onPlaceBid={onPlaceBid}
                onCancelVisible={() => setCancelVisible(true)}
              />
              <BottomSection
                transactions={transactions}
                nft={nft}
                nftList={nftList}
                market={market}
                offers={offers}
                setMyOffer={val => setMyOffer(val)}
                onCancelVisible={() => setCancelVisible(true)}
              />
            </>
          ) : (
            <EmptyView />
          )}
        </div>
      </div>
      <MetaplexModal
        className="cancel-modal"
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
      >
        <div>
          <span className="header-text">
            {myOffer?.market ? 'Cancel the offer (ME)' : 'Cancel the offer'}
          </span>
          <div className="body-container">
            <span className="description">
              When your offer is canceled, the funds will remain in your bidding
              wallet until you withdraw them. This is to allow your other bids
              to remain open and prevent them from becoming invalid. When
              you&apos;re ready to withdraw the funds from your bidding wallet,
              you can do so from the &apos;Offers Made&apos; page of your
              profile.
            </span>
            <Button
              className="button"
              onClick={() => {
                setCancelVisible(false);
                onCancelBid(myOffer!);
              }}
            >
              Cancel offer
            </Button>
            <span className="nft-name" style={{ marginTop: 24 }}>
              {`${myOffer?.name} ${myOffer?.market ? `(ME)` : ''}`}
            </span>
            <span className="nft-symbol">
              {myOffer?.symbol}
              <img
                src="/icons/check.svg"
                style={{ width: 14, height: 14, marginLeft: 8 }}
              />
            </span>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label text-gray">Buy now price</span>
              <span className="wallet-label text-gray">
                {`${parseFloat((myOffer?.listingPrice || 0).toFixed(5))} SOL`}
              </span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Your offer</span>
              <span className="wallet-label">
                {`${parseFloat((myOffer?.bidPrice || 0).toFixed(5))} SOL`}
              </span>
            </div>
            <span className="bottom-label">
              By selecting &quot;Cancel offer&quot;, you agree to{' '}
              <Link to="" style={{ fontWeight: 600 }}>
                Terms of Service
              </Link>
            </span>
          </div>
        </div>
      </MetaplexModal>
    </div>
  );
};
