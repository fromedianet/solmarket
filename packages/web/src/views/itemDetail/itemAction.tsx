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
                  }, 10000);
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
                  }, 10000);
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
      1, 0, 9, 20, 0, 242, 50, 216, 41, 113, 116, 219, 187, 235, 159, 102, 25,
      228, 22, 218, 103, 162, 254, 64, 126, 219, 145, 83, 249, 241, 145, 252,
      50, 101, 25, 152, 212, 76, 137, 215, 140, 133, 185, 82, 49, 202, 79, 164,
      64, 102, 62, 121, 109, 108, 250, 52, 84, 171, 42, 87, 94, 139, 153, 9,
      158, 242, 79, 140, 166, 107, 124, 147, 127, 50, 48, 212, 123, 188, 155,
      62, 147, 170, 126, 53, 45, 140, 127, 28, 98, 156, 178, 204, 36, 188, 148,
      94, 81, 186, 11, 167, 185, 172, 170, 107, 135, 20, 4, 149, 87, 46, 226,
      48, 100, 99, 109, 104, 80, 175, 28, 141, 217, 90, 71, 103, 142, 231, 192,
      189, 203, 149, 144, 198, 119, 237, 156, 254, 103, 12, 201, 164, 33, 70, 4,
      70, 148, 232, 81, 23, 163, 240, 162, 193, 164, 147, 113, 4, 160, 35, 49,
      197, 174, 218, 12, 33, 183, 250, 226, 239, 62, 57, 48, 143, 81, 188, 85,
      242, 168, 67, 148, 246, 33, 164, 189, 97, 4, 48, 219, 142, 48, 127, 83,
      53, 23, 130, 61, 78, 12, 158, 58, 228, 224, 183, 152, 74, 250, 18, 157,
      96, 7, 160, 158, 224, 142, 150, 46, 161, 202, 218, 73, 218, 230, 18, 50,
      147, 194, 191, 195, 125, 8, 175, 246, 228, 16, 89, 36, 102, 175, 155, 72,
      107, 229, 118, 121, 242, 246, 139, 65, 205, 220, 49, 224, 32, 146, 119,
      74, 143, 99, 98, 237, 19, 33, 30, 210, 180, 77, 29, 255, 183, 172, 169,
      207, 31, 230, 16, 157, 129, 145, 67, 251, 188, 49, 25, 132, 132, 72, 91,
      2, 169, 160, 106, 240, 200, 222, 149, 14, 117, 55, 221, 240, 173, 218, 64,
      182, 218, 98, 63, 210, 17, 66, 16, 158, 19, 161, 134, 96, 109, 26, 251,
      222, 58, 79, 183, 7, 61, 82, 171, 186, 175, 142, 18, 9, 116, 238, 59, 111,
      65, 223, 96, 54, 209, 6, 235, 133, 186, 83, 181, 70, 77, 254, 81, 151,
      134, 112, 201, 66, 134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 195, 27, 24, 204, 62, 20,
      138, 10, 82, 147, 129, 137, 32, 237, 250, 237, 171, 57, 30, 73, 51, 108,
      11, 116, 219, 102, 157, 16, 71, 3, 66, 75, 125, 128, 41, 105, 204, 106,
      31, 177, 39, 13, 34, 0, 66, 88, 14, 53, 98, 249, 158, 103, 1, 18, 145, 90,
      132, 13, 200, 245, 13, 189, 207, 110, 60, 236, 131, 170, 224, 136, 125,
      80, 220, 194, 46, 56, 20, 162, 246, 56, 207, 224, 136, 103, 3, 221, 64,
      129, 119, 26, 219, 47, 200, 91, 207, 83, 6, 221, 246, 225, 215, 101, 161,
      147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133, 237, 95, 91, 55,
      145, 58, 140, 245, 133, 126, 255, 0, 169, 6, 167, 213, 23, 25, 44, 92, 81,
      33, 140, 201, 76, 61, 74, 241, 127, 88, 218, 238, 8, 155, 161, 253, 68,
      227, 219, 217, 138, 0, 0, 0, 0, 140, 151, 37, 143, 78, 36, 137, 241, 187,
      61, 16, 41, 20, 142, 13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142,
      123, 216, 219, 233, 248, 89, 0, 11, 227, 225, 235, 161, 122, 71, 63, 137,
      176, 247, 232, 226, 73, 64, 242, 10, 235, 142, 188, 167, 26, 136, 253,
      233, 93, 75, 131, 183, 26, 9, 5, 33, 159, 137, 154, 129, 212, 255, 132,
      251, 89, 61, 46, 223, 138, 144, 172, 27, 58, 179, 66, 88, 247, 223, 35,
      62, 165, 3, 2, 177, 189, 46, 210, 7, 148, 142, 110, 225, 110, 50, 51, 1,
      108, 45, 123, 145, 132, 136, 103, 153, 100, 100, 215, 228, 224, 131, 231,
      32, 118, 171, 77, 61, 75, 222, 3, 19, 6, 0, 11, 1, 7, 12, 11, 17, 242, 35,
      198, 137, 82, 225, 242, 182, 255, 128, 201, 110, 10, 1, 0, 0, 0, 19, 12,
      0, 11, 13, 14, 1, 7, 12, 2, 7, 15, 11, 16, 34, 102, 6, 61, 18, 1, 218,
      235, 234, 254, 255, 128, 201, 110, 10, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 19, 22, 0, 3, 11, 4, 13, 14, 1, 5, 7, 12, 6, 2, 7,
      8, 7, 15, 11, 17, 18, 16, 9, 10, 42, 37, 74, 217, 157, 79, 49, 35, 6, 255,
      250, 128, 201, 110, 10, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255,
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
