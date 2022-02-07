import { shortenAddress, WRAPPED_SOL_MINT } from '@oyster/common';
import React from 'react';
import { Row, Col, Input, Button } from 'antd';
import { AuctionCategory, AuctionState } from '../index';

export const PriceAuction = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  const quoteMintName =
    props.attributes?.quoteMintInfoExtended?.name || 'Custom Token';
  const quoteMintExt =
    props.attributes?.quoteMintInfoExtended?.symbol ||
    shortenAddress(props.attributes.quoteMintAddress);
  return (
    <>
      <Row className="call-to-action">
        <h2>Price</h2>
        <p>
          Set the price for your auction.
          {props.attributes.quoteMintAddress != WRAPPED_SOL_MINT.toBase58() &&
            ` Warning! the auction quote mint is `}
          {props.attributes.quoteMintAddress != WRAPPED_SOL_MINT.toBase58() && (
            <a
              href={`https://explorer.solana.com/address/${props.attributes?.quoteMintAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {props.attributes?.quoteMintAddress !=
                WRAPPED_SOL_MINT.toBase58() &&
                `${quoteMintName} (${quoteMintExt})`}
            </a>
          )}
        </p>
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
                suffix={
                  props.attributes.quoteMintInfoExtended
                    ? props.attributes.quoteMintInfoExtended.symbol
                    : props.attributes.quoteMintAddress ==
                      WRAPPED_SOL_MINT.toBase58()
                    ? 'SOL'
                    : 'CUSTOM'
                }
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
                suffix={
                  props.attributes.quoteMintInfoExtended
                    ? props.attributes.quoteMintInfoExtended.symbol
                    : props.attributes.quoteMintAddress ==
                      WRAPPED_SOL_MINT.toBase58()
                    ? 'SOL'
                    : 'CUSTOM'
                }
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
              placeholder={`Tick size in ${
                props.attributes.quoteMintInfoExtended
                  ? props.attributes.quoteMintInfoExtended.symbol
                  : props.attributes.quoteMintAddress ==
                    WRAPPED_SOL_MINT.toBase58()
                  ? 'SOL'
                  : 'your custom currency'
              }`}
              prefix="◎"
              suffix={
                props.attributes.quoteMintInfoExtended
                  ? props.attributes.quoteMintInfoExtended.symbol
                  : props.attributes.quoteMintAddress ==
                    WRAPPED_SOL_MINT.toBase58()
                  ? 'SOL'
                  : 'CUSTOM'
              }
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
