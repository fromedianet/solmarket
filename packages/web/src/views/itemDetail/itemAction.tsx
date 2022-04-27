import {
  AUCTION_HOUSE_ID,
  ConnectButton,
  MetaplexModal,
  notify,
  sendTransactionWithRetry,
  useConnection,
  useNativeAccount,
} from '@oyster/common';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Spin } from 'antd';
import { NFT } from '../../models/exCollection';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { LAMPORTS_PER_SOL, Message, Transaction } from '@solana/web3.js';
import { PriceInput } from '../../components/PriceInput';
import { useSocket } from '../../contexts/socketProvider';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';

export const ItemAction = (props: { nft: NFT; onRefresh: () => void }) => {
  const [form] = Form.useForm();
  const wallet = useWallet();
  const connection = useConnection();
  const { socket } = useSocket();
  const { account } = useNativeAccount();
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const { buyNow, list, cancelList, placeBid, buyNowME, placeBidME, cancelListME } =
    useInstructionsAPI();

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

  const onChangeOffer = (value: number) => {
    let err = '';
    if (value < props.nft.price / 2) {
      err = 'Price must be higher than 50% of the listing price';
    } else if (value >= props.nft.price) {
      err = 'Price must be lower than listing price';
    }

    if (value > balance) {
      setBalanceError('Not enough balance in the wallet');
    } else {
      setBalanceError('');
    }
    setError(err);
    setOfferPrice(value);
  };

  const onListNow = async values => {
    if (!wallet.publicKey) return;
    if (props.nft.market) {
      notify({
        message: 'Commint soon!',
        type: 'info',
      });
      return;
    }
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result: any = await list({
          seller: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: props.nft.mint,
          price: values.price.number,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              socket.emit('syncAuctionHouse', { mint: props.nft.mint });
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
        pending: 'Listing now...',
        error: 'Listing rejected.',
        success: 'Listing successed. NFT data maybe updated in a minute',
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
                const status = await runInstructions(data);
                if (!status['err']) {
                  setTimeout(() => {
                    props.onRefresh();
                  }, 20000);
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
              const status = await runInstructions(data);
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
        pending: 'Cancel listing now...',
        error: 'Cancel listing rejected.',
        success: 'Cancel listing successed. NFT data maybe updated in a minute',
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
                const status = await runInstructions(data);
                if (!status['err']) {
                  setTimeout(() => {
                    props.onRefresh();
                  }, 20000);
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
              const status = await runInstructions(data);
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
        pending: 'Purchase now...',
        error: 'Purchase rejected.',
        success: 'Purchase successed. NFT data maybe updated in a minute',
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
                const status = await runInstructions(data);
                if (!status['err']) {
                  setTimeout(() => {
                    props.onRefresh();
                  }, 20000);
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
              const status = await runInstructions(data);
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
        pending: 'Place bid now...',
        error: 'Bid rejected.',
        success: 'Bid successed. NFT data maybe updated in a minute',
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

  const test = async () => {
    // list transaction
    const data = Buffer.from([
      1,
      0,
      6,
      10,
      0,
      242,
      50,
      216,
      41,
      113,
      116,
      219,
      187,
      235,
      159,
      102,
      25,
      228,
      22,
      218,
      103,
      162,
      254,
      64,
      126,
      219,
      145,
      83,
      249,
      241,
      145,
      252,
      50,
      101,
      25,
      152,
      96,
      161,
      106,
      20,
      65,
      54,
      46,
      124,
      125,
      26,
      88,
      179,
      114,
      181,
      236,
      167,
      152,
      202,
      65,
      246,
      14,
      135,
      115,
      233,
      40,
      112,
      226,
      156,
      1,
      194,
      12,
      53,
      123,
      21,
      101,
      120,
      70,
      68,
      137,
      4,
      26,
      150,
      92,
      243,
      193,
      45,
      39,
      31,
      101,
      169,
      70,
      132,
      187,
      164,
      103,
      51,
      81,
      4,
      173,
      205,
      136,
      208,
      224,
      116,
      0,
      11,
      227,
      225,
      235,
      161,
      122,
      71,
      63,
      137,
      176,
      247,
      232,
      226,
      73,
      64,
      242,
      10,
      235,
      142,
      188,
      167,
      26,
      136,
      253,
      233,
      93,
      75,
      131,
      183,
      26,
      9,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      255,
      154,
      107,
      30,
      246,
      129,
      5,
      75,
      187,
      144,
      223,
      211,
      119,
      126,
      158,
      160,
      255,
      64,
      70,
      244,
      251,
      105,
      236,
      116,
      122,
      138,
      129,
      240,
      154,
      81,
      91,
      43,
      8,
      175,
      246,
      228,
      16,
      89,
      36,
      102,
      175,
      155,
      72,
      107,
      229,
      118,
      121,
      242,
      246,
      139,
      65,
      205,
      220,
      49,
      224,
      32,
      146,
      119,
      74,
      143,
      99,
      98,
      237,
      19,
      195,
      27,
      24,
      204,
      62,
      20,
      138,
      10,
      82,
      147,
      129,
      137,
      32,
      237,
      250,
      237,
      171,
      57,
      30,
      73,
      51,
      108,
      11,
      116,
      219,
      102,
      157,
      16,
      71,
      3,
      66,
      75,
      6,
      221,
      246,
      225,
      215,
      101,
      161,
      147,
      217,
      203,
      225,
      70,
      206,
      235,
      121,
      172,
      28,
      180,
      133,
      237,
      95,
      91,
      55,
      145,
      58,
      140,
      245,
      133,
      126,
      255,
      0,
      169,
      5,
      33,
      159,
      137,
      154,
      129,
      212,
      255,
      132,
      251,
      89,
      61,
      46,
      223,
      138,
      144,
      172,
      27,
      58,
      179,
      66,
      88,
      247,
      223,
      35,
      62,
      165,
      3,
      2,
      177,
      189,
      46,
      52,
      174,
      229,
      2,
      10,
      88,
      120,
      35,
      244,
      73,
      58,
      161,
      126,
      94,
      29,
      49,
      106,
      108,
      195,
      6,
      47,
      149,
      135,
      116,
      105,
      226,
      250,
      201,
      130,
      214,
      113,
      27,
      1,
      9,
      10,
      0,
      4,
      1,
      5,
      6,
      7,
      2,
      6,
      8,
      3,
      32,
      198,
      198,
      130,
      203,
      163,
      95,
      175,
      75,
      0,
      232,
      118,
      72,
      23,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      255
  ]);
    await runInstructions(data);
  };

  async function runInstructions(data: Buffer) {
    let status: any = { err: true };
    try {
      const transaction = Transaction.populate(Message.from(data));
      console.log('---- transaction ---', transaction);
      const { txid } = await sendTransactionWithRetry(
        connection,
        wallet,
        transaction.instructions,
        [],
      );

      if (txid) {
        status = await connection.confirmTransaction(txid, 'confirmed');
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
        title="Make an Offer"
        visible={showOfferModal}
        closable
        onCancel={() => setShowOfferModal(false)}
        centered={true}
      >
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 16,
            }}
          >
            <PriceInput
              value={{ number: offerPrice }}
              placeholder="Price"
              addonAfter="SOL"
              onChange={value => onChangeOffer(value.number!)}
            />
            {error && <span className="warning">{error}</span>}
            {balanceError && <span className="warning">{balanceError}</span>}
          </div>
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
        </div>
      </MetaplexModal>
    </div>
  );
};
