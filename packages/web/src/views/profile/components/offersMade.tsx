import React, { useState } from 'react';
import { Dropdown, Menu, Spin, Row, Col, Button, Table } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { formatAmount, MetaplexModal, useNativeAccount } from '@oyster/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { OffersMadeColumns } from '../tableColumns';
import { Offer } from '../../../models/offer';

export const OffersMade = ({
  offers,
  balance,
  exBalance,
  loadingBalance,
  callShowEscrow,
  onCancelBid,
  onCancelBidAndWithdraw,
}: {
  offers: Offer[];
  balance: number;
  exBalance: number;
  loadingBalance: boolean;
  callShowEscrow: () => void;
  onCancelBid: (a) => void;
  onCancelBidAndWithdraw: (a) => void;
}) => {
  const { account } = useNativeAccount();
  const mainBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();

  const offersColumns = OffersMadeColumns({
    balance: balance,
    onCancel: (data: Offer) => {
      setSelectedOffer(data);
      setCancelVisible(true);
    },
    onDeposit: () => {},
  });

  const menu1 = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet',
          key: '0',
          disabled: mainBalance === 0,
          onClick: () => {},
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
          disabled: balance === 0,
          onClick: () => {},
        },
      ]}
    />
  );

  const menu2 = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet',
          key: '0',
          disabled: mainBalance === 0,
          onClick: () => {},
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
          disabled: exBalance === 0,
          onClick: () => {},
        },
      ]}
    />
  );

  return (
    <div className="offers-made">
      <div className="wallet-container">
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} />
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Bidding Wallet</span>
            <span className="wallet-price">{`${formatAmount(
              balance,
              2,
              true,
            )} ◎`}</span>
          </div>
          <Dropdown overlay={menu1} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <MoreOutlined style={{ color: 'white', fontSize: 32 }} />
            </a>
          </Dropdown>
        </div>
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} />
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Bidding Wallet (ME)</span>
            <span className="wallet-price">{`${formatAmount(
              exBalance,
              2,
              true,
            )} ◎`}</span>
          </div>
          <Dropdown overlay={menu2} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <MoreOutlined style={{ color: 'white', fontSize: 32 }} />
            </a>
          </Dropdown>
        </div>
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} />
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Main Wallet</span>
            <span className="wallet-price">{`${formatAmount(
              mainBalance,
              2,
              true,
            )} ◎`}</span>
          </div>
        </div>
        <button
          onClick={callShowEscrow}
          className="balance-btn"
          disabled={loadingBalance}
        >
          {loadingBalance ? (
            <Spin />
          ) : (
            <img src="/icons/refresh.svg" style={{ width: 24, height: 24 }} />
          )}
        </button>
      </div>
      <Table
        columns={offersColumns}
        dataSource={offers}
        style={{ overflowX: 'auto' }}
        pagination={{ position: ['bottomLeft'], pageSize: 10 }}
      />
      <MetaplexModal
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
      >
        <div className="cancel-modal">
          <div className="header-container">
            <img src="/icons/wallet.png" className="header-icon" alt="wallet" />
            <span className="header-text">
              After cancelling your offer, do you want to withdraw funds back to
              your wallet?
            </span>
          </div>
          <div className="body-container">
            <span className="main-text">
              The funds for your offer is held in an escrow account as collatral
              to support multiple offers. If you choose &quot;Keep funds in
              escrow&quot;, you will be able to make offers faster and more
              easily.
            </span>
          </div>
          <Row>
            <Col span={9}>
              <Button
                onClick={() => {
                  setCancelVisible(false);
                  onCancelBidAndWithdraw(selectedOffer!);
                }}
              >
                Withdraw
              </Button>
            </Col>
            <Col span={12}>
              <Button
                style={{ marginLeft: 8, background: '#009999' }}
                onClick={() => {
                  setCancelVisible(false);
                  onCancelBid(selectedOffer!);
                }}
              >
                Keep funds in escrow
              </Button>
            </Col>
          </Row>
        </div>
      </MetaplexModal>
    </div>
  );
};
