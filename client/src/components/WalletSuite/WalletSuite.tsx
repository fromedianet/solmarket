import React from "react";
import {
  useGlobalModalContext,
  MODAL_TYPES,
} from "providers/GlobalModalProvider";
import { useGetPhantom, useSetPhantom } from "wallets/Phantom";
import { maskAddress } from "utils/helpers";
import { AiOutlineCopy, AiOutlineDisconnect } from "react-icons/ai";
import PhantomIcon from "assets/icons/wallets/phantom.svg";
import "./index.css";

export default function WalletSuite() {
  const { showModal } = useGlobalModalContext();
  const { connected, loading, publicKey } = useGetPhantom();
  const { disconnect } = useSetPhantom();
  const toggleConnector = () => {
    showModal(MODAL_TYPES.CONNECT_MODAL);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(publicKey);
  };

  return (
    <div className="wallet-suite-container">
      {!connected ? (
        <button onClick={toggleConnector}>
          <span>{loading ? "Loading..." : "Connect"}</span>
        </button>
      ) : (
        <button
          id="navbarDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={() => {}}
        >
          <i className="icon">
            <img src={PhantomIcon} alt="phantom-icon" />
          </i>
          <span>{maskAddress(publicKey)}</span>
        </button>
      )}
      <ul
        className="dropdown-menu p-0 wallet-suite-menu"
        aria-labelledby="navbarDropdown"
      >
        <li
          className="nav-item dropdown wallet-suite-menu-item"
          onClick={handleCopyAddress}
        >
          <i className="menu-item-icon">
            <AiOutlineCopy size={24} />
          </i>
          Copy address
        </li>
        <li
          className="nav-item dropdown wallet-suite-menu-item"
          onClick={disconnect}
        >
          <i className="menu-item-icon">
            <AiOutlineDisconnect size={24} />
          </i>
          Disconnect
        </li>
      </ul>
    </div>
  );
}
