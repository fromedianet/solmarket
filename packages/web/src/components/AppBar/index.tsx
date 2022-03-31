import React, { useEffect, useState } from 'react';
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { ConnectButton, shortenAddress } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useHistory } from 'react-router-dom';
import { useSetSidebarState } from '../../contexts';
import { CurrentUserBadge } from '../CurrentUserBadge';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { ExCollection } from '../../models/exCollection';

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
      <img src={'/papercity-logo.png'} />
    </Link>
  );
};

export const AppBar = () => {
  const history = useHistory();
  const { handleToggle } = useSetSidebarState();
  const [showSearchBar, toggleSearchBar] = useState(false);
  const { getAllCollections } = useCollectionsAPI();
  const [collections, setCollections] = useState<ExCollection[]>([]);

  useEffect(() => {
    getAllCollections()
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollections(res['data']);
        }
      });
  }, []);

  const onChange = value => {
    history.push(`/marketplace/${value}`);
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
              {collections.map((item, index) => (
                <Option key={index} value={item.symbol}>
                  <img
                    src={item.thumbnail}
                    className="creator-icon"
                    alt={item.name}
                  />
                  <span>{shortenAddress(item.name)}</span>
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
