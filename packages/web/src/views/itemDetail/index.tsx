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
  sendTransactionWithRetry,
  useConnection,
  useQuerySearch,
} from '@oyster/common';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
import { useExNftAPI } from '../../hooks/useExNftAPI';
import { useMECollectionsAPI } from '../../hooks/useMECollectionsAPI';
import { MarketType, meConnection, ME_AUCTION_HOUSE_ID } from '../../constants';
import { Offer } from '../../models/offer';
import { useWallet } from '@solana/wallet-adapter-react';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';
import { toast } from 'react-toastify';
import { Connection, Message, Transaction } from '@solana/web3.js';
import { useSocket } from '../../contexts';
import { showEscrow } from '../../actions/showEscrow';

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
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [nftList, setNFTList] = useState<NFT[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [myOffer, setMyOffer] = useState<Offer>();
  const [refresh, setRefresh] = useState(0);
  const [biddingBalance, setBiddingBalance] = useState(0);
  const [cancelVisible, setCancelVisible] = useState(false);
  const { getNftByMint, getListedNftsByQuery } = useNFTsAPI();
  const { getTransactionsByMint } = useTransactionsAPI();
  const { getExNFTByMintAddress, getExTransactions, getExEscrowBalance } =
    useExNftAPI();
  const { getMEListedNFTsByCollection, getMEBiddingQuery } =
    useMECollectionsAPI();
  const {
    buyNow,
    list,
    cancelList,
    placeBid,
    cancelBid,
    buyNowME,
    placeBidME,
    listME,
    cancelListME,
    cancelBidME,
  } = useInstructionsAPI();

  useEffect(() => {
    if (nft) {
      if (socket && !nft.market) {
        socket.on('syncedAuctionHouse', (params: any[]) => {
          if (params.some(k => k.mint === nft.mint)) {
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

    getOffers(mint).then(res => {
      setOffers(res);
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
      getEscrowBalance().then(val => setBiddingBalance(val));
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

  async function getOffers(mintAddress: string) {
    let list: Offer[] = [];
    const query = {
      $match: {
        initializerDepositTokenMintAccount: {
          $in: [mintAddress],
        },
      },
      $sort: { createdAt: -1 },
    };
    const params = `?q=${encodeURI(JSON.stringify(query))}`;
    const res = await getMEBiddingQuery({
      market: MarketType.MagicEden,
      params: params,
    });
    list = list.concat(res);
    list = list.map((item, index) => ({
      ...item,
      key: index,
    }));
    console.log('offers -------------', list);
    return list;
  }

  const onListNow = async (price: number) => {
    if (!wallet.publicKey || !nft) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (nft.market) {
          const result: any = await listME({
            seller: wallet.publicKey!.toBase58(),
            auctionHouseAddress: ME_AUCTION_HOUSE_ID,
            tokenAccount: nft.tokenAddress,
            tokenMint: nft.mint,
            price: price,
            expiry: -1,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, meConnection);
              if (!status['err']) {
                setTimeout(() => {
                  setRefresh(Date.now());
                }, 30000);
                resolve('');
                return;
              }
            }
          }
        } else {
          const result: any = await list({
            seller: wallet.publicKey!.toBase58(),
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: nft.mint,
            price: price,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: nft.mint });
                resolve('');
                return;
              }
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

  const onCancelList = async () => {
    if (!wallet.publicKey || !nft) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (nft.market) {
          if (nft.v2 && nft.escrowPubkey) {
            const result: any = await cancelListME({
              seller: wallet.publicKey!.toBase58(),
              auctionHouseAddress: nft.v2.auctionHouseKey,
              tokenMint: nft.mint,
              escrowPayment: nft.escrowPubkey,
              price: nft.price,
              expiry: nft.v2.expiry,
            });
            if ('data' in result) {
              const data = result['data']['data'];
              if (data) {
                const status = await runInstructions(data, meConnection);
                if (!status['err']) {
                  setTimeout(() => {
                    setRefresh(Date.now());
                  }, 30000);
                  resolve('');
                  return;
                }
              }
            }
          }
        } else {
          const result: any = await cancelList({
            seller: wallet.publicKey!.toBase58(),
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: nft.mint,
            price: nft.price,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: nft.mint });
                resolve('');
                return;
              }
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

  const onBuyNow = async () => {
    if (!wallet.publicKey || !nft) return;
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
            if ('data' in result) {
              const data = result['data']['data'];
              if (data) {
                const status = await runInstructions(data, meConnection);
                if (!status['err']) {
                  setTimeout(() => {
                    setRefresh(Date.now());
                  }, 30000);
                  resolve('');
                  return;
                }
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
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: nft.mint });
                resolve('');
                return;
              }
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
        if (nft.market) {
          if (nft.v2) {
            const result: any = await placeBidME({
              buyer: wallet.publicKey!.toBase58(),
              auctionHouseAddress: nft.v2.auctionHouseKey,
              tokenMint: nft.mint,
              price: price,
            });
            if ('data' in result) {
              const data = result['data']['data'];
              if (data) {
                const status = await runInstructions(data, meConnection);
                if (!status['err']) {
                  setTimeout(() => {
                    setRefresh(Date.now());
                  }, 30000);
                  resolve('');
                  return;
                }
              }
            }
          }
        } else {
          // Own marketplace placeBid
          const result: any = await placeBid({
            buyer: wallet.publicKey!.toBase58(),
            seller: nft.owner,
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: nft.mint,
            price: price,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: nft.mint });
                resolve('');
                return;
              }
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

  const onCancelBid = (offer: Offer) => {
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        if (offer.market) {
          if (!offer.auctionHouseKey) {
            reject();
            return;
          }
          const result: any = await cancelBidME({
            buyer: wallet.publicKey!.toBase58(),
            auctionHouseAddress: offer.auctionHouseKey!,
            tokenMint: offer.mint,
            price: offer.bidPrice,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, meConnection);
              if (!status['err']) {
                setTimeout(() => {
                  setRefresh(Date.now());
                }, 30000);
                resolve('');
                return;
              }
            }
          }
        } else {
          const result: any = await cancelBid({
            buyer: wallet.publicKey!.toBase58(),
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: offer.mint,
            tokenAccount: offer.tokenAccount,
            tradeState: offer.tradeState!,
            price: offer.bidPrice,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', {
                  wallet: wallet.publicKey!.toBase58(),
                });
                resolve('');
                return;
              }
            }
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
      if (!nft.market) {
        result = await showEscrow(connection, wallet.publicKey);
      } else {
        result = await getExEscrowBalance({
          wallet: wallet.publicKey.toBase58(),
          auctionHouse: ME_AUCTION_HOUSE_ID,
          market: MarketType.MagicEden,
        });
      }
    }
    return result;
  }

  async function runInstructions(data: Buffer, _connection: Connection) {
    let status: any = { err: true };
    try {
      const transaction = Transaction.populate(Message.from(data));
      console.log('---- transaction ---', transaction);
      const { txid } = await sendTransactionWithRetry(
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
          {loading ? (
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
