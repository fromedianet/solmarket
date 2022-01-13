import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Modal } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import { CloseOutlined, MenuOutlined, SettingOutlined } from '@ant-design/icons';
import { HowToBuyModal } from '../HowToBuyModal';
import { SearchBar } from "../SearchBar";
import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../CurrentUserBadge';
import { ConnectButton } from '@oyster/common';
import useWindowDimensions from '../../utils/layout';
const { SubMenu } = Menu;

const DefaultActions = ({isMobile = false} : {isMobile: boolean}) => {
  return (
    <Menu
      style={{ width: "100%" }}
      mode={isMobile ? "inline" : "horizontal"}
    >
      <SubMenu key="apply" title="Apply">
        <Menu.Item key="apply:1">Apply for listing</Menu.Item>
        <Menu.Item key="apply:2">Apply for Launchpad</Menu.Item>
      </SubMenu>
      <SubMenu key="browse" title="Browse">
        <Menu.Item key="collections">Collections</Menu.Item>
        <Menu.Item key="stats">Stats</Menu.Item>
        <Menu.Item key="launchpad">Launchpad</Menu.Item>
        <Menu.Item key="auctions">Auctions</Menu.Item>
      </SubMenu>
      <Menu.Item key="sell">Sell</Menu.Item>
      <SubMenu key="community" title="Community">
        <Menu.Item key="twitter">Twitter</Menu.Item>
        <Menu.Item key="discord">Discord</Menu.Item>
        <Menu.Item key="podcast">Podcast</Menu.Item>
        <Menu.Item key="faq">FAQ</Menu.Item>
        <Menu.Item key="blog">Blog</Menu.Item>
        <Menu.Item key="shop">Shop</Menu.Item>
      </SubMenu>
      <SubMenu key="profile" icon={<SettingOutlined />}>
        <Menu.Item key="my_items">My Items</Menu.Item>
        <Menu.Item key="listed_items">Listed Items</Menu.Item>
        <Menu.Item key="settings">Settings</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export const MetaplexMenu = ({showMenu = false} : {showMenu: boolean}) => {
  const [searchWord, setSearchWord] = useState("");
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isHidden = isMobile && !showMenu;
  if (isHidden) {
    return null;
  }

  const handleSearch = (event: any) => {
    const searchText = event?.target?.value;
    setSearchWord(searchText);
  };

  return (
    <div className="navbar-collapse order-2 collapse">
      <div className="nav-item--search-container">
        <SearchBar
          value={searchWord}
          placeholder="Search Collections"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onChange={handleSearch}
          tabIndex={0}
          aria-autocomplete="list"
          aria-expanded="false"
          aria-haspopup="true"
          aria-controls="header-search-listbox"
          aria-owns="header-search-listbox"
          role="combobox"
          aria-describedby="react-select-2-placeholder"
        />
      </div>
      <DefaultActions isMobile={isMobile} />
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
  const [navShown, setNavShown] = useState(false);

  const toggleNav = () => {
    setNavShown((prevState) => !prevState);
  };

  return (
    <div className="navbar-expand-lg">
      <div className="container">
        <LogoLink />
        <div className="ms-auto"></div>
        <button
          className="navbar-toggler order-2"
          onClick={toggleNav}
        >
          {navShown ? (
            <CloseOutlined className='navbar-icon' />
          ) : (
            <MenuOutlined className='navbar-icon' />
          )}
        </button>
        <MetaplexMenu showMenu={navShown}/>
        {/* <div className="app-right">
          {!connected && (
            <HowToBuyModal buttonClassName="modal-button-default" />
          )}
          {!connected && (
            <ConnectButton style={{ height: 48 }} allowWalletChange />
          )}
          {connected && (
            <>
              <CurrentUserBadge
                showBalance={false}
                showAddress={true}
                iconSize={24}
              />
              <Notifications />
              <Cog />
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};
