import ConnectModal from "components/Modal/ConnectModal";
import DisconnectModal from "components/Modal/DisconnectModal";
import React, { createContext, useContext, useState } from "react";

export const MODAL_TYPES = {
  CONNECT_MODAL: "CONNECT_MODAL",
  DISCONNECT_MODAL: "DISCONNECT_MODAL",
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.CONNECT_MODAL]: ConnectModal,
  [MODAL_TYPES.DISCONNECT_MODAL]: DisconnectModal,
};

type ModalStore = {
  modalType: string;
  modalProps?: any;
};

type ModalContext = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: ModalStore;
};

const initialState: ModalContext = {
  showModal: () => {},
  hideModal: () => {},
  store: { modalType: "" },
};

const GlobalModalContext = createContext(initialState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<{}> = ({ children }) => {
  const [store, setStore] = useState<ModalStore>({
    modalType: "",
    modalProps: {},
  });
  const { modalType, modalProps } = store;

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: "",
      modalProps: {},
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
