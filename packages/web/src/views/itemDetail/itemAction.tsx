import {
  ConnectButton,
  MetaplexModal,
  useConnection,
  useNativeAccount,
} from '@oyster/common';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Spin } from 'antd';
import { NFT } from '../../models/exCollection';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import {
  sendList,
  sendCancelList,
  sendSell,
  sendPlaceBid,
} from '../../actions/auctionHouse';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PriceInput } from '../../components/PriceInput';
import { useSocket } from '../../contexts/socketProvider';

export const ItemAction = (props: { nft: NFT; onRefresh: () => void }) => {
  const [form] = Form.useForm();
  const wallet = useWallet();
  const connection = useConnection();
  const { socket } = useSocket();
  const { account } = useNativeAccount();
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
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
    if (socket) {
      socket.on('syncedAuctionHouse', (params: any[]) => {
        console.log(
          '----------------- syncedAuctionHouse ------------------',
          params,
        );
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
    const price = values.price.number * LAMPORTS_PER_SOL;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result = await sendList({
          connection,
          wallet,
          buyerPrice: price,
          mint: props.nft.mint,
        });
        if (!result['err']) {
          socket.emit('auctionHouse', { mint: props.nft.mint });
          resolve('');
        } else {
          reject();
        }
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
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result = await sendCancelList({
          connection,
          wallet,
          nft: props.nft,
        });
        if (!result['err']) {
          socket.emit('auctionHouse', { mint: props.nft.mint });
          resolve('');
        } else {
          reject();
        }
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
    const price = props.nft.price * LAMPORTS_PER_SOL;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result = await sendSell({
          connection,
          wallet,
          buyerPrice: price,
          nft: props.nft,
        });
        if (!result['err']) {
          socket.emit('auctionHouse', { mint: props.nft.mint });
          resolve('');
        } else {
          reject();
        }
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

  const onMakeOffer = async () => {
    const price = offerPrice * LAMPORTS_PER_SOL;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result = await sendPlaceBid({
          connection,
          wallet,
          buyerPrice: price,
          nft: props.nft,
        });
        if (!result['err']) {
          socket.emit('auctionHouse', { mint: props.nft.mint });
          resolve('');
        } else {
          reject();
        }
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
              onMakeOffer();
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
