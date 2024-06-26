import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSetSidebarState } from "../../contexts";
import { CurrentUserBadge } from "../CurrentUserBadge";
import { useCollectionsAPI } from "../../hooks/useCollectionsAPI";
import { ExCollection } from "../../models/exCollection";
import { ConnectButton } from "../ConnectButton";

const { Option } = Select;

export const WalletInfo = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet">
      <div className="wallet-info">
        <button className="profile-btn">
          <Link href="/profile">
            <a>
              <UserOutlined />
            </a>
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
    <Link href="/">
      <a>
        <img
          src={"/papercity-logo.png"}
          alt="app-logo"
          width={192}
          height={60}
        />
      </a>
    </Link>
  );
};

export const AppBar = () => {
  const router = useRouter();
  const { handleToggle } = useSetSidebarState();
  const [showSearchBar, toggleSearchBar] = useState(false);
  const { getAllCollections } = useCollectionsAPI();
  const [collections, setCollections] = useState<ExCollection[]>([]);
  const [filters, setFilters] = useState<ExCollection[]>([]);

  useEffect(() => {
    getAllCollections().then((res) => {
      setCollections(res);
    });
  }, []);

  useEffect(() => {
    setFilters(collections);
  }, [collections]);

  const onSearch = (val: string) => {
    const searchKey = val.toLowerCase();
    const newData = collections.filter((k) =>
      k.name.toLowerCase().includes(searchKey)
    );
    setFilters(newData);
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
          <div className={`search-container ${!showSearchBar && "tw-hidden"}`}>
            <Select
              className="search-control"
              placeholder="Search Collections"
              filterOption={false}
              showSearch={true}
              onSelect={(val) => router.push(val)}
              onSearch={(val) => onSearch(val)}
              suffixIcon={<SearchOutlined />}
              value={null}
              aria-controls="rc_select_0_list"
              aria-label="search listbox"
              aria-labelledby="search listbox"
              aria-expanded="false"
              aria-autocomplete="none"
              aria-readonly="false"
            >
              {filters.map((item, index) => (
                <Option
                  key={item.symbol}
                  value={`/marketplace/${
                    item.market ? item.market : "papercity"
                  }/${item.symbol}`}
                  role="option"
                  id={`rc_select_0_list_${index}`}
                >
                  <img
                    src={item.image}
                    className="creator-icon image-placeholder"
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
              onClick={() => toggleSearchBar((prevState) => !prevState)}
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
