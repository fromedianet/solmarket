import React from 'react';
import { Drawer, Menu } from 'antd';
import { useGetSidebarState, useSetSidebarState } from '../../contexts';
import {
  BarChartOutlined,
  BarsOutlined,
  BellOutlined,
  CopyrightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton } from '@oyster/common';
import { CurrentUserBadge } from '../CurrentUserBadge';
import useWindowDimensions from '../../utils/layout';

const { SubMenu } = Menu;
const SidebarMenu = () => {
  return (
    <Menu className="sidebar-menu ant-menu-dark" mode={'inline'}>
      <Menu.Item key="home" icon={<HomeOutlined style={{ fontSize: 20 }} />}>
        Home
      </Menu.Item>
      <SubMenu
        key="collections"
        title="Collections"
        icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
      >
        <Menu.Item key="all-collections">All</Menu.Item>
        <Menu.Item key="popular-collections">Popular</Menu.Item>
        <Menu.Item key="new-collections">New</Menu.Item>
      </SubMenu>
      <Menu.Item
        key="launchpad"
        icon={<TagOutlined style={{ fontSize: 20 }} />}
      >
        Launchpad
      </Menu.Item>
      <Menu.Item
        key="auctions"
        icon={<BellOutlined style={{ fontSize: 20 }} />}
      >
        Auctions
      </Menu.Item>
      <Menu.Item
        key="stats"
        icon={<BarChartOutlined style={{ fontSize: 20 }} />}
      >
        Stats
      </Menu.Item>
      <SubMenu
        key="creators"
        title="Creators"
        icon={<CopyrightOutlined style={{ fontSize: 20 }} />}
      >
        <Menu.Item key="apply:1">Apply for listing</Menu.Item>
        <Menu.Item key="apply:2">Apply for Launchpad</Menu.Item>
      </SubMenu>
      <SubMenu
        key="community"
        title="Community"
        icon={<UsergroupAddOutlined style={{ fontSize: 20 }} />}
      >
        <Menu.Item key="twitter">Twitter</Menu.Item>
        <Menu.Item key="discord">Discord</Menu.Item>
        <Menu.Item key="podcast">Podcast</Menu.Item>
        <Menu.Item key="blog">Blog</Menu.Item>
        <Menu.Item key="shop">Shop</Menu.Item>
      </SubMenu>
      <SubMenu
        key="more"
        title="More"
        icon={<BarsOutlined style={{ fontSize: 20 }} />}
      >
        <Menu.Item key="faq">FAQ</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

const WalletInfo = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet">
      <div className="wallet-info">
        <button className="profile-btn">
          <UserOutlined />
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

export const Sidebar = () => {
  const { width } = useWindowDimensions();
  const { isShown } = useGetSidebarState();
  const { handleToggle } = useSetSidebarState();

  const onClose = () => {
    if (width < 768) {
      handleToggle();
    }
  };

  return (
    <Drawer
      placement="left"
      visible={isShown}
      closable={false}
      onClose={onClose}
      mask={width < 768}
      className="my-drawer"
    >
      <WalletInfo />
      <SidebarMenu />
    </Drawer>
  );
};