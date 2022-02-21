import React, { useState } from 'react';
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { ConnectButton, shortenAddress, useMeta } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useHistory } from 'react-router-dom';
import { useSetSidebarState } from '../../contexts';
import { CurrentUserBadge } from '../CurrentUserBadge';

const { Option } = Select;

export const WalletInfo = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet">
      <div className="wallet-info">
        <button className="profile-btn">
          <Link to={'/profile'}>
            <UserOutlined />
          </Link>
        </button>
        {!connected ? (
          <ConnectButton className="connect-btn" />
        ) : (
          <CurrentUserBadge
            showBalance={false}
            showAddress={true}
            iconSize={24}
          />
        )}
      </div>
    </div>
  );
};

export const LogoLink = () => {
  return (
    <Link to={`/`} className="navbar-brand">
      <img src={'/solana-logo.jpg'} />
    </Link>
  );
};

export const AppBar = () => {
  const history = useHistory();
  const { handleToggle } = useSetSidebarState();
  const [showSearchBar, toggleSearchBar] = useState(false);
  const { whitelistedCreatorsByCreator } = useMeta();
  const creators = Object.values(whitelistedCreatorsByCreator);

  const onChange = value => {
    history.push(`/artists/${value}`);
  };

  return (
    <div className="navbar-expand-lg">
      <div className="nav-container">
        <div className="left-container">
          {!showSearchBar && (
            <div className="brand">
              <button className="menu-btn" onClick={() => handleToggle()}>
                <MenuOutlined className="menu-icon" />
              </button>
              <LogoLink />
            </div>
          )}
          <div className={`search-container ${!showSearchBar && 'tw-hidden'}`}>
            <Select
              className="search-control"
              placeholder="Search Creators"
              optionFilterProp="children"
              onChange={onChange}
              suffixIcon={<SearchOutlined />}
              value={null}
            >
              {creators.map((item, index) => (
                <Option key={index} value={item.info.address}>
                  <img
                    src={`https://avatars.dicebear.com/api/jdenticon/${item.info.address}.svg`}
                    className="creator-icon"
                    alt={item.info.address}
                  />
                  <span>{shortenAddress(item.info.address)}</span>
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="right-container">
          <div className="btn-container">
            <button
              className="search-btn"
              onClick={() => toggleSearchBar(prevState => !prevState)}
            >
              <SearchOutlined className="search-icon" />
            </button>
          </div>
          <WalletInfo />
        </div>
      </div>
    </div>
  );
};
