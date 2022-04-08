import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { Row, Col, Button, Form, Spin } from 'antd';
import { ConnectButton } from '@oyster/common';
import { AuctionState } from '../auctionCreate';
import { PriceInput } from '../../components/PriceInput';

export const ArtOwnerAction = (props: {
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
                    placeholder="Price"
                    addonAfter="SOL"
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
                  <Button className="button" htmlType="submit" disabled>
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
