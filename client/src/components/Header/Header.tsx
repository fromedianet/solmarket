/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import SearchBar from "components/SearchBar/SearchBar";
import WalletSuite from "components/WalletSuite/WalletSuite";
import { FaRegUserCircle } from "react-icons/fa";
import { MdClose, MdMenu, MdOutlineLanguage } from "react-icons/md";
import "./Header.css";

const languages = [
  "English",
  "한국어",
  "日本語",
  "Türkçe",
  "Tiếng Việt",
  "Русский",
];

export default function Header() {
  const [navShown, setNavShown] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = (event: any) => {
    const searchText = event?.target?.value;
    setSearchWord(searchText);
  };

  const toggleNav = () => {
    setNavShown((prevState) => !prevState);
  };

  return (
    <header id="header">
      <nav
        data-aos="zoom-out"
        data-aos-delay="900"
        className="navbar navbar-expand-lg text-color-primary"
      >
        <div className="container header">
          <a className="navbar-brand mr-8" href="/">
            <img
              className="navbar-brand-sticky position-relative logo"
              src="/favicon.ico"
              alt="sticky brand-logo"
            />
          </a>
          <div className="ms-auto"></div>
          <button
            className="order-2 navbar-toggler order-lg-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleNav}
          >
            {navShown ? (
              <MdClose size="1.5em" color="white" />
            ) : (
              <MdMenu size="1.5em" color="white" />
            )}
          </button>
          <div
            className="order-2 collapse navbar-collapse justify-end"
            id="navbarNav"
          >
            <ul className="navbar-nav flex items-center flex-grow justify-end">
              <li className="nav-item nav-item--main-nav flex-grow md:w-full sm:px-4 md:p-0 lg:mr-8 ">
                <div className="nav-item--search-bar w-full px-4 lg:px-0">
                  <SearchBar
                    value={searchWord}
                    placeholder="Search Collections"
                    iconSize="1.5em"
                    iconColor="rgb(89, 82, 128)"
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
              </li>
              <li className="order-3 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link uppercase lg:text-xs font-light tracking-wider fw-300 hover:underline"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Apply
                </a>
                <ul
                  className="dropdown-menu p0 w-200px"
                  aria-labelledby="navbarDropdown"
                >
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link"
                      target="_blank"
                      href="https://airtable.com/shroOLXKGFsfhVWfd"
                      rel="noreferrer"
                    >
                      Apply for listing
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link"
                      target="_blank"
                      href="https://airtable.com/shrMhMDpcvt9nB6cu"
                      rel="noreferrer"
                    >
                      Apply for launchpad
                    </a>
                  </li>
                </ul>
              </li>
              <li className="order-4 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link ps-0 uppercase lg:text-xs font-light tracking-wider fw-300 hover:underline"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Browse
                </a>
                <ul
                  className="dropdown-menu p0 w-full "
                  aria-labelledby="navbarDropdown"
                >
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid"
                      href="/collections"
                    >
                      Collections
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid "
                      href="/stats"
                    >
                      Stats
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a className="nav-link subnav-nav-link" href="/launchpad">
                      Launchpad
                    </a>
                  </li>
                </ul>
              </li>
              <li className="order-5 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link ps-0 uppercase lg:text-xs font-light tracking-wider fw-300 hover:underline"
                  href="/me?tab=my-items"
                >
                  Sell
                </a>
              </li>
              <li className="order-5 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link ps-0 uppercase lg:text-xs font-light tracking-wider fw-300 hover:underline"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Community
                </a>
                <ul
                  className="dropdown-menu p0 w-full"
                  aria-labelledby="navbarDropdown"
                >
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      target="_blank"
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid"
                      href="https://twitter.com/magiceden_nft"
                      rel="noreferrer"
                    >
                      twitter
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      target="_blank"
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid"
                      href="https://discord.gg/b87UnCy6P2"
                      rel="noreferrer"
                    >
                      discord
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      target="_blank"
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid"
                      href="https://edenhour.simplecast.com/"
                      rel="noreferrer"
                    >
                      Podcast
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid"
                      href="/faq"
                    >
                      FAQ
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid"
                      target="_blank"
                      href="https://blog.magiceden.io"
                      rel="noreferrer"
                    >
                      Blog
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link"
                      target="_blank"
                      href="https://shop.magiceden.io/"
                      rel="noreferrer"
                    >
                      Shop
                    </a>
                  </li>
                </ul>
              </li>
              <li className="order-5 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link ps-0"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaRegUserCircle size="2em" color="currentColor" />
                </a>
                <ul
                  className="dropdown-menu p0 w-full"
                  aria-labelledby="navbarDropdown"
                >
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link border-gray-700 border-b border-solid "
                      href="/me?tab=my-items"
                    >
                      My items
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a
                      className="nav-link subnav-nav-link"
                      href="/me?tab=listed-items"
                    >
                      Listed items
                    </a>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap nav-item--inner hover:bg-indigo-700">
                    <a className="nav-link subnav-nav-link" href="/settings">
                      Settings
                    </a>
                  </li>
                </ul>
              </li>
              <li className="order-5 nav-item dropdown whitespace-nowrap nav-item--main-nav">
                <a
                  className="nav-link ps-0"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <MdOutlineLanguage size="2em" color="currentColor" />
                </a>
                <ul
                  className="dropdown-menu p-0 w-full"
                  aria-labelledby="navbarDropdown"
                >
                  {languages.map((language) => {
                    return (
                      <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                        <div className="nav-link subnav-nav-link border-gray-700 border-b border-solid">
                          {language}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li
                className="order-5 nav-item nav-item--main-nav ps-0 flex-shrink-0"
                id="wallet-connect-btn"
              >
                <WalletSuite />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
