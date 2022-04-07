import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { Row, Col, Button, Form, Spin } from 'antd';
import { ConnectButton } from '@oyster/common';
import { AuctionState } from '../auctionCreate';
import { PriceInput } from '../../components/PriceInput';

export const ArtAction = (props: {
  instantSalePrice: number;
  isOwner: boolean;
  loading: boolean;
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  listNow: () => Promise<void>;
  cancelList: () => Promise<void>;
  buyNow: () => Promise<void>;
}) => {
  const wallet = useWallet();
  const alreadyListed = props.instantSalePrice > 0;
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
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
        {alreadyListed && (
          <span className="value">{props.instantSalePrice} SOL</span>
        )}
      </div>

      {!alreadyListed && <span className="value">Not listed</span>}
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button" />
        ) : props.isOwner ? (
          alreadyListed ? (
            <Button className="button" onClick={props.cancelList} disabled>
              {props.loading ? <Spin /> : 'Cancel Listing'}
            </Button>
          ) : (
            <Form name="price-control" layout="inline" onFinish={props.listNow}>
              <Row style={{ width: '100%' }}>
                <Col span={12}>
                  <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                    <PriceInput
                      value={{ number: props.instantSalePrice }}
                      placeholder="price"
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
          )
        ) : (
          alreadyListed && (
            <Row gutter={16}>
              <Col span={10}>
                <Button className="button" disabled onClick={props.buyNow}>
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
