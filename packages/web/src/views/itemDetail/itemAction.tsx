import {
  AUCTION_HOUSE_ID,
  ConnectButton,
  formatAmount,
  MetaplexModal,
  sendTransactionWithRetry,
  useConnection,
  useNativeAccount,
} from '@oyster/common';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Spin, Divider } from 'antd';
import { NFT } from '../../models/exCollection';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import {
  Connection,
  LAMPORTS_PER_SOL,
  Message,
  Transaction,
} from '@solana/web3.js';
import { PriceInput } from '../../components/PriceInput';
import { useSocket } from '../../contexts/socketProvider';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';
import { MarketType, meConnection, ME_AUCTION_HOUSE_ID } from '../../constants';
import { Link } from 'react-router-dom';
import { showEscrow } from '../../actions/showEscrow';
import { useExNftAPI } from '../../hooks/useExNftAPI';

export const ItemAction = (props: { nft: NFT; onRefresh: () => void }) => {
  const [form] = Form.useForm();
  const wallet = useWallet();
  const connection = useConnection();
  const { socket } = useSocket();
  const { account } = useNativeAccount();
  const mainBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const {
    buyNow,
    list,
    cancelList,
    placeBid,
    buyNowME,
    placeBidME,
    listME,
    cancelListME,
  } = useInstructionsAPI();
  const { getExEscrowBalance } = useExNftAPI();

  const [biddingBalance, setBiddingBalance] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(0);
  const isOwner = props.nft.owner === wallet.publicKey?.toBase58();
  const isOfferAccepted = props.nft.txType === 'ACCEPT OFFER';
  const isWinner = props.nft.bookKeeper === wallet.publicKey?.toBase58();
  const alreadyListed = props.nft.price || 0 > 0;
  const showCurrentPrice =
    (alreadyListed && !isOfferAccepted) ||
    (alreadyListed && isOwner) ||
    (alreadyListed && isOfferAccepted && isWinner);
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balanceError, setBalanceError] = useState('');

  useEffect(() => {
    if (socket && !props.nft.market) {
      socket.on('syncedAuctionHouse', (params: any[]) => {
        if (params.some(k => k.mint === props.nft.mint)) {
          props.onRefresh();
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (wallet.publicKey) {
      if (!props.nft.market) {
        showEscrow(connection, wallet.publicKey).then(val =>
          setBiddingBalance(val),
        );
      } else {
        getExEscrowBalance({
          wallet: wallet.publicKey.toBase58(),
          auctionHouse: ME_AUCTION_HOUSE_ID,
          market: MarketType.MagicEden,
        }).then(val => setBiddingBalance(val));
      }
    }
  }, [props.nft, wallet]);

  const onChangeOffer = (value: number) => {
    let err = '';
    if (value < props.nft.price / 2) {
      err = 'Price must be higher than 50% of the listing price';
    } else if (value >= props.nft.price) {
      err = 'Price must be lower than listing price';
    }

    if (value > mainBalance) {
      setBalanceError('Not enough balance in the wallet');
    } else {
      setBalanceError('');
    }
    setError(err);
    setOfferPrice(value);
  };

  const onListNow = async values => {
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (props.nft.market) {
          const result: any = await listME({
            seller: wallet.publicKey!.toBase58(),
            auctionHouseAddress: ME_AUCTION_HOUSE_ID,
            tokenAccount: props.nft.tokenAddress,
            tokenMint: props.nft.mint,
            price: values.price.number,
            expiry: -1,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, meConnection);
              if (!status['err']) {
                setTimeout(() => {
                  props.onRefresh();
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
            tokenMint: props.nft.mint,
            price: values.price.number,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: props.nft.mint });
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
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (props.nft.market) {
          if (props.nft.v2 && props.nft.escrowPubkey) {
            const result: any = await cancelListME({
              seller: wallet.publicKey!.toBase58(),
              auctionHouseAddress: props.nft.v2.auctionHouseKey,
              tokenMint: props.nft.mint,
              escrowPayment: props.nft.escrowPubkey,
              price: props.nft.price,
              expiry: props.nft.v2.expiry,
            });
            if ('data' in result) {
              const data = result['data']['data'];
              if (data) {
                const status = await runInstructions(data, meConnection);
                if (!status['err']) {
                  setTimeout(() => {
                    props.onRefresh();
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
            tokenMint: props.nft.mint,
            price: props.nft.price,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: props.nft.mint });
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
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (props.nft.market) {
          if (props.nft.v2 && props.nft.escrowPubkey) {
            const result: any = await buyNowME({
              buyer: wallet.publicKey!.toBase58(),
              seller: props.nft.owner,
              auctionHouseAddress: props.nft.v2.auctionHouseKey,
              tokenMint: props.nft.mint,
              escrowPubkey: props.nft.escrowPubkey,
              expiry: props.nft.v2.expiry,
              price: props.nft.price,
            });
            if ('data' in result) {
              const data = result['data']['data'];
              if (data) {
                const status = await runInstructions(data, meConnection);
                if (!status['err']) {
                  setTimeout(() => {
                    props.onRefresh();
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
            seller: props.nft.owner,
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: props.nft.mint,
            price: props.nft.price,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: props.nft.mint });
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

  const onPlaceBid = async () => {
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (props.nft.market) {
          if (props.nft.v2) {
            const result: any = await placeBidME({
              buyer: wallet.publicKey!.toBase58(),
              auctionHouseAddress: props.nft.v2.auctionHouseKey,
              tokenMint: props.nft.mint,
              price: offerPrice,
            });
            if ('data' in result) {
              const data = result['data']['data'];
              if (data) {
                const status = await runInstructions(data, meConnection);
                if (!status['err']) {
                  setTimeout(() => {
                    props.onRefresh();
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
            seller: props.nft.owner,
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: props.nft.mint,
            price: offerPrice,
          });
          if ('data' in result) {
            const data = result['data']['data'];
            if (data) {
              const status = await runInstructions(data, connection);
              if (!status['err']) {
                socket.emit('syncAuctionHouse', { mint: props.nft.mint });
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
    <div className="action-view">
      {showCurrentPrice && <span className="label">Current Price</span>}
      <div className="price-container">
        <img
          src="/icons/price.svg"
          width={24}
          alt="price"
          style={{ marginRight: '8px' }}
        />
        {showCurrentPrice && (
          <span className="value">{props.nft.price} SOL</span>
        )}
      </div>
      {!showCurrentPrice && <span className="value">Not listed</span>}
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button" />
        ) : isOwner ? (
          alreadyListed ? (
            isOfferAccepted ? (
              <span className="value">Offer is already accepted</span>
            ) : (
              <Button
                className="button"
                onClick={onCancelList}
                disabled={loading}
              >
                {loading ? <Spin /> : 'Cancel Listing'}
              </Button>
            )
          ) : (
            <Form
              form={form}
              name="price-control"
              layout="inline"
              onFinish={onListNow}
            >
              <Row style={{ width: '100%' }}>
                <Col span={12}>
                  <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                    <PriceInput
                      value={{ number: props.nft.price }}
                      placeholder="Price"
                      addonAfter="SOL"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Button
                      className="button"
                      htmlType="submit"
                      disabled={loading}
                    >
                      {loading ? <Spin /> : 'List Now'}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )
        ) : (
          alreadyListed &&
          (isOfferAccepted ? (
            isWinner && (
              <Button className="button" onClick={onBuyNow} disabled={loading}>
                Claim
              </Button>
            )
          ) : (
            <Row gutter={16}>
              <Col span={10}>
                <Button
                  className="button"
                  onClick={onBuyNow}
                  disabled={loading}
                >
                  Buy Now
                </Button>
              </Col>
              <Col span={14}>
                <Button
                  className="button"
                  onClick={() => {
                    setShowOfferModal(true);
                    onChangeOffer(offerPrice);
                  }}
                  disabled={loading}
                >
                  Make an Offer
                </Button>
              </Col>
            </Row>
          ))
        )}
      </div>
      <MetaplexModal
        className="make-offer-modal"
        visible={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
      >
        <div>
          <span className="header-text">Make an offer</span>
          <div className="body-container">
            <p className="description">
              When you make an offer, the funds are kept in your bidding wallet
              to allow you to make multiple offers using the same funds. To
              view, deposit, or withdraw from your bidding wallet, please visit
              the &apos;Offers Made&apos; page of your profile.
            </p>
            <button className="option-button">
              <span>Fund the offer</span>
              <span className="sub-title">
                Transfer money from your main wallet to the bidding wallet
                account.
              </span>
            </button>
            <Row style={{ width: '100%', marginTop: 24, marginBottom: 24 }}>
              <Col span={16}>
                <PriceInput
                  value={{ number: offerPrice }}
                  placeholder="Price"
                  addonAfter="SOL"
                  onChange={value => onChangeOffer(value.number!)}
                />
                {error && <span className="warning">{error}</span>}
                {balanceError && (
                  <span className="warning">{balanceError}</span>
                )}
              </Col>
              <Col span={7} style={{ marginLeft: 16 }}>
                <Button
                  className="button"
                  onClick={() => {
                    setShowOfferModal(false);
                    onPlaceBid();
                  }}
                  disabled={error !== '' || balanceError !== ''}
                >
                  Make offer
                </Button>
              </Col>
            </Row>
            <span className="nft-name">{props.nft.name}</span>
            <span className="nft-symbol">
              {props.nft.symbol}
              <img
                src="/icons/check.svg"
                style={{ width: 14, height: 14, marginLeft: 8 }}
              />
            </span>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label text-gray">Buy now price</span>
              <span className="wallet-label text-gray">{`${parseFloat(
                props.nft.price.toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Minimum offer (50%)</span>
              <span className="wallet-label">{`${parseFloat(
                (props.nft.price * 0.5).toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Main wallet balance</span>
              <span className="wallet-label">{`${parseFloat(
                mainBalance.toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Bidding wallet balance</span>
              <span className="wallet-label">{`${parseFloat(
                biddingBalance.toFixed(5),
              )} SOL`}</span>
            </div>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label">
                New main wallet balance{' '}
                {offerPrice > 0 ? (
                  <span style={{ color: '#ffaa00' }}>{` -${formatAmount(
                    offerPrice,
                  )} SOL`}</span>
                ) : (
                  ''
                )}
              </span>
              <span className="wallet-label">{`${parseFloat(
                (mainBalance - offerPrice).toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">
                New bidding wallet balance{' '}
                {offerPrice > 0 ? (
                  <span style={{ color: '#00db80' }}>{` +${formatAmount(
                    offerPrice,
                  )} SOL`}</span>
                ) : (
                  ''
                )}
              </span>
              <span className="wallet-label">{`${parseFloat(
                (biddingBalance + offerPrice).toFixed(5),
              )} SOL`}</span>
            </div>
            <span className="bottom-label">
              By selecting &quot;Make offer&quot;, you agree to{' '}
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
