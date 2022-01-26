import { ConnectButton, formatTokenAmount, IPartialCreateAuctionArgs, PriceFloor, PriceFloorType, useConnection, useMeta, useMint, WinnerLimit, WinnerLimitType, WinningConfigType, WRAPPED_SOL_MINT } from "@oyster/common";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import {Row, Col, Button, InputNumber} from 'antd';
import { AuctionView, useBidsForAuction } from "../../hooks";
import { AuctionCategory, AuctionState } from "../auctionCreate";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "bn.js";
import { createAuctionManager } from "../../actions/createAuctionManager";
import { QUOTE_MINT } from "../../constants";
import { useTokenList } from "../../contexts/tokenList";
import { Art } from "../../types";

export const ActionView = ({art, auction, isOwner}: {art: Art, auction: AuctionView | undefined, isOwner: boolean}) => {

  const connection = useConnection();
  const { whitelistedCreatorsByCreator, storeIndexer } = useMeta();
  const { tokenMap } = useTokenList();
  const wallet = useWallet();
  const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const mintInfo = useMint(auction?.auction.info.tokenMint);
  const bidValue = bids.length > 0 && parseFloat(formatTokenAmount(bids[0].info.lastBid, mintInfo, 1.0, '', ``, 2));

  const [attributes, setAddributes] = useState<AuctionState>({
    reservationPrice: 0,
    items: [],
    category: AuctionCategory.InstantSale,
    auctionDurationType: 'minutes',
    gapTimeType: 'minutes',
    winnersCount: 1,
    startSaleTS: undefined,
    startListTS: undefined,
    quoteMintAddress: QUOTE_MINT.toBase58(),
    //@ts-ignore
    quoteMintInfo: useMint(QUOTE_MINT.toBase58()),
    //@ts-ignore
    quoteMintInfoExtended: tokenMap.get(QUOTE_MINT.toBase58()),
  })
  
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
      instantSalePrice: new BN((attributes.instantSalePrice || 0) * LAMPORTS_PER_SOL),
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
    // setAuctionObj(_auctionObj);
  }

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
                onChange={info => 
                  setAddributes({
                    ...attributes,
                    priceFloor: parseFloat(info.toString()),
                    instantSalePrice: parseFloat(info.toString()),
                  })
                }
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
