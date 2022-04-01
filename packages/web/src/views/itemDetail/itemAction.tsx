import { ConnectButton } from '@oyster/common';
import React, { useState } from 'react';
import { Button, InputNumber, Row, Col, Form, Spin } from 'antd';
import { NFT } from '../../models/exCollection';
import { useWallet } from '@solana/wallet-adapter-react';

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

export const ItemAction = (props: { nft: NFT; onBuy: () => void }) => {
  const [form] = Form.useForm();
  const wallet = useWallet();
  const isOwner = props.nft.updateAuthority === wallet.publicKey?.toBase58();
  const alreadyListed = props.nft.price || 0 > 0;
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };
  const [loading, setLoading] = useState(false);

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
            <Button className="button" disabled>
              {loading ? <Spin /> : 'Cancel Listing'}
            </Button>
          ) : (
            <Form form={form} name="price-control" layout="inline">
              <Row style={{ width: '100%' }}>
                <Col span={12}>
                  <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                    <PriceInput value={{ number: props.nft.price }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Button className="button" htmlType="submit" disabled>
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
                <Button className="button" disabled>
                  Buy now
                </Button>
              </Col>
              <Col span={14}>
                <Button className="button" disabled>
                  Make an offer
                </Button>
              </Col>
            </Row>
          )
        )}
      </div>
    </div>
  );
};
