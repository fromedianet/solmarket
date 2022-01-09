import React from "react";
import {
  useGlobalModalContext,
  MODAL_TYPES,
} from "providers/GlobalModalProvider";
import { useGetPhantom } from "wallets/Phantom";
import { maskAddress } from "utils/helpers";
import PhantomIcon from "assets/icons/wallets/phantom.svg";
import "./index.css";

export default function WalletSuite() {
  const { showModal } = useGlobalModalContext();
  const { connected, publicKey } = useGetPhantom();
  const toggleConnector = () => {
    showModal(MODAL_TYPES.CONNECT_MODAL);
  };

  return (
    <div className="wallet-suite-container">
      {!connected ? (
        <button onClick={toggleConnector}>
          <span>Connect</span>
        </button>
      ) : (
        <button onClick={() => {}}>
          <i className="icon">
            <img src={PhantomIcon} alt="phantom-icon" />
          </i>
          {maskAddress(publicKey)}
        </button>
      )}
    </div>
  );
}
