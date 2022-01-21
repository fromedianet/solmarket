import { Creator, useMint, WRAPPED_SOL_MINT } from '@oyster/common';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { SafetyDepositDraft } from '../../../actions/createAuctionManager';
import TokenDialog, { TokenButton } from '../../../components/TokenDialog';
import { QUOTE_MINT } from '../../../constants';
import { useTokenList } from '../../../contexts/tokenList';
import { ArtSelector } from '../artSelector';
import { AuctionCategory, AuctionState } from '../index';

export const CopiesStep = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [mint, setMint] = useState<PublicKey>(WRAPPED_SOL_MINT);
  const { hasOtherTokens, tokenMap } = useTokenList();

  // give default value to mint
  // const mintInfo = tokenMap.get((!mint? QUOTE_MINT.toString(): mint.toString()))

  props.attributes.quoteMintAddress = mint
    ? mint.toBase58()
    : QUOTE_MINT.toBase58();

  if (props.attributes.quoteMintAddress) {
    props.attributes.quoteMintInfo = useMint(
      props.attributes.quoteMintAddress,
    )!;
    props.attributes.quoteMintInfoExtended = tokenMap.get(
      props.attributes.quoteMintAddress,
    )!;
  }

  const artistFilter = (i: SafetyDepositDraft) =>
    !(i.metadata.info.data.creators || []).find((c: Creator) => !c.verified);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let filter: (i: SafetyDepositDraft) => boolean = (_i: SafetyDepositDraft) =>
    true;
  if (props.attributes.category === AuctionCategory.Limited) {
    filter = (i: SafetyDepositDraft) =>
      !!i.masterEdition && !!i.masterEdition.info.maxSupply;
  } else if (props.attributes.category === AuctionCategory.Open) {
    filter = (i: SafetyDepositDraft) =>
      !!(
        i.masterEdition &&
        (i.masterEdition.info.maxSupply === undefined ||
          i.masterEdition.info.maxSupply === null)
      );
  }

  const overallFilter = (i: SafetyDepositDraft) => filter(i) && artistFilter(i);

  return (
    <>
      <Row className="call-to-action" style={{ marginBottom: 0 }}>
        <h2>Select which item to sell</h2>
        <p style={{ fontSize: '1.2rem' }}>
          Select the item(s) that you want to list.
        </p>
      </Row>
      <Row className="content-action" gutter={16}>
        <Col span={24} lg={12}>
          <ArtSelector
            filter={overallFilter}
            selected={props.attributes.items}
            setSelected={items => {
              props.setAttributes({ ...props.attributes, items });
            }}
            allowMultiple={false}
          >
            Select NFT
          </ArtSelector>
        </Col>
        <Col span={24} lg={12}>
          {hasOtherTokens && (
            <label className="action-field">
              <span className="field-title">Auction mint</span>
              <TokenButton
                mint={mint}
                onClick={() => setShowTokenDialog(true)}
              />
              <TokenDialog
                setMint={setMint}
                open={showTokenDialog}
                onClose={() => {
                  setShowTokenDialog(false);
                }}
              />
            </label>
          )}
          {props.attributes.category === AuctionCategory.Limited && (
            <label className="action-field">
              <span className="field-title">
                How many copies do you want to create?
              </span>
              <span className="field-info">
                Each copy will be given unique edition number e.g. 1 of 30
              </span>
              <Input
                autoFocus
                className="input"
                placeholder="Enter number of copies sold"
                allowClear
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    editions: parseInt(info.target.value),
                  })
                }
              />
            </label>
          )}
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            props.confirm();
          }}
          className="action-btn"
        >
          Continue to Terms
        </Button>
      </Row>
    </>
  );
};