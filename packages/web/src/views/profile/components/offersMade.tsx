import React from 'react';
import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

export const OffersMade = () => {
  const menu = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet',
          key: '0',
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
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
            <span className="wallet-price">0 ◎</span>
          </div>
          <Dropdown overlay={menu} trigger={['click']}>
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
            <span className="wallet-price">0 ◎</span>
          </div>
          <Dropdown overlay={menu} trigger={['click']}>
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
            <span className="wallet-price">10 ◎</span>
          </div>
        </div>
      </div>
    </div>
  );
};
