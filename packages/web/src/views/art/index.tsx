import React, { useEffect, useMemo, useState } from 'react';
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
import { ArtContent } from '../../components/ArtContent';
import { useWallet } from '@solana/wallet-adapter-react';
import { ViewOn } from '../../components/ViewOn';
import { ArtDetails } from './ArtDetails';
import { ArtInfo } from './ArtInfo';
import { ArtAction } from './ArtAction';
import {
  AmountRange,
  IPartialCreateAuctionArgs,
  MetaplexModal,
  PriceFloor,
  PriceFloorType,
  TokenAccount,
  useConnection,
  useMeta,
  useMint,
  useStore,
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
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getTokenAccountByMint } from '../../contexts/getTokenAccountByMint';
import { BottomSection } from './BottomSection';
import { ArtOwnerAction } from './ArtOwnerAction';
// import { getGlobalActivityByMint } from '../../contexts/getGlobalActivityByMint';

const { Panel } = Collapse;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [account, setAccount] = useState<TokenAccount | undefined>();

  const { storeAddress } = useStore();
  console.log('storeAddress', storeAddress);
  const connection = useConnection();
  const wallet = useWallet();

  const art = useArt(id);
  const { ref, data } = useExtendedArt(id);

  useEffect(() => {
    if (art.mint) {
      getTokenAccountByMint(connection, new PublicKey(art.mint)).then(value => {
        if (value) setAccount(value);
      });

      // getGlobalActivityByMint(connection, new PublicKey(art.mint));
    }
  }, [art]);

  let auctionView: AuctionView | undefined;
  const auctions = useAuctions();
  const filters = auctions.filter(
    item => item.thumbnail.metadata.pubkey === id,
  );
  if (filters.length > 0) {
    auctionView = filters[0];
  }

  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');

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

  const { accountByMint } = useUserAccounts();
  const { tokenMap } = useTokenList();
  const m = metadata.filter(item => item.pubkey === id)[0];
  const balance = useUserBalance(auctionView?.auction.info.tokenMint);
  const myPayingAccount = balance.accounts[0];
  const instantSalePrice = useMemo(
    () =>
      (auctionView?.auction?.info.priceFloor.minPrice || new BN(0)).toNumber() /
      LAMPORTS_PER_SOL,
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
    items: (safetyDeposit && [safetyDeposit]) || [],
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
    return;
    setLoading(true);
    await createAuction();
    setLoading(false);
  };

  const cancelList = async () => {
    return;
    // if (!auctionView) return;
    // setLoading(true);
    // try {
    //   console.log('auctionView endedAt', auctionView.auction.info.endedAt);
    //   console.log('accountByMint', accountByMint);
    //   console.log('bids', bids);
    //   console.log('bidRedemptions', bidRedemptions);
    //   console.log('prizeTrackingTickets', prizeTrackingTickets);
    //   await endSale({
    //     auctionView,
    //     connection,
    //     accountByMint,
    //     bids,
    //     bidRedemptions,
    //     prizeTrackingTickets,
    //     wallet,
    //   });

    //   notify({
    //     message: 'Transaction successed',
    //     description: '',
    //     type: 'success',
    //   });
    //   setLoading(false);
    // } catch (e) {
    //   console.error('endAuction', e);
    //   setLoading(false);
    //   notify({
    //     message: 'Transaction failed...',
    //     description: 'There was an issue cancel list. Please try again.',
    //     type: 'error',
    //   });
    //   return;
    // }
  };

  const buyNow = async () => {
    return;
    // if (!auctionView) return;
    // setShowBuyModal(true);

    // // Placing a "bid" of the full amount results in a purchase to redeem.
    // try {
    //   console.log('sendPlaceBid');
    //   await sendPlaceBid(
    //     connection,
    //     wallet,
    //     myPayingAccount.pubkey,
    //     auctionView,
    //     accountByMint,
    //     instantSalePrice,
    //     // make sure all accounts are created
    //     'finalized',
    //   );
    //   // setLastBid(bid);
    // } catch (e) {
    //   console.error('sendPlaceBid', e);
    //   notify({
    //     message: 'Transaction failed...',
    //     description: 'There was an issue place a bid. Please try again.',
    //     type: 'error',
    //   });
    //   setShowBuyModal(false);
    //   return;
    // }

    // const newAuctionState = await update(
    //   auctionView.auction.pubkey,
    //   wallet.publicKey,
    // );
    // auctionView.auction = newAuctionState[0];
    // auctionView.myBidderPot = newAuctionState[1];
    // auctionView.myBidderMetadata = newAuctionState[2];
    // if (
    //   wallet.publicKey &&
    //   auctionView.auction.info.bidState.type == BidStateType.EnglishAuction
    // ) {
    //   const winnerIndex = auctionView.auction.info.bidState.getWinnerIndex(
    //     wallet.publicKey.toBase58(),
    //   );
    //   if (winnerIndex === null)
    //     auctionView.auction.info.bidState.bids.unshift(
    //       new Bid({
    //         key: wallet.publicKey.toBase58(),
    //         amount: new BN(instantSalePrice || 0),
    //       }),
    //     );
    //   // It isnt here yet
    //   if (!auctionView.myBidderPot)
    //     auctionView.myBidderPot = {
    //       pubkey: 'none',
    //       //@ts-ignore
    //       account: {},
    //       info: new BidderPot({
    //         bidderPot: 'dummy',
    //         bidderAct: wallet.publicKey.toBase58(),
    //         auctionAct: auctionView.auction.pubkey,
    //         emptied: false,
    //       }),
    //     };
    // }
    // // Claim the purchase
    // try {
    //   await sendRedeemBid(
    //     connection,
    //     wallet,
    //     myPayingAccount.pubkey,
    //     auctionView,
    //     accountByMint,
    //     prizeTrackingTickets,
    //     bidRedemptions,
    //     bids,
    //   );
    //   await update();
    // } catch (e) {
    //   console.error(e);
    //   notify({
    //     message: 'Transaction failed...',
    //     description:
    //       'There was an issue redeeming or refunding your bid. Please try again.',
    //     type: 'error',
    //   });
    //   setShowBuyModal(false);
    //   return;
    // }

    // notify({
    //   message: 'Transaction successed',
    //   description: '',
    //   type: 'success',
    // });
    // setShowBuyModal(false);
  };

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container art-container">
          <Row ref={ref} gutter={24}>
            <Col span={24} lg={12}>
              <div className="artwork-view">
                <ArtContent
                  className="artwork-image"
                  pubkey={id}
                  active={true}
                  allowMeshRender={true}
                  artview={true}
                />
              </div>
              <Collapse
                className="price-history"
                expandIconPosition="right"
                defaultActiveKey={'price'}
              >
                <Panel
                  key="price"
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
              <ArtInfo />
              <ViewOn id={id} />
              {auctionView ? (
                <ArtAction
                  instantSalePrice={instantSalePrice}
                  isOwner={isOwner}
                  loading={loading}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  listNow={listNow}
                  cancelList={cancelList}
                  buyNow={buyNow}
                />
              ) : (
                <ArtOwnerAction
                  loading={loading}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  listNow={listNow}
                />
              )}

              <ArtDetails art={art} data={data} account={account} />
            </Col>
          </Row>
          <BottomSection offers={[]} />
        </div>
      </div>
      <MetaplexModal
        visible={showBuyModal}
        closable={false}
        className="main-modal"
      >
        <div className="buy-modal">
          <div>
            <Spin />
            <span className="header-text">Do not close this window</span>
          </div>
          <span className="main-text">
            After wallet approval, your transaction will be finished in about
            3s.
          </span>
          <div className="content">
            <span>
              While you are waiting. Join our <a>discord</a> & <a>twitter</a>{' '}
              community for weekly giveaways
            </span>
          </div>
        </div>
      </MetaplexModal>
    </div>
  );
};
