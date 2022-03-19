import React from 'react';
import { Row, Col, Input, Button } from 'antd';
import { AuctionCategory, AuctionState } from '../index';

export const PriceAuction = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row className="call-to-action">
        <h2>Price</h2>
        <p>Set the price for your auction.</p>
      </Row>
      <Row className="content-action">
        <Col className="section" xl={24}>
          {props.attributes.category === AuctionCategory.Open && (
            <label className="action-field">
              <span className="field-title">Price</span>
              <span className="field-info">
                This is the fixed price that everybody will pay for your
                Participation NFT.
              </span>
              <Input
                type="number"
                min={0}
                autoFocus
                className="input"
                placeholder="Fixed Price"
                prefix="◎"
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    // Do both, since we know this is the only item being sold.
                    participationFixedPrice: parseFloat(info.target.value),
                    priceFloor: parseFloat(info.target.value),
                  })
                }
              />
            </label>
          )}
          {props.attributes.category !== AuctionCategory.Open && (
            <label className="action-field">
              <span className="field-title">Price Floor</span>
              <span className="field-info">
                This is the starting bid price for your auction.
              </span>
              <Input
                type="number"
                min={0}
                autoFocus
                className="input"
                placeholder="Price"
                prefix="◎"
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    priceFloor: parseFloat(info.target.value),
                  })
                }
              />
            </label>
          )}
          <label className="action-field">
            <span className="field-title">Tick Size</span>
            <span className="field-info">
              All bids must fall within this price increment.
            </span>
            <Input
              type="number"
              min={0}
              className="input"
              placeholder="Tick size in SOL"
              prefix="◎"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  priceTick: parseFloat(info.target.value),
                })
              }
            />
          </label>
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Continue
        </Button>
      </Row>
    </>
  );
};
