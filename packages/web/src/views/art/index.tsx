import React, { useMemo, useState } from 'react';
import { Row, Col, Skeleton, Collapse, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import {
  AuctionView,
  useArt,
  useAuctions,
  useBidsForAuction,
  useExtendedArt,
  useUserBalance,
} from '../../hooks';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { ArtContent } from '../../components/ArtContent';
import { useWallet } from '@solana/wallet-adapter-react';
import { ViewOn } from '../../components/ViewOn';
import { ArtInfo } from './ArtInfo';
import { CollectionInfo } from './CollectionInfo';
import { ActionView } from './ActionView';
import {
  AmountRange,
  Bid,
  BidderPot,
  BidStateType,
  IPartialCreateAuctionArgs,
  MetaplexModal,
  PriceFloor,
  PriceFloorType,
  useAccountByMint,
  useConnection,
  useMeta,
  useMint,
  useUserAccounts,
  WinnerLimit,
  WinnerLimitType,
  WinningConfigType,
} from '@oyster/common';
import { useTokenList } from '../../contexts/tokenList';
import {
  createAuctionManager,
  SafetyDepositDraft,
} from '../../actions/createAuctionManager';
import { BN } from 'bn.js';
import {
  AuctionCategory,
  AuctionState,
  InstantSaleType,
} from '../auctionCreate';
import { QUOTE_MINT } from '../../constants';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { sendPlaceBid } from '../../actions/sendPlaceBid';
import { sendRedeemBid } from '../../actions/sendRedeemBid';
import { AlertState } from '../../utils/utils';

const { Panel } = Collapse;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const connection = useConnection();
  const wallet = useWallet();

  const art = useArt(id);
  const { ref, data } = useExtendedArt(id);

  let auctionView: AuctionView | undefined;
  const auctions = useAuctions();
  const filters = auctions.filter(
    item => item.thumbnail.metadata.pubkey === id,
  );
  if (filters.length > 0) {
    auctionView = filters[0];
  }
  
  const pubkey = wallet?.publicKey?.toBase58() || '';
  const isOwner = art?.creators
    ? art.creators.find(item => item.address === pubkey)
      ? true
      : false
    : false;

  const {
    metadata,
    masterEditions,
    editions,
    whitelistedCreatorsByCreator,
    storeIndexer,
    update,
    prizeTrackingTickets,
    bidRedemptions,
  } = useMeta();
  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');
  const { accountByMint } = useUserAccounts();
  const { tokenMap } = useTokenList();
  // const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const m = metadata.filter(item => item.pubkey === id)[0];
  const account = useAccountByMint(m.info.mint);
  const balance = useUserBalance(m.info.mint);
  const myPayingAccount = balance.accounts[0];
  const instantSalePrice = useMemo(
    () => (auctionView?.auction?.info.priceFloor.minPrice || new BN(0)).toNumber() / LAMPORTS_PER_SOL,
    [auctionView?.auction],
  );

  const safetyDeposit: SafetyDepositDraft | undefined = account && {
    holding: account.pubkey,
    edition: editions && m.info.edition ? editions[m.info.edition] : undefined,
    masterEdition:
      masterEditions && m.info.edition
        ? masterEditions[m.info.edition]
        : undefined,
    metadata: m,
    printingMintHolding: undefined,
    winningConfigType: WinningConfigType.FullRightsTransfer,
    amountRanges: [
      new AmountRange({
        amount: new BN(1),
        length: new BN(1),
      }),
    ],
    participationConfig: undefined,
  };

  const [attributes, setAttributes] = useState<AuctionState>({
    reservationPrice: 0,
    items: safetyDeposit && [safetyDeposit] || [],
    category: AuctionCategory.InstantSale,
    auctionDurationType: 'minutes',
    gapTimeType: 'minutes',
    winnersCount: 1,
    startSaleTS: undefined,
    startListTS: undefined,
    instantSaleType: InstantSaleType.Single,
    quoteMintAddress: QUOTE_MINT.toBase58(),
    //@ts-ignore
    quoteMintInfo: useMint(QUOTE_MINT.toBase58()),
    //@ts-ignore
    quoteMintInfoExtended: tokenMap.get(QUOTE_MINT.toBase58()),
  });

  const createAuction = async () => {
    const winnerLimit = new WinnerLimit({
      type: WinnerLimitType.Capped,
      usize: new BN(1),
    });

    const auctionSettings: IPartialCreateAuctionArgs = {
      winners: winnerLimit,
      endAuctionAt: null,
      auctionGap: null,
      priceFloor: new PriceFloor({
        type: attributes.priceFloor
          ? PriceFloorType.Minimum
          : PriceFloorType.None,
        minPrice: new BN((attributes.priceFloor || 0) * LAMPORTS_PER_SOL),
      }),
      tokenMint: attributes.quoteMintAddress,
      gapTickSizePercentage: null,
      tickSize: null,
      instantSalePrice: new BN(
        (attributes.instantSalePrice || 0) * LAMPORTS_PER_SOL,
      ),
      name: null,
    };

    const safetyDepositDrafts = attributes.items;
    const participationSafetyDepositDraft = attributes.participationNFT;

    const _auctionObj = await createAuctionManager(
      connection,
      wallet,
      whitelistedCreatorsByCreator,
      auctionSettings,
      safetyDepositDrafts,
      participationSafetyDepositDraft,
      attributes.quoteMintAddress,
      storeIndexer,
    );
    console.log('_auctionObj', _auctionObj);
    // TODO: Refresh the UI with new added auction obj
    // setAuctionObj(_auctionObj);
  };

  const listNow = async () => {
    setLoading(true);
    await createAuction();
    setLoading(false);
  }

  const buyNow = async () => {
    if (!auctionView) return;
    setShowBuyModal(true);
    const winningConfigType =
      auctionView.participationItem?.winningConfigType ||
      auctionView.items[0][0].winningConfigType;
    const isAuctionItemMaster = [
      WinningConfigType.FullRightsTransfer,
      WinningConfigType.TokenOnlyTransfer,
    ].includes(winningConfigType);
    const allowBidToPublic =
      myPayingAccount &&
      !auctionView.myBidderPot &&
      !isOwner;
    const allowBidToAuctionOwner =
      myPayingAccount &&
      isOwner &&
      isAuctionItemMaster;

    // Placing a "bid" of the full amount results in a purchase to redeem.
    if (instantSalePrice && (allowBidToPublic || allowBidToAuctionOwner)) {
      try {
        console.log('sendPlaceBid');
        await sendPlaceBid(
          connection,
          wallet,
          myPayingAccount.pubkey,
          auctionView,
          accountByMint,
          instantSalePrice,
          // make sure all accounts are created
          'finalized',
        );
        // setLastBid(bid);
      } catch (e) {
        console.error('sendPlaceBid', e);
        // setAlertState({
        //   open: true,
        //   message: 'There was an issue place a bid. Please try again.',
        //   severity: 'error'
        // });
        setShowBuyModal(false);
        return;
      }
    }

    const newAuctionState = await update(
      auctionView.auction.pubkey,
      wallet.publicKey,
    );
    auctionView.auction = newAuctionState[0];
    auctionView.myBidderPot = newAuctionState[1];
    auctionView.myBidderMetadata = newAuctionState[2];
    if (
      wallet.publicKey &&
      auctionView.auction.info.bidState.type == BidStateType.EnglishAuction
    ) {
      const winnerIndex = auctionView.auction.info.bidState.getWinnerIndex(
        wallet.publicKey.toBase58(),
      );
      if (winnerIndex === null)
        auctionView.auction.info.bidState.bids.unshift(
          new Bid({
            key: wallet.publicKey.toBase58(),
            amount: new BN(instantSalePrice || 0),
          }),
        );
      // It isnt here yet
      if (!auctionView.myBidderPot)
        auctionView.myBidderPot = {
          pubkey: 'none',
          //@ts-ignore
          account: {},
          info: new BidderPot({
            bidderPot: 'dummy',
            bidderAct: wallet.publicKey.toBase58(),
            auctionAct: auctionView.auction.pubkey,
            emptied: false,
          }),
        };
    }
    // Claim the purchase
    try {
      await sendRedeemBid(
        connection,
        wallet,
        myPayingAccount.pubkey,
        auctionView,
        accountByMint,
        prizeTrackingTickets,
        bidRedemptions,
        bids,
      );
      await update();
    } catch (e) {
      console.error(e);
      setAlertState({
        open: true,
        message: 'There was an issue redeeming or refunding your bid. Please try again.',
        severity: 'error'
      });
    }

    setShowBuyModal(false);
  }

  const test = async () => {
    setShowBuyModal(true);
    setTimeout(() => {
      setAlertState({
        open: true,
        message: 'There was an issue redeeming or refunding your bid. Please try again.',
        severity: 'error'
      });
      setShowBuyModal(false);
    }, 3000);
    
  }

  return (
    <div className="main-area">
      <div className="container art-container">
        <Row ref={ref} gutter={24}>
          <Col span={24} lg={12}>
            <div className="artwork-view">
              <ArtContent
                className="artwork-image"
                pubkey={id}
                active={true}
                allowMeshRender={true}
                artView={true}
              />
            </div>
            <Collapse className="price-history" expandIconPosition="right">
              <Panel
                key={0}
                header="Price History"
                className="bg-secondary"
                extra={
                  <img
                    src="/icons/activity.svg"
                    width={24}
                    alt="price history"
                  />
                }
              >
                <Skeleton paragraph={{ rows: 3 }} active />
              </Panel>
            </Collapse>
          </Col>
          <Col span={24} lg={12}>
            <div className="art-title">
              {art.title || <Skeleton paragraph={{ rows: 0 }} />}
            </div>
            <CollectionInfo />
            <ViewOn id={id} />
            <ActionView
              instantSalePrice={instantSalePrice}
              isOwner={isOwner}
              loading={loading}
              attributes={attributes}
              setAttributes={setAttributes}
              listNow={listNow}
              buyNow={test}
            />
            <ArtInfo art={art} data={data} />
          </Col>
        </Row>
      </div>
      <MetaplexModal visible={showBuyModal} closable={false} className='main-modal'>
        <div className='buy-modal'>
          <div>
            <Spin />
            <span className='header-text'>Do not close this window</span>
          </div>
          <span className='main-text'>After wallet approval, your transaction will be finished in about 3s.</span>
          <div className='content'>
            <span>While you are waiting. Join our <a>discord</a> & <a>twitter</a> community for weekly giveaways</span>
          </div>
        </div>
      </MetaplexModal>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
