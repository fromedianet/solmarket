import { ConnectButton, useConnection } from '@oyster/common';
import React, { useState } from 'react';
import { Button, InputNumber, Row, Col, Form, Spin } from 'antd';
import { NFT } from '../../models/exCollection';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { sendList, sendCancelList, sendSell } from '../../actions/auctionHouse';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
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
  const { callList, callCancelList, callSell, callPlaceBid, callCancelBid } =
    useTransactionsAPI();
  const isOwner = props.nft.updateAuthority === wallet.publicKey?.toBase58();
  const alreadyListed = props.nft.price || 0 > 0;
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };
  const [loading, setLoading] = useState(false);

  const onListNow = async values => {
    const price = values.price.number * LAMPORTS_PER_SOL;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result = await sendList(
          connection,
          wallet,
          price,
          props.nft.mint,
        );
        if (result['status'] && !result['status']['err']) {
          const txId = result['txid'];
          if (txId) {
            await callList({
              transaction: txId,
              seller: wallet.publicKey!.toBase58(),
              mint: props.nft.mint,
              symbol: props.nft.symbol,
              price: price,
            });
          }
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
        success: 'Listing successed.',
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
        const result = await sendCancelList(
          connection,
          wallet,
          price,
          props.nft.mint,
        );
        if (result['status'] && !result['status']['err']) {
          const txId = result['txid'];
          if (txId) {
            await callCancelList({
              transaction: txId,
              seller: wallet.publicKey!.toBase58(),
              mint: props.nft.mint,
              symbol: props.nft.symbol,
            });
          }
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
        success: 'Cancel listing successed.',
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
        const result = await sendSell(
          connection,
          props.nft.updateAuthority,
          wallet,
          price,
          props.nft.mint,
        );
        if (result['status'] && !result['status']['err']) {
          const txId = result['txid'];
          if (txId) {
            await callSell({
              transaction: txId,
              seller: props.nft.updateAuthority,
              buyer: wallet.publicKey!.toBase58(),
              mint: props.nft.mint,
              symbol: props.nft.symbol,
              price: price,
            });
          }
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
        success: 'Listing successed.',
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

  const onMakeOffer = async () => {};

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
                  onClick={onMakeOffer}
                  disabled={loading}
                >
                  Make an Offer
                </Button>
              </Col>
            </Row>
          )
        )}
      </div>
    </div>
  );
};
