import {
  AuctionDataExtended,
  AuctionState,
  BidderMetadata,
  BidRedemptionTicket,
  formatTokenAmount,
  fromLamports,
  getAuctionExtended,
  MAX_EDITION_LEN,
  MAX_METADATA_LEN,
  MAX_PRIZE_TRACKING_TICKET_SIZE,
  ParsedAccount,
  PriceFloorType,
  programIds,
  shortenAddress,
  useConnection,
  useMeta,
  useMint,
  useWalletModal,
  WRAPPED_SOL_MINT,
} from '@oyster/common';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Row, Col, Statistic, Spin } from 'antd';
import {
  AuctionView,
  AuctionViewState,
  useBidsForAuction,
  useUserBalance,
} from '../../../hooks';
import { format } from 'timeago.js';
import { useTokenList } from '../../../contexts/tokenList';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';
import { AccountLayout, MintLayout } from '@solana/spl-token';
import { findEligibleParticipationBidsForRedemption } from '../../../actions/claimUnusedPrizes';
import { useHistory } from 'react-router-dom';
import { eligibleForParticipationPrizeGivenWinningIndex } from '../../../actions/sendRedeemBid';
import { useAuctionExtended } from '../../../hooks/useAuctionDataExtend';

const { Countdown } = Statistic;

async function calculateTotalCostOfRedeemingOtherPeoplesBids(
  connection: Connection,
  auctionView: AuctionView,
  bids: ParsedAccount<BidderMetadata>[],
  bidRedemptions: Record<string, ParsedAccount<BidRedemptionTicket>>,
): Promise<number> {
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span,
  );
  const mintRentExempt = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span,
  );
  const metadataRentExempt = await connection.getMinimumBalanceForRentExemption(
    MAX_METADATA_LEN,
  );
  const editionRentExempt = await connection.getMinimumBalanceForRentExemption(
    MAX_EDITION_LEN,
  );
  const prizeTrackingTicketExempt =
    await connection.getMinimumBalanceForRentExemption(
      MAX_PRIZE_TRACKING_TICKET_SIZE,
    );

  const eligibleParticipations =
    await findEligibleParticipationBidsForRedemption(
      auctionView,
      bids,
      bidRedemptions,
    );
  const max = auctionView.auction.info.bidState.max.toNumber();
  let totalWinnerItems = 0;
  for (let i = 0; i < max; i++) {
    const winner = auctionView.auction.info.bidState.getWinnerAt(i);
    if (!winner) {
      break;
    } else {
      const bid = bids.find(b => b.info.bidderPubkey === winner);
      if (bid) {
        for (
          let j = 0;
          j < auctionView.auctionManager.safetyDepositBoxesExpected.toNumber();
          j++
        ) {
          totalWinnerItems += auctionView.auctionManager
            .getAmountForWinner(i, j)
            .toNumber();
        }
      }
    }
  }
  return (
    (mintRentExempt +
      accountRentExempt +
      metadataRentExempt +
      editionRentExempt +
      prizeTrackingTicketExempt) *
    (eligibleParticipations.length + totalWinnerItems)
  );
}

