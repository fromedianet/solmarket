import React, { useEffect, useState } from 'react';
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { ConnectButton } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useHistory } from 'react-router-dom';
import { useSetSidebarState } from '../../contexts';
import { CurrentUserBadge } from '../CurrentUserBadge';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { ExCollection } from '../../models/exCollection';
import { useExCollectionsAPI } from '../../hooks/useExCollections';
import { MarketType } from '../../constants';

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
  const exAPI = useExCollectionsAPI();
  const [collections, setCollections] = useState<ExCollection[]>([]);

  useEffect(() => {
    loadCollections().then(res => {
      setCollections(res);
    });
  }, []);

  async function loadCollections() {
    let data = [];
    data = await getAllCollections();
    const exData = await exAPI.getAllCollections(MarketType.MagicEden);
    data = data.concat(exData);
    return data;
  }

  const onChange = value => {
    history.push(value);
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
              placeholder="Search Collections"
              optionFilterProp="children"
              onChange={onChange}
              suffixIcon={<SearchOutlined />}
              value={null}
            >
              {collections.map((item, index) => (
                <Option
                  key={index}
                  value={
                    item.market
                      ? `/excollection/${item.symbol}?market=${item.market}`
                      : `/marketplace/${item.symbol}`
                  }
                >
                  <img
                    src={item.image}
                    className="creator-icon"
                    alt={item.name}
                  />
                  <span>{item.name}</span>
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
