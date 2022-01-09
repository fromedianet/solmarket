import React from "react";
import { Modal } from "react-bootstrap";
import { useGlobalModalContext } from "providers/GlobalModalProvider";
import { useSetPhantom } from "wallets/Phantom";
import { MdOutlineClose } from "react-icons/md";
import PhantomIcon from "assets/icons/wallets/phantom.svg";
import "./index.css";

export default function ConnectModal() {
  const { hideModal } = useGlobalModalContext();
  const { connect } = useSetPhantom();

  const handleConnectPhantom = () => {
    connect();
    hideModal();
  };

  return (
    <Modal className="connect-modal" centered show={true} onHide={hideModal}>
      <Modal.Header>
        <div className="flex flex-col relative w-full items-center">
          <button className="close-button" onClick={hideModal}>
            <MdOutlineClose size={24} />
          </button>
          <img src="/favicon.ico" alt="logo" width={80} className="mt-4 mb-2" />
          <h1 className="text-3xl font-semibold mb-2">Connect Wallet</h1>
        </div>
      </Modal.Header>
      <Modal.Body>
        <button
          className="wallet-adapter-button"
          onClick={handleConnectPhantom}
        >
          Phantom
          <i className="end-icon">
            <img src={PhantomIcon} alt="phantom-icon" />
          </i>
        </button>
      </Modal.Body>
    </Modal>
  );
}
