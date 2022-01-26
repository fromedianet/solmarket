import {
  ConnectButton,
  formatTokenAmount,
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
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react';
import { Row, Col, Button, InputNumber, Form } from 'antd';
import { AuctionView, useBidsForAuction } from '../../hooks';
import { AuctionCategory, AuctionState } from '../auctionCreate';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from 'bn.js';
import {
  createAuctionManager,
  SafetyDepositDraft,
} from '../../actions/createAuctionManager';
import { QUOTE_MINT } from '../../constants';
import { useTokenList } from '../../contexts/tokenList';

interface PriceValue {
  number?: number;
}
interface PriceInputProps {
  value?: PriceValue;
  onChange?: (value: PriceValue) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = useState(0);
  const triggerChange = (changedValue: {number?: number}) => {
    onChange?.({number, ...value, ...changedValue});
  };
  const onNumberChange = (info?: number) => {
    const newNumber = parseFloat(info?.toString() || '0');
    if (Number.isNaN(number)) {
      return;
    }
    setNumber(newNumber);
    triggerChange({number: newNumber});
  }

  return (
    <InputNumber
      autoFocus
      className="price-input"
      placeholder="Price"
      controls={false}
      addonAfter="SOL"
      bordered={false}
      value={value.number || number}
      onChange={onNumberChange}
    />
  )
}

export const ActionView = ({
  id,
  auction,
  isOwner,
}: {
  id: string;
  auction: AuctionView | undefined;
  isOwner: boolean;
}) => {
  const connection = useConnection();
  const {
    metadata,
    masterEditions,
    editions,
    whitelistedCreatorsByCreator,
    storeIndexer,
  } = useMeta();
  const { tokenMap } = useTokenList();
  const wallet = useWallet();
  const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const mintInfo = useMint(auction?.auction.info.tokenMint);
  const bidValue =
    bids.length > 0 &&
    parseFloat(
      formatTokenAmount(bids[0].info.lastBid, mintInfo, 1.0, '', ``, 2),
    );

  const m = metadata.filter(item => item.pubkey === id)[0];
  const safetyDeposit: SafetyDepositDraft = {
    holding: m.pubkey,
    edition: editions[m.info.edition] || undefined,
    masterEdition: masterEditions[m.info.edition] || undefined,
    metadata: m,
    printingMintHolding: undefined,
    winningConfigType: WinningConfigType.PrintingV2,
    amountRanges: [],
    participationConfig: undefined
  };
  
  const [attributes, setAttributes] = useState<AuctionState>({
    reservationPrice: 0,
    items: [safetyDeposit],
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

  const checkPrice = (_: any, value: { number: number }) => {
    if (value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };

  const onFinish = (values: any) => {
    console.log('onFinish', values);
  }

  return (
    <div className="action-view">
      {bidValue && <span className="label">Current Price</span>}
      <div>
        <img src="/icons/price.svg" width={24} alt="price" />
        {bidValue && <span className="value">{bidValue} SOL</span>}
      </div>

      {!bidValue && <span className="value">Not listed</span>}
      <div className="btn-container">
        {!wallet.connected ? (
          <ConnectButton className="button" />
        ) : isOwner ? (
          bidValue ? (
            <Button className="button">Cancel Listing</Button>
          ) : (
            <Form
              name='price-control'
              layout='inline'
              onFinish={onFinish}
            >
              <Form.Item name='price' rules={[{ validator: checkPrice }]}>
                <PriceInput />
              </Form.Item>
              <Form.Item>
                <Button className="button" htmlType='submit'>List Now</Button>
              </Form.Item>
            </Form>
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
};
