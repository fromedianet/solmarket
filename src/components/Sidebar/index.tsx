import { useRouter } from "next/router";
import React from "react";
import { Menu, Layout } from "antd";
import { useGetSidebarState, useSetSidebarState } from "../../contexts";
import {
  BarsOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { CurrentUserBadge } from "../CurrentUserBadge";
import useWindowDimensions from "../../utils/layout";
import { ConnectButton } from "../ConnectButton";

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
  const router = useRouter();

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
        theme="dark"
        mode="inline"
        className="sidebar-menu"
        onClick={onCollapse}
        items={[
          {
            key: "home",
            label: "Home",
            icon: <HomeOutlined style={{ fontSize: 20 }} />,
            onClick: () => router.push("/"),
          },
          {
            key: "collections",
            label: "Collections",
            icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: "all-collections",
                label: "All",
                onClick: () => router.push("/collections/all"),
              },
              {
                key: "popular-collections",
                label: "Popular",
                onClick: () => router.push("/collections/popular"),
              },
              {
                key: "new-collections",
                label: "New",
                onClick: () => router.push("/collections/new"),
              },
            ],
          },
          {
            key: "community",
            label: "Community",
            icon: <UsergroupAddOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: "twitter",
                label: "Twitter",
                onClick: () =>
                  window.open("https://twitter.com/papercityio", "_blank"),
              },
              {
                key: "discord",
                label: "Discord",
                onClick: () => {},
              },
            ],
          },
          {
            key: "sell",
            label: "Sell your NFT",
            icon: <ShopOutlined style={{ fontSize: 20 }} />,
            onClick: () => router.push("/sell"),
          },
          {
            key: "more",
            label: "More",
            icon: <BarsOutlined style={{ fontSize: 20 }} />,
            children: [
              {
                key: "faq",
                label: "FAQ",
                onClick: () => router.push("/faq"),
              },
            ],
          },
        ]}
      />
    );
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
      <SidebarMenu />
    </Sider>
  );
};
