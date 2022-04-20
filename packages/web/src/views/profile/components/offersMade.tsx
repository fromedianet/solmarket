import React from 'react';
import { Dropdown, Menu, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { formatAmount, useNativeAccount } from '@oyster/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const OffersMade = ({
  balance,
  exBalance,
  loadingBalance,
  callShowEscrow,
}: {
  balance: number,
  exBalance: number,
  loadingBalance: boolean,
  callShowEscrow: () => void,
}) => {

  const { account } = useNativeAccount();
  const mainBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const menu1 = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet',
          key: '0',
          disabled: mainBalance === 0,
          onClick: () => {}
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
          disabled: balance === 0,
          onClick: () => {}
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
          onClick: () => {}
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
          disabled: exBalance === 0,
          onClick: () => {}
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
            <span className="wallet-price">{`${formatAmount(balance, 2, true)} ◎`}</span>
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
            <span className="wallet-price">{`${formatAmount(exBalance, 2, true)} ◎`}</span>
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
            <span className="wallet-price">{`${formatAmount(mainBalance, 2, true)} ◎`}</span>
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
            <img
              src="/icons/refresh.svg"
              style={{ width: 24, height: 24 }}
            />
          )}
        </button>
      </div>
    </div>
  );
};
