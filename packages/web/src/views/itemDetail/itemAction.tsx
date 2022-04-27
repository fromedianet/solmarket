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
  const { buyNow, list, cancelList, placeBid, buyNowME, placeBidME } =
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
      4,
      7,
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
      26,
      140,
      100,
      173,
      69,
      254,
      200,
      58,
      176,
      192,
      193,
      98,
      78,
      178,
      94,
      223,
      202,
      9,
      19,
      221,
      186,
      132,
      4,
      46,
      138,
      175,
      189,
      164,
      34,
      87,
      110,
      0,
      203,
      167,
      215,
      35,
      6,
      193,
      200,
      248,
      46,
      141,
      206,
      77,
      215,
      25,
      240,
      84,
      33,
      246,
      138,
      222,
      194,
      94,
      101,
      28,
      147,
      247,
      33,
      184,
      187,
      4,
      101,
      160,
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
      234,
      68,
      127,
      238,
      104,
      246,
      224,
      209,
      143,
      171,
      191,
      71,
      155,
      159,
      23,
      233,
      134,
      69,
      217,
      51,
      120,
      34,
      142,
      98,
      55,
      240,
      232,
      2,
      190,
      61,
      4,
      28,
      1,
      6,
      7,
      0,
      3,
      1,
      4,
      5,
      2,
      4,
      32,
      238,
      76,
      36,
      218,
      132,
      177,
      224,
      233,
      128,
      240,
      250,
      2,
      0,
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
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
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
                  // onClick={test}
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
