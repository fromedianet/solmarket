import {
  AuctionState,
  BidderMetadata,
  BidRedemptionTicket,
  formatTokenAmount,
  fromLamports,
  MAX_EDITION_LEN,
  MAX_METADATA_LEN,
  MAX_PRIZE_TRACKING_TICKET_SIZE,
  MetaplexModal,
  notify,
  ParsedAccount,
  PriceFloorType,
  shortenAddress,
  useConnection,
  useMeta,
  useMint,
  useUserAccounts,
  useWalletModal,
} from '@oyster/common';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Row, Col, Statistic, Spin, Form, InputNumber } from 'antd';
import {
  AuctionView,
  AuctionViewState,
  useBidsForAuction,
  useUserBalance,
} from '../../../hooks';
import { format } from 'timeago.js';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';
import { AccountLayout, MintLayout } from '@solana/spl-token';
import { findEligibleParticipationBidsForRedemption } from '../../../actions/claimUnusedPrizes';
import {
  eligibleForParticipationPrizeGivenWinningIndex,
  sendRedeemBid,
} from '../../../actions/sendRedeemBid';
import { sendCancelBid } from '../../../actions/cancelBid';
import { sendPlaceBid } from '../../../actions/sendPlaceBid';
import { useAuctionExtended } from '../../../hooks/useAuctionDataExtend';
import { startAuctionManually } from '../../../actions/startAuctionManually';
import { QUOTE_MINT } from '../../../constants';
import CongratulationsModal from '../../../components/Modals/CongratulationsModal';

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
  const [form] = Form.useForm();
  const wallet = useWallet();
  const mintKey = auctionView.auction.info.tokenMint;
  const balance = useUserBalance(mintKey);

  const connection = useConnection();
  const { prizeTrackingTickets, bidRedemptions } = useMeta();
  const { accountByMint } = useUserAccounts();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<number>();
  const [showPlaceBid, setShowPlaceBid] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showRedeemedBidModal, setShowRedeemedBidModal] =
    useState<boolean>(false);
  const [showEndingBidModal, setShowEndingBidModal] = useState<boolean>(false);
  const [showRedemptionIssue, setShowRedemptionIssue] =
    useState<boolean>(false);
  const [printingCost, setPrintingCost] = useState<number>();

  const { setVisible } = useWalletModal();
  const connect = useCallback(
    () => (wallet.wallet ? wallet.connect().catch() : setVisible(true)),
    [wallet.wallet, wallet.connect, setVisible],
  );
  const [hide, setHide] = useState(true);
  const bids = useBidsForAuction(auctionView.auction.pubkey || '');
  const auctionExtended = useAuctionExtended(auctionView);
  const mintInfo = useMint(mintKey);
  const symbol = '◎';
  const LAMPORTS_PER_MINT = LAMPORTS_PER_SOL;

  const gapTime = (auctionView.auction.info.auctionGap?.toNumber() || 0) / 60;
  const gapTick = auctionExtended
    ? auctionExtended.info.gapTickSizePercentage
    : 0;
  const tickSize = auctionExtended?.info?.tickSize
    ? auctionExtended.info.tickSize
    : 0;
  const tickSizeInvalid = !!(
    tickSize &&
    value &&
    (value * LAMPORTS_PER_MINT) % tickSize.toNumber() != 0
  );

  const gapBidInvalid = useGapTickCheck(
    value,
    gapTick,
    gapTime,
    auctionView,
    LAMPORTS_PER_MINT,
  );

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

  const myPayingAccount = balance.accounts[0];

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

  const invalidBid =
    tickSizeInvalid ||
    gapBidInvalid ||
    !myPayingAccount ||
    value === undefined ||
    value * LAMPORTS_PER_MINT < priceFloor ||
    (minBid && value < minBid) ||
    loading ||
    !accountByMint.get(QUOTE_MINT.toBase58());

  const deadline = (auctionView.auction.info.endedAt?.toNumber() || 0) * 1000;
  const isEnded = auctionView.auction.info.ended();

  const onFinish = async (values) => {
    setValue(values.bidPrice);
    setShowPlaceBid(false);
    if (!invalidBid) {
      setLoading(true);
      await sendPlaceBid(
        connection,
        wallet,
        myPayingAccount.pubkey,
        auctionView,
        accountByMint,
        value
      );
      notify({
        message: 'Your bid was successed',
        type: 'success'
      });
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="auction-card-container">
        <Row gutter={8} className="auction-content">
          <Col span={24} lg={10}>
            <Statistic
              title={isEnded ? 'FINAL BID' : 'CURRENT BID'}
              value={`${bidValue} ◎`}
            />
            {!isEnded && (
              <span className="minimum-label">{`Minimum bid: ${minBid} ◎`}</span>
            )}
          </Col>
          <Col span={24} lg={14}>
            <Countdown
              className="countdown"
              title={isEnded ? 'AUCTION ENDED' : 'AUCTION ENDS IN'}
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
          {wallet.connected && isEnded && (
            <Button
              type="primary"
              size="large"
              className="action-btn"
              disabled={
                !myPayingAccount ||
                (!auctionView.myBidderMetadata &&
                  !isAuctionManagerAuthorityWalletOwner) ||
                loading ||
                !!auctionView.items.find(i => i.find(it => !it.metadata))
              }
              onClick={async () => {
                setLoading(true);
                setShowRedemptionIssue(false);
                if (isAuctionManagerAuthorityWalletOwner) {
                  const totalCost =
                    await calculateTotalCostOfRedeemingOtherPeoplesBids(
                      connection,
                      auctionView,
                      bids,
                      bidRedemptions,
                    );
                  setPrintingCost(totalCost);
                  setShowWarningModal(true);
                }
                try {
                  if (eligibleForAnything) {
                    await sendRedeemBid(
                      connection,
                      wallet,
                      myPayingAccount.pubkey,
                      auctionView,
                      accountByMint,
                      prizeTrackingTickets,
                      bidRedemptions,
                      bids,
                    ).then(() => setShowRedeemedBidModal(true));
                  } else {
                    await sendCancelBid(
                      connection,
                      wallet,
                      myPayingAccount.pubkey,
                      auctionView,
                      accountByMint,
                      bids,
                      bidRedemptions,
                      prizeTrackingTickets,
                    );
                  }
                } catch (e) {
                  console.error(e);
                  setShowRedemptionIssue(true);
                }
                setLoading(false);
              }}
            >
              {loading ||
              auctionView.items.find(i => i.find(it => !it.metadata)) ||
              !myPayingAccount ? (
                <Spin />
              ) : eligibleForAnything ? (
                'Redeem bid'
              ) : isAuctionManagerAuthorityWalletOwner ? (
                'Reclaim Items'
              ) : (
                'Refund bid'
              )}
            </Button>
          )}
          {wallet.connected &&
            isAuctionNotStarted &&
            isAuctionManagerAuthorityWalletOwner && (
              <Button
                type="primary"
                size="large"
                className="action-btn"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await startAuctionManually(connection, wallet, auctionView);
                    notify({
                      message: 'Transaction successed',
                      description: '',
                      type: 'success',
                    });
                  } catch (e) {
                    console.error(e);
                    notify({
                      message: 'Transaction failed...',
                      description:
                        'There was an issue to start auction. Please try again.',
                      type: 'error',
                    });
                  }
                  setLoading(false);
                }}
              >
                {loading ? <Spin /> : 'Start Auction'}
              </Button>
            )}
          {wallet.connected && !isEnded && (
            <Button type="primary" size="large" className="action-btn"
              onClick={() => {
                setShowPlaceBid(true);
                form.setFieldsValue({
                  bidPrice: minBid
                });
              }}
            >
              Place a Bid
            </Button>
          )}
          {showRedemptionIssue && (
            <span style={{ color: 'red' }}>
              There was an issue redeemg or refunding your bid. Please try
              again.
            </span>
          )}
          {tickSizeInvalid && tickSize && (
            <span style={{ color: 'red' }}>
              Tick size is ◎{tickSize.toNumber() / LAMPORTS_PER_MINT}.
            </span>
          )}
          {gapBidInvalid && (
            <span style={{ color: 'red' }}>
              Your bid needs to be at least {gapTick}% larger than an exiting
              bid during gap periods to be eligible.
            </span>
          )}
          {!loading && value != undefined && invalidBid && (
            <span style={{ color: 'red' }}>Invalid amount</span>
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
      <MetaplexModal
        visible={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
      >
        <h3 style={{ color: 'white', padding: '8px' }}>
          Warning: There may be some items in this auction that still are
          required by the auction for printing bidders&apos; limited or open
          edition NFTs. If you wish to withdraw them, you are agreeing to foot
          the cost of up to an estimated ◎
          <b>{(printingCost || 0) / LAMPORTS_PER_MINT}</b> plus transaction fees
          to redeem their bids for them right now.
        </h3>
      </MetaplexModal>
      <MetaplexModal
        visible={showPlaceBid}
        onCancel={() => setShowPlaceBid(false)}
        centered={true}
        title='Place bid'
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
        >
          <Form.Item label='Bid amount in SOL' name='bidPrice' style={{ color: 'white'}} required>
            <InputNumber
              autoFocus
              className='bid-price'
              min={minBid}
              bordered={false}
              controls={false}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: '8px' }}>
            <Button type='primary' style={{ width: '100%', height: '40px' }} htmlType='submit'>Place bid</Button>
          </Form.Item>
        </Form>
      </MetaplexModal>
    </div>
  );
};
