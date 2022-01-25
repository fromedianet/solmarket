import { ConnectButton, formatTokenAmount, useMint } from "@oyster/common";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import {Row, Col, Button, InputNumber} from 'antd';
import { AuctionView, useBidsForAuction } from "../../hooks";

export const ActionView = ({auction, isOwner}: {auction: AuctionView | undefined, isOwner: boolean}) => {

  const wallet = useWallet();
  const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const mintInfo = useMint(auction?.auction.info.tokenMint);
  const bidValue = bids.length > 0 && parseFloat(formatTokenAmount(bids[0].info.lastBid, mintInfo, 1.0, '', ``, 2));
  console.log('bidvalue', bidValue);
  console.log('auctioin', auction);

  return (
    <div className="action-view">
      {bidValue && (
        <span className="label">Current Price</span>
      )}
      <div>
        <img src='/icons/price.svg' width={24} alt='price' />
        {bidValue && (<span className="value">{bidValue} SOL</span>)}
      </div>
      
      {!bidValue && (
        <span className="value">Not listed</span>
      )}
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button"/>
        ) : isOwner ? (
          bidValue ? (
            <Button className="button">Cancel Listing</Button>
          ) : (
            <Row gutter={16}>
              <Col span={12}>
              <InputNumber
                autoFocus
                className="price-input"
                placeholder="Price"
                maxLength={50}
                controls={false}
                addonAfter='SOL'
                bordered={false}
              />
              </Col>
              <Col span={12}>
                <Button className="button">List Now</Button>
              </Col>
            </Row>
          )
        ) : (
          bidValue && (
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
}
