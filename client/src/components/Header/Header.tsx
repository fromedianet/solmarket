/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdClose, MdMenu, MdOutlineLanguage } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import "./Header.css";

export default function Header() {
  const [navShown, setNavShown] = useState(false);

  const toggleNav = () => {
    setNavShown((prevState) => !prevState);
  };

  return (
    <header id="header">
      <nav
        data-aos="zoom-out"
        data-aos-delay="900"
        className="navbar navbar-expand-lg"
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
                  <div className="header-search__control">
                    <div className="header-search__value-container">
                      <input
                        className="header-search__input"
                        id="header-search-input"
                        type="text"
                        placeholder="Search Collections"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        tabIndex={0}
                        aria-autocomplete="list"
                        aria-expanded="false"
                        aria-haspopup="true"
                        aria-controls="header-search-listbox"
                        aria-owns="header-search-listbox"
                        role="combobox"
                        aria-describedby="react-select-2-placeholder"
                        value=""
                      />
                    </div>
                    <div className="mr-1">
                      <RiSearchLine size="1.5em" color="rgb(89, 82, 128)" />
                    </div>
                  </div>
                </div>
              </li>
              <li className="order-2 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link uppercase lg:text-xs font-light tracking-wider fw-300"
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
              <li className="order-2 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link ps-0 uppercase lg:text-xs font-light tracking-wider fw-300"
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
              <li className="order-4 nav-item dropdown nav-item--main-nav whitespace-nowrap">
                <a
                  className="nav-link ps-0 uppercase lg:text-xs font-light tracking-wider fw-300"
                  href="/me?tab=my-items"
                >
                  Sell
                </a>
              </li>
              <li className="nav-item dropdown nav-item--main-nav whitespace-nowrap order-6">
                <a
                  className="nav-link ps-0 uppercase lg:text-xs font-light tracking-wider fw-300"
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
              <li className="nav-item dropdown nav-item--main-nav whitespace-nowrap order-8">
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
              <li className="nav-item dropdown whitespace-nowrap nav-item--main-nav order-10">
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
                  className="dropdown-menu p0 w-full"
                  aria-labelledby="navbarDropdown"
                >
                  <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                    <div className="nav-link subnav-nav-link border-gray-700 border-b border-solid">
                      English
                    </div>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                    <div className="nav-link subnav-nav-link border-gray-700 border-b border-solid">
                      한국어
                    </div>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                    <div className="nav-link subnav-nav-link border-gray-700 border-b border-solid">
                      日本語
                    </div>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                    <div className="nav-link subnav-nav-link border-gray-700 border-b border-solid">
                      Türkçe
                    </div>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                    <div className="nav-link subnav-nav-link border-gray-700 border-b border-solid">
                      Tiếng Việt
                    </div>
                  </li>
                  <li className="nav-item dropdown whitespace-nowrap cursor-pointer nav-item--inner hover:bg-indigo-700">
                    <div className="nav-link subnav-nav-link">Русский</div>
                  </li>
                </ul>
              </li>
              <li
                className="order-12 nav-item nav-item--main-nav ps-0 flex-shrink-0"
                id="wallet-connect-btn"
              >
                <div className="me-dropdown-container">
                  <div className="cursor-pointer position-relative">
                    <div className="flex items-center ButtonGroup_group__2mJyT">
                      <button className="inline-flex justify-center items-center rounded-md text-white-1 BorderedButton_btn__2Glkn">
                        <span className="h-full flex items-center">
                          <img
                            src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K"
                            alt="Phantom icon"
                            className="w-5"
                          />
                        </span>
                      </button>
                      <button className="inline-flex justify-center items-center rounded-md text-white-1 BorderedButton_btn__2Glkn">
                        14hChT3R...
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
