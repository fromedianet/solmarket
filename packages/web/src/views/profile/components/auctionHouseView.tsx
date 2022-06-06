import { formatAmount } from '@oyster/common';
import React from 'react';
import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

export const AuctionHouseView = ({
  auctionHouseObj,
  onWithdrawTreasury,
}: {
  auctionHouseObj: any;
  onWithdrawTreasury: (a) => void;
}) => {
  const menu = (
    <Menu
      items={[
        {
          label: 'Withdraw all from Treasury',
          key: '0',
          disabled: auctionHouseObj.treasuryBalance === 0,
          onClick: () => {
            onWithdrawTreasury(auctionHouseObj.treasuryBalance);
          },
        },
        {
          label: 'Show from explorer',
          key: '1',
          onClick: () => {
            window.open(
              `https://explorer.solana.com/address/${auctionHouseObj.auctionHouseTreasury}`,
              '_blank',
            );
          },
        },
        {
          label: 'Copy address',
          key: '2',
          onClick: () => {
            navigator.clipboard.writeText(auctionHouseObj.auctionHouseTreasury);
          },
        },
      ]}
    />
  );

  const menu1 = (
    <Menu
      items={[
        {
          label: 'Show from explorer',
          key: '0',
          onClick: () => {
            window.open(
              `https://explorer.solana.com/address/${auctionHouseObj.auctionHouseFeeAccount}`,
              '_blank',
            );
          },
        },
        {
          label: 'Copy address',
          key: '1',
          onClick: () => {
            navigator.clipboard.writeText(
              auctionHouseObj.auctionHouseFeeAccount,
            );
          },
        },
      ]}
    />
  );

  return (
    <div className="auction-house">
      <div className="wallet-container">
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} alt="sol"/>
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Treasury Balance</span>
            <span className="wallet-price">
              {`${formatAmount(auctionHouseObj.treasuryBalance, 3, true)} ◎`}
            </span>
          </div>
          <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <MoreOutlined style={{ color: 'white', fontSize: 24 }} />
            </a>
          </Dropdown>
        </div>
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} alt="sol"/>
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Auction House Fee Balance</span>
            <span className="wallet-price">
              {`${formatAmount(auctionHouseObj.feeAccountBalance, 3, true)} ◎`}
            </span>
          </div>
          <Dropdown overlay={menu1} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <MoreOutlined style={{ color: 'white', fontSize: 24 }} />
            </a>
          </Dropdown>
        </div>
      </div>
      {auctionHouseObj.feeAccountBalance < 0.01 && (
        <div>
          <span style={{ color: '#ffaa00' }}>
            Fee account balance is too small. You need to some SOLs (such as 1
            SOL) to Auction House Fee Account.
          </span>
        </div>
      )}
    </div>
  );
};
