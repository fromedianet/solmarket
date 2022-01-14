import { GlobalModal } from "providers/GlobalModalProvider";
import React from "react";
import Phantom from "wallets/Phantom";
import Router from "./Router";

export default function App() {
  return (
    <Phantom>
      <GlobalModal>
        <Router />
      </GlobalModal>
    </Phantom>
  );
}
