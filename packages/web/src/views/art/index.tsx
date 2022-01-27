import React, { useState } from 'react';
import { Row, Col, Skeleton, Collapse } from 'antd';
import { useParams } from 'react-router-dom';
import {
  AuctionView,
  useArt,
  useAuctions,
  useBidsForAuction,
  useExtendedArt,
} from '../../hooks';

import { ArtContent } from '../../components/ArtContent';
import { useWallet } from '@solana/wallet-adapter-react';
import { ViewOn } from '../../components/ViewOn';
import { ArtInfo } from './ArtInfo';
import { CollectionInfo } from './CollectionInfo';
import { ActionView } from './ActionView';
import {
  AmountRange,
  IPartialCreateAuctionArgs,
  PriceFloor,
  PriceFloorType,
  useConnection,
  useMeta,
  useMint,
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
import { Waiting } from './Waiting';

const { Panel } = Collapse;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const connection = useConnection();
  const wallet = useWallet();

  const art = useArt(id);
  let auction: AuctionView | undefined;
  const auctions = useAuctions();
  const filters = auctions.filter(
    item => item.thumbnail.metadata.pubkey === id,
  );
  if (filters.length > 0) {
    auction = filters[0];
  }
  
  const pubkey = wallet?.publicKey?.toBase58() || '';
  const isOwner = art?.creators
    ? art.creators.find(item => item.address === pubkey)
      ? true
      : false
    : false;
  const { ref, data } = useExtendedArt(id);

  const {
    metadata,
    masterEditions,
    editions,
    whitelistedCreatorsByCreator,
    storeIndexer,
  } = useMeta();
  const { tokenMap } = useTokenList();
  // const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const m = metadata.filter(item => item.pubkey === id)[0];
  const safetyDeposit: SafetyDepositDraft = {
    holding: m.pubkey,
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

  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState<AuctionState>({
    reservationPrice: 0,
    items: [safetyDeposit],
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
    // setAuctionObj(_auctionObj);
  };

  return (
    <div className="main-area">
      <div className="container art-container">
        {loading ? (
          <Waiting
            createAuction={createAuction}
            confirm={() => setLoading(false)}
          />
        ) : (
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
                auctionView={auction}
                isOwner={isOwner}
                listnow={() => setLoading(true)}
                attributes={attributes}
                setAttributes={setAttributes}
              />
              <ArtInfo art={art} data={data} />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};
