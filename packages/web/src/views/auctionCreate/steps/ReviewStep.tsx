import {
  MAX_METADATA_LEN,
  useNativeAccount,
  WRAPPED_SOL_MINT,
} from '@oyster/common';
import { MintLayout } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Statistic, Divider, Spin } from 'antd';
import { AuctionCategory, AuctionState } from '../index';
import { useTokenList } from '../../../contexts/tokenList';
import { MINIMUM_SAFE_FEE_AUCTION_CREATION } from '../../../constants';
import { FundsIssueModal } from '../../../components/FundsIssueModal';
import { AmountLabel } from '../../../components/AmountLabel';
import { ArtContent } from '../../../components/ArtContent';

export const ReviewStep = (props: {
  confirm: () => void;
  attributes: AuctionState;
  setAttributes: Function;
  connection: Connection;
}) => {
  const [showFundsIssueModal, setShowFundsIssueModal] = useState(false);
  const [cost, setCost] = useState(0);
  const { account } = useNativeAccount();
  useEffect(() => {
    Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    // TODO: add
  }, [setCost]);

  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const item = props.attributes.items?.[0];

  const handleConfirm = () => {
    props.setAttributes({
      ...props.attributes,
      startListTS: props.attributes.startListTS || moment().unix(),
      startSaleTS: props.attributes.startSaleTS || moment().unix(),
    });
    props.confirm();
  };

  return (
    <>
      <Row className="call-to-action">
        <h2>Review and list</h2>
        <p>Review your listing before publishing.</p>
      </Row>
      <Row className="content-action" gutter={16}>
        <Col span={24} lg={12}>
          {item?.metadata.info && <ArtContent pubkey={item.metadata.pubkey} />}
        </Col>
        <Col className="section" span={24} lg={12}>
          <Statistic
            className="create-statistic"
            title="Copies"
            value={
              props.attributes.editions === undefined
                ? 'Unique'
                : props.attributes.editions
            }
          />
          {cost ? (
            <AmountLabel
              title="Cost to Create"
              amount={cost}
              tokenInfo={useTokenList().tokenMap.get(
                WRAPPED_SOL_MINT.toString(),
              )}
            />
          ) : (
            <Spin />
          )}
        </Col>
      </Row>
      <Row style={{ display: 'block' }}>
        <Divider />
        <Statistic
          className="create-statistic"
          title="Start date"
          value={
            props.attributes.startSaleTS
              ? moment
                  .unix(props.attributes.startSaleTS as number)
                  .format('dddd, MMMM Do YYYY, h:mm a')
              : 'Right after successfully published'
          }
        />
        <br />
        {props.attributes.startListTS && (
          <Statistic
            className="create-statistic"
            title="Listing go live date"
            value={moment
              .unix(props.attributes.startListTS as number)
              .format('dddd, MMMM Do YYYY, h:mm a')}
          />
        )}
        <Divider />
        <Statistic
          className="create-statistic"
          title="Sale ends"
          value={
            props.attributes.endTS
              ? moment
                  .unix(props.attributes.endTS as number)
                  .format('dddd, MMMM Do YYYY, h:mm a')
              : 'Until sold'
          }
        />
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            if (balance < MINIMUM_SAFE_FEE_AUCTION_CREATION) {
              setShowFundsIssueModal(true);
            } else {
              handleConfirm();
            }
          }}
          className="action-btn"
        >
          {props.attributes.category === AuctionCategory.InstantSale
            ? 'List for Sale'
            : 'Publish Auction'}
        </Button>
        <FundsIssueModal
          message={'Estimated Minimum Fee'}
          minimumFunds={MINIMUM_SAFE_FEE_AUCTION_CREATION}
          currentFunds={balance}
          isModalVisible={showFundsIssueModal}
          onClose={() => setShowFundsIssueModal(false)}
        />
      </Row>
    </>
  );
};
