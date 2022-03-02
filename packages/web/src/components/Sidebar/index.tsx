import React from 'react';
import { Menu, Layout } from 'antd';
import { useGetSidebarState, useSetSidebarState } from '../../contexts';
import {
  BarChartOutlined,
  BarsOutlined,
  BellOutlined,
  CopyrightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton } from '@oyster/common';
import { CurrentUserBadge } from '../CurrentUserBadge';
import useWindowDimensions from '../../utils/layout';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;
const SidebarMenu = (props: { onCollapse: () => void }) => {
  return (
    <Menu
      className="sidebar-menu"
      theme="dark"
      mode={'inline'}
      onClick={props.onCollapse}
    >
      <Menu.Item key="home" icon={<HomeOutlined style={{ fontSize: 20 }} />}>
        <Link to={'/'}>Home</Link>
      </Menu.Item>
      <SubMenu
        key="collections"
        title="Collections"
        icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
      >
        <Menu.Item key="all-collections">
          <Link to="/collections">All</Link>
        </Menu.Item>
        {/* <Menu.Item key="popular-collections">
          <Link to="/collections?type=popular">Popular</Link>
        </Menu.Item> */}
        <Menu.Item key="new-collections">
          <Link to="/collections?type=new">new</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item
        key="launchpad"
        icon={<TagOutlined style={{ fontSize: 20 }} />}
      >
        <Link to="/launchpad">Launchpad</Link>
      </Menu.Item>
      <Menu.Item
        key="auctions"
        icon={<BellOutlined style={{ fontSize: 20 }} />}
      >
        <Link to="/auctions">Auctions</Link>
      </Menu.Item>
      <Menu.Item
        key="stats"
        icon={<BarChartOutlined style={{ fontSize: 20 }} />}
      >
        <Link to="/stats">Stats</Link>
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
        <Menu.Item key="faq">
          <Link to="/faq">FAQ</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="inventory"
        title="Inventory"
        icon={<ShoppingOutlined style={{ fontSize: 20 }} />}
      >
        <Menu.Item key="magiceden">
          <Link to="/inventory/magiceden">Magic Eden</Link>
        </Menu.Item>
        <Menu.Item key="solanart">
          <Link to="/inventory/solanart">Solanart</Link>
        </Menu.Item>
        <Menu.Item key="digital_eyes">
          <Link to="/inventory/digital_eyes">Digital Eyes</Link>
        </Menu.Item>
        <Menu.Item key="alpha_art">
          <Link to="/inventory/alpha_art">Alpha Art</Link>
        </Menu.Item>
        {/* <Menu.Item key="exchange_art">
          <Link to="/inventory/exchange_art">Exchange Art</Link>
        </Menu.Item>
        <Menu.Item key="solsea">
          <Link to="/inventory/solsea">Solsea</Link>
        </Menu.Item> */}
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
  const { collapsed } = useGetSidebarState();
  const { handleToggle } = useSetSidebarState();

  const onCollapse = () => {
    if (width < 992) {
      handleToggle();
    } else {
      handleToggle(false);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={width < 992 ? 0 : 80}
      theme="dark"
      onCollapse={onCollapse}
      className="my-sider"
    >
      <WalletInfo />
      <SidebarMenu onCollapse={onCollapse} />
    </Sider>
  );
};
