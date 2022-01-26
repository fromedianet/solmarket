import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import { Row, Col, Button, InputNumber, Form } from 'antd';
import { ConnectButton } from '@oyster/common';
import { AuctionState } from '../auctionCreate';
import { AuctionView } from '../../hooks';
import { useAuctionStatus } from '../../components/AuctionRenderCard/hooks/useAuctionStatus';

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

export const ActionView = (props: {
  auctionView: AuctionView | undefined,
  isOwner: boolean;
  attributes: AuctionState;
  listnow: () => void;
  setAttributes: (attr: AuctionState) => void;
}) => {
  const wallet = useWallet();
  const auctionStatus = props.auctionView && useAuctionStatus(props.auctionView);
  const bidValue = typeof auctionStatus?.amount === 'string' ? parseFloat(auctionStatus.amount) : auctionStatus?.amount;
  const alreadyListed = bidValue && bidValue > 0 ? true : false;
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish = (values: any) => {
    props.listnow();
  };

  return (
    <div className="action-view">
      {alreadyListed && <span className="label">Current Price</span>}
      <div className='price-container'>
        <img src="/icons/price.svg" width={24} alt="price" style={{marginRight: '8px'}} />
        {alreadyListed && <span className="value">{bidValue} SOL</span>}
      </div>

      {!alreadyListed && <span className="value">Not listed</span>}
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button" />
        ) : props.isOwner ? (
          alreadyListed ? (
            <Button className="button">Cancel Listing</Button>
          ) : (
            <Form name="price-control" layout="inline" onFinish={onFinish}>
              <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                <PriceInput
                  value={{number: bidValue}}
                  onChange={value =>
                    props.setAttributes({
                      ...props.attributes,
                      priceFloor: value.number,
                      instantSalePrice: value.number,
                    })
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button className="button" htmlType="submit">
                  List Now
                </Button>
              </Form.Item>
            </Form>
          )
        ) : (
          alreadyListed && (
            <Row gutter={16}>
              <Col span={10}>
                <Button className="button">Buy now</Button>
              </Col>
              <Col span={14}>
                <Button className="button">Make an offer</Button>
              </Col>
            </Row>
          )
        )}
      </div>
    </div>
  );
};
