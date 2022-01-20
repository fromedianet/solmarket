import { useMint, WRAPPED_SOL_MINT } from '@oyster/common';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { QUOTE_MINT } from '../../../constants';
import { useTokenList } from '../../../contexts/tokenList';
import { AuctionState } from '../index';
import TokenDialog, { TokenButton } from '../../../components/TokenDialog';

export const NumberOfWinnersStep = (props: {
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

  return (
    <>
      <Row className="call-to-action">
        <h2>Tiered Auction</h2>
        <p>Create a Tiered Auction</p>
      </Row>
      <Row className="content-action">
        <Col className="section" xl={24}>
          <label className="action-field">
            <span className="field-title">
              How many participants can win the auction?
            </span>
            <span className="field-info">
              This is the number of spots in the leaderboard.
            </span>
            <Input
              type="number"
              autoFocus
              className="input"
              placeholder="Number of spots in the leaderboard"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  winnersCount: parseInt(info.target.value),
                })
              }
            />
          </label>
          {hasOtherTokens && (
            <label className="action-field">
              <span className="field-title">Auction mint</span>
              <span className="field-info">
                This will be the quote mint for your auction.
              </span>
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
