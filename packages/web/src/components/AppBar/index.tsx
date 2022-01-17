import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
// import { Notifications } from '../Notifications';
import { MenuOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
// import { HowToBuyModal } from '../HowToBuyModal';
import { SearchBar } from "../SearchBar";
import {
  Cog,
  CurrentUserBadge,
} from '../CurrentUserBadge';
import { ConnectButton } from '@oyster/common';
import useWindowDimensions from '../../utils/layout';
import { useSetSidebarState } from '../../contexts';
const { SubMenu } = Menu;

export const WalletInfo = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet">
      {!connected ? (
        <div className="wallet-info">
          <ConnectButton className="navbar-connect" allowWalletChange />
        </div>
      ) : (
        <div className="wallet-info">
          <CurrentUserBadge
            showBalance={false}
            showAddress={true}
            iconSize={24}
          />
          <Cog />
          {/* <Notifications /> */}
        </div>
      )}
    </div>
  )
};

export const LogoLink = () => {
  return (
    <Link to={`/`} className='navbar-brand'>
      <img src={'/metaplex-logo.svg'} />
    </Link>
  );
};

export const AppBar = () => {
  const { handleToggle } = useSetSidebarState();
  const [showSearchBar, toggleSearchBar] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const handleSearch = (event: any) => {
    const searchText = event?.target?.value;
    setSearchKey(searchText);
  };

  return (
    <div className='navbar-expand-lg'>
      <div className='container'>
        <div className='left-container'>
          {!showSearchBar && (
            <div className='brand'>
              <button
                className="menu-btn"
                onClick={handleToggle}
              >
                <MenuOutlined className='menu-icon' />
              </button>
              <LogoLink />
            </div>
          )}
          <div className={`search-container ${!showSearchBar && 'tw-hidden'}`}>
            <SearchBar
              value={searchKey}
              placeholder="Search Collections"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              controlClass="search-control"
              onChange={handleSearch}
              tabIndex={0}
            />
          </div>
        </div>
        <div className='right-container'>
          <div className='btn-container'>
            <button
              className='search-btn'
              onClick={() => toggleSearchBar((prevState) => !prevState)}
            >
              <SearchOutlined className='search-icon'/>
            </button>
          </div>
          <WalletInfo />
        </div>
      </div>
    </div>
    
  );
};
