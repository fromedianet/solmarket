import { formatTokenAmount, shortenAddress, useMint, WRAPPED_SOL_MINT } from "@oyster/common";
import React, { useState } from "react";
import {Row, Col} from 'antd';
import { AuctionView, useBidsForAuction } from "../../../hooks";
import { format } from 'timeago.js';
import { useTokenList } from "../../../contexts/tokenList";

export const BidLines = ({auctionView}: {auctionView?: AuctionView | null}) => {
  const [hide, setHide] = useState(true);
  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');
  const mint = useMint(auctionView?.auction.info.tokenMint);
  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == auctionView?.auction.info.tokenMint,
  )[0];
  const symbol = tokenInfo
    ? tokenInfo.symbol
    : auctionView?.auction.info.tokenMint == WRAPPED_SOL_MINT.toBase58()
    ? '◎'
    : 'CUSTOM';

  if (!auctionView || bids.length < 1) return null;

  return (
    <Row className="bids-container" gutter={[16, 16]}>
      <Col span={24} key={0} >
        <Row gutter={2}>
          <Col span={6}>
            <span>LAST BID BY</span>
          </Col>
          <Col span={7} className='item-address'>
            <span>{`${shortenAddress(bids[0].info.bidderPubkey)} `}</span>
          </Col>
          <Col span={7}>
            <span>{format(bids[0].info.lastBidTimestamp.toNumber() * 1000)}</span>
          </Col>
          <Col span={4} className="toggle-btn">
            <span onClick={() => setHide(!hide)}>
              {hide ? 'See all' : 'Hide'}
            </span>
          </Col>
        </Row>
      </Col>
      {!hide && (
        bids.map((item, index) => {
          if (index === 0) return null;
          return (
            <Col key={index} span={24}>
              <Row gutter={8}>
                <Col span={6}>
                  <span>{shortenAddress(item.info.bidderPubkey)}</span>
                </Col>
                <Col span={8}>
                  <span>{`bid for ${formatTokenAmount(item.info.lastBid, mint, 1.0, '', ` ${symbol}`, 2)}`}</span>
                </Col>
                <Col span={10}>
                  <span>{format(item.info.lastBidTimestamp.toNumber() * 1000)}</span>
                </Col>
              </Row>
            </Col>
          );
        })
      )}
    </Row>
  )
};