function useGapTickCheck(
  value: number | undefined,
  gapTick: number | null,
  gapTime: number,
  auctionView: AuctionView,
  LAMPORTS_PER_MINT: number,
): boolean {
  return !!useMemo(() => {
    if (gapTick && value && gapTime && !auctionView.auction.info.ended()) {
      // so we have a gap tick percentage, and a gap tick time, and a value, and we're not ended - are we within gap time?
      const now = moment().unix();
      const endedAt = auctionView.auction.info.endedAt;
      if (endedAt) {
        const ended = endedAt.toNumber();
        if (now > ended) {
          const toLamportVal = value * LAMPORTS_PER_MINT;
          // Ok, we are in gap time, since now is greater than ended and we're not actually an ended auction yt.
          // Check that the bid is at least gapTick % bigger than the next biggest one in the stack.
          for (
            let i = auctionView.auction.info.bidState.bids.length - 1;
            i > -1;
            i--
          ) {
            const bid = auctionView.auction.info.bidState.bids[i];
            const expected = bid.amount.toNumber();
            if (expected < toLamportVal) {
              const higherExpectedAmount = expected * ((100 + gapTick) / 100);

              return higherExpectedAmount > toLamportVal;
            } else if (expected === toLamportVal) {
              // If gap tick is set, no way you can bid in this case - you must bid higher.
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      }
      return false;
    }
  }, [value, gapTick, gapTime, auctionView]);
}

export const BidLines = ({ auctionView }: { auctionView: AuctionView }) => {
  const mintKey = auctionView.auction.info.tokenMint;
  const balance = useUserBalance(mintKey);

  const history = useHistory();
  const connection = useConnection();
  const { update } = useMeta();
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const connect = useCallback(
    () => (wallet.wallet ? wallet.connect().catch() : setVisible(true)),
    [wallet.wallet, wallet.connect, setVisible],
  );
  const [hide, setHide] = useState(true);
  const bids = useBidsForAuction(auctionView.auction.pubkey || '');
  const auctionExtended = useAuctionExtended(auctionView);
  const mintInfo = useMint(mintKey);
  const tokenInfo = useTokenList().subscribedTokens.filter(
    m => m.address == mintKey,
  )[0];
  const symbol = tokenInfo
    ? tokenInfo.symbol
    : auctionView?.auction.info.tokenMint == WRAPPED_SOL_MINT.toBase58()
    ? '◎'
    : 'CUSTOM';

  const LAMPORTS_PER_MINT = tokenInfo
    ? Math.ceil(10 ** tokenInfo.decimals)
    : LAMPORTS_PER_SOL;

  const tickSize = auctionExtended?.info?.tickSize
    ? auctionExtended.info.tickSize
    : 0;

  let winnerIndex: number | null = null;
  if (auctionView.myBidderPot?.pubkey)
    winnerIndex = auctionView.auction.info.bidState.getWinnerIndex(
      auctionView.myBidderPot?.info.bidderAct,
    );
  const eligibleForOpenEdition = eligibleForParticipationPrizeGivenWinningIndex(
    winnerIndex,
    auctionView,
    auctionView.myBidderMetadata,
    auctionView.myBidRedemption,
  );
  const eligibleForAnything = winnerIndex !== null || eligibleForOpenEdition;

  const myPayingAccount = balance;

  const participationOnly =
    auctionView.auctionManager.numWinners.toNumber() === 0;
  const participationFixedPrice =
    auctionView.auctionManager.participationConfig?.fixedPrice || 0;
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;

  const isAuctionManagerAuthorityWalletOwner =
    auctionView.auctionManager.authority === wallet.publicKey?.toBase58();
  const isAuctionNotStarted =
    auctionView.auction.info.state === AuctionState.Created;
  const isUpcoming = auctionView.state === AuctionViewState.Upcoming;

  const bidValue =
    isUpcoming || bids.length === 0
      ? fromLamports(
          participationOnly ? participationFixedPrice : priceFloor,
          mintInfo,
        )
      : parseFloat(
          formatTokenAmount(bids[0].info.lastBid, mintInfo, 1.0, '', ``, 2),
        );
  const minBid = tickSize
    ? bidValue + tickSize.toNumber() / LAMPORTS_PER_MINT
    : bidValue;

  const auction = auctionView.auction.info;
  const ended = auction.ended();
  const deadline = (auction.endedAt?.toNumber() || 0) * 1000;

  console.log(auctionView);

  return (
    <div>
      <div className="auction-card-container">
        <Row gutter={8} className="auction-content">
          <Col span={24} lg={10}>
            <Statistic
              title={ended ? 'FINAL BID' : 'CURRENT BID'}
              value={`${bidValue} ◎`}
            />
            {!ended && (
              <span className="minimum-label">{`Minimum bid: ${minBid} ◎`}</span>
            )}
          </Col>
          <Col span={24} lg={14}>
            <Countdown
              className="countdown"
              title={ended ? 'AUCTION ENDED' : 'AUCTION ENDS IN'}
              value={deadline}
              format="H m s"
            />
            <div>
              <span className="time-label">Hours</span>
              <span className="time-label">Minutes</span>
              <span className="time-label">Seconds</span>
            </div>
          </Col>
        </Row>
        <div>
          {!wallet.connected && (
            <Button
              type="primary"
              size="large"
              className="action-btn"
              onClick={connect}
            >
              Connect Wallet
            </Button>
          )}
          {wallet.connected &&
            ended &&
            (loading ||
            auctionView.items.find(i => i.find(it => !it.metadata)) ||
            !myPayingAccount ? (
              <Spin />
            ) : eligibleForAnything ? (
              <Button type="primary" size="large" className="action-btn">
                Redeem Bid
              </Button>
            ) : isAuctionManagerAuthorityWalletOwner ? (
              <Button type="primary" size="large" className="action-btn">
                Reclaim Items
              </Button>
            ) : (
              <Button type="primary" size="large" className="action-btn">
                Refund Bid
              </Button>
            ))}
          {wallet.connected &&
            isAuctionNotStarted &&
            isAuctionManagerAuthorityWalletOwner && (
              <Button type="primary" size="large" className="action-btn">
                {loading ? <Spin /> : 'Start Auction'}
              </Button>
            )}
          {wallet.connected && !ended && (
            <Button type="primary" size="large" className="action-btn">
              Place a Bid
            </Button>
          )}
        </div>
      </div>
      {auctionView && bids.length > 0 && (
        <Row className="bids-container" gutter={[12, 12]}>
          <Col span={24} key={0}>
            <Row gutter={2}>
              <Col span={6}>
                <span>LAST BID BY</span>
              </Col>
              <Col span={7} className="item-address">
                <span>{`${shortenAddress(bids[0].info.bidderPubkey)} `}</span>
              </Col>
              <Col span={7}>
                <span>
                  {format(bids[0].info.lastBidTimestamp.toNumber() * 1000)}
                </span>
              </Col>
              <Col span={4} className="toggle-btn">
                <span onClick={() => setHide(!hide)}>
                  {hide ? 'See all' : 'Hide'}
                </span>
              </Col>
            </Row>
          </Col>
          {!hide &&
            bids.map((item, index) => {
              if (index === 0) return null;
              return (
                <Col key={index} span={24}>
                  <Row gutter={8}>
                    <Col span={6}>
                      <span>{shortenAddress(item.info.bidderPubkey)}</span>
                    </Col>
                    <Col span={8}>
                      <span>{`bid for ${formatTokenAmount(
                        item.info.lastBid,
                        mintInfo,
                        1.0,
                        '',
                        ` ${symbol}`,
                        2,
                      )}`}</span>
                    </Col>
                    <Col span={10}>
                      <span>
                        {format(item.info.lastBidTimestamp.toNumber() * 1000)}
                      </span>
                    </Col>
                  </Row>
                </Col>
              );
            })}
        </Row>
      )}
      <div className="auction-description">
        <span style={{ fontWeight: 600 }}>How it works:</span>
        <span>
          1. Connect your wallet and place a bid. The bid must be at least{' '}
          {tickSize && tickSize.toNumber() / LAMPORTS_PER_MINT} {symbol} greater
          than the current bid
        </span>
        <span>
          2. You will automatically get your SOL returned to your wallet if
          outbid.
        </span>
        <span>
          3. When auction closes, the artwork will belong to the highest bidder.
        </span>
        <span>Please claim the NFT by pressing the “claim item” button</span>
      </div>
    </div>
  );
};
