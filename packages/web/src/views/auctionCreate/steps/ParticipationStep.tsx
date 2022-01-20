import { WRAPPED_SOL_MINT } from '@oyster/common';
import React from 'react';
import { Row, Col, Input, Button } from 'antd';
import { SafetyDepositDraft } from '../../../actions/createAuctionManager';
import { ArtSelector } from '../artSelector';
import { AuctionState } from '../index';

export const ParticipationStep = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row className="call-to-action">
        <h2>Participation NFT</h2>
        <p>
          Provide NFT that will be awarded as an Open Edition NFT for auction
          participation.
        </p>
      </Row>
      <Row className="content-action">
        <Col className="section" span={24} lg={12}>
          <ArtSelector
            filter={(i: SafetyDepositDraft) =>
              !!i.masterEdition && i.masterEdition.info.maxSupply === undefined
            }
            selected={
              props.attributes.participationNFT
                ? [props.attributes.participationNFT]
                : []
            }
            setSelected={items => {
              props.setAttributes({
                ...props.attributes,
                participationNFT: items[0],
              });
            }}
            allowMultiple={false}
          >
            Select Participation NFT
          </ArtSelector>
        </Col>
        <Col span={24} lg={12}>
          <label className="action-field">
            <span className="field-title">Price</span>
            <span className="field-info">
              This is an optional fixed price that non-winners will pay for your
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
                  participationFixedPrice: parseFloat(info.target.value),
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
          Continue to Review
        </Button>
      </Row>
    </>
  );
};
