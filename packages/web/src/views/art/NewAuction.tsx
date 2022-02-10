import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import { Row, Col, Button, InputNumber, Form, Spin } from 'antd';
import { ConnectButton } from '@oyster/common';
import { AuctionState } from '../auctionCreate';

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

export const NewAuction = (props: {
  loading: boolean;
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  listNow: () => Promise<void>;
}) => {
  const wallet = useWallet();
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };

  return (
    <div className="action-view">
      <div className="price-container">
        <img
          src="/icons/price.svg"
          width={24}
          alt="price"
          style={{ marginRight: '8px' }}
        />
      </div>
      <span className="value">Not listed</span>
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button" />
        ) : (
          <Form name="price-control" layout="inline" onFinish={props.listNow}>
            <Row style={{ width: '100%' }}>
              <Col span={12}>
                <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                  <PriceInput
                    onChange={value =>
                      props.setAttributes({
                        ...props.attributes,
                        priceFloor: value.number,
                        instantSalePrice: value.number,
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  <Button className="button" htmlType="submit">
                    {props.loading ? <Spin /> : 'List Now'}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </div>
  );
};
