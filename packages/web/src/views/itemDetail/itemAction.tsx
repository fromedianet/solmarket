import {
  ConnectButton,
  MetaplexModal,
  useConnection,
  useNativeAccount,
} from '@oyster/common';
import React, { useState } from 'react';
import { Button, InputNumber, Row, Col, Form, Spin } from 'antd';
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

interface PriceValue {
  number?: number;
}
interface PriceInputProps {
  value?: PriceValue;
  onChange?: (value: PriceValue) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = useState(0);
  const triggerChange = (changedValue: { number?: number }) => {
    onChange?.({ number, ...value, ...changedValue });
  };
  const onNumberChange = (info?: number) => {
    const newNumber = parseFloat(info?.toString() || '0');
    if (Number.isNaN(number)) {
      return;
    }
    setNumber(newNumber);
    triggerChange({ number: newNumber });
  };

  return (
    <InputNumber
      autoFocus
      className="price-input"
      placeholder="Price"
      controls={false}
      addonAfter="SOL"
      bordered={false}
      value={value.number || number}
      onChange={onNumberChange}
    />
  );
};

export const ItemAction = (props: { nft: NFT; onRefresh: () => void }) => {
  const [form] = Form.useForm();
  const wallet = useWallet();
  const connection = useConnection();
  const { account } = useNativeAccount();
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(0);
  const isOwner = props.nft.owner === wallet.publicKey?.toBase58();
  const alreadyListed = props.nft.price || 0 > 0;
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balanceError, setBalanceError] = useState('');

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
        if (result['status'] && !result['status']['err']) {
          setTimeout(() => {
            props.onRefresh();
          }, 7000);
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
    const price = props.nft.price * LAMPORTS_PER_SOL;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result = await sendCancelList({
          connection,
          wallet,
          buyerPrice: price,
          mint: props.nft.mint,
        });
        if (result['status'] && !result['status']['err']) {
          setTimeout(() => {
            props.onRefresh();
          }, 7000);
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
          seller: props.nft.owner,
          wallet,
          buyerPrice: price,
          mint: props.nft.mint,
          nft: props.nft,
        });
        if (result['status'] && !result['status']['err']) {
          setTimeout(() => {
            props.onRefresh();
          }, 7000);
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
          mint: props.nft.mint,
        });
        if (result['status'] && !result['status']['err']) {
          setTimeout(() => {
            props.onRefresh();
          }, 7000);
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
      {alreadyListed && <span className="label">Current Price</span>}
      <div className="price-container">
        <img
          src="/icons/price.svg"
          width={24}
          alt="price"
          style={{ marginRight: '8px' }}
        />
        {alreadyListed && <span className="value">{props.nft.price} SOL</span>}
      </div>
      {!alreadyListed && <span className="value">Not listed</span>}
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button" />
        ) : isOwner ? (
          alreadyListed ? (
            <Button
              className="button"
              onClick={onCancelList}
              disabled={loading}
            >
              {loading ? <Spin /> : 'Cancel Listing'}
            </Button>
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
                    <PriceInput value={{ number: props.nft.price }} />
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
          alreadyListed && (
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
          )
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
