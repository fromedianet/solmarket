import React from 'react';
import { Menu, Layout } from 'antd';
import { useGetSidebarState, useSetSidebarState } from '../../contexts';
import {
  // BarChartOutlined,
  BarsOutlined,
  // BellOutlined,
  CopyrightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  // ShoppingOutlined,
  TagOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton } from '@oyster/common';
import { CurrentUserBadge } from '../CurrentUserBadge';
import useWindowDimensions from '../../utils/layout';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

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
  const navigate = useNavigate();

  const onCollapse = () => {
    if (width < 992) {
      handleToggle();
    } else {
      handleToggle(false);
    }
  };

  const SidebarMenu = () => {
    return (
      <Menu
        theme='dark'
        mode='inline'
        className='sidebar-menu'
        onClick={onCollapse}
        items={[
          {
            key: 'home',
            label: 'Home',
            icon: <HomeOutlined style={{ fontSize: 20 }} />,
            onClick: () => navigate('/')
          },
          {
            key: 'collections',
            label: 'Collections',
            icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: 'all-collections',
                label: 'All',
                onClick: () => navigate('/collections')
              },
              {
                key: 'popular-collections',
                label: 'Popular',
                onClick: () => navigate('/collections?type=popular')
              },
              {
                key: 'new-collections',
                label: 'New',
                onClick: () => navigate('/collections?type=new')
              }
            ]
          },
          {
            key: 'launchpad',
            label: 'Launchpad',
            icon: <TagOutlined style={{ fontSize: 20 }} />,
            onClick: () => navigate('/launchpad')
          },
          {
            key: 'creators',
            label: 'Creators',
            icon: <CopyrightOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: 'dashboard',
                label: 'Apply for listing',
                onClick: () => window.open('/dashboard','_blank')
              }
            ]
          },
          {
            key: 'community',
            label: 'Community',
            icon: <UsergroupAddOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: 'twitter',
                label: 'Twitter',
                onClick: () => {}
              },
              {
                key: 'discord',
                label: 'Discord',
                onClick: () => {}
              },
              {
                key: 'blog',
                label: 'Blog',
                onClick: () => {}
              }
            ]
          },
          {
            key: 'more',
            label: 'More',
            icon: <BarsOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: 'faq',
                label: 'FAQ',
                onClick: () => {}
              }
            ]
          }
        ]}
      />
    )
  }

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
      <SidebarMenu />
    </Sider>
  );
};
