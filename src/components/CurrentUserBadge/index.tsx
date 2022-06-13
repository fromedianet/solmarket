import React, { useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button, Popover } from "antd";
import { TokenCircle } from "../TokenCircle";
import { useAuthToken } from "../../contexts/authProvider";
import { useAuthAPI } from "../../hooks/useAuthAPI";
import { formatNumber, shortenAddress } from "../../utils/utils";
import { Settings } from "../Settings";
import { useNativeAccount } from "../../contexts";

const btnStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  marginTop: "8px",
};

const UserActions = (props: { onClick?: any }) => {
  const { authToken } = useAuthToken();
  const { authentication } = useAuthAPI();
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {authToken ? (
        <>
          <a onClick={() => router.push(`/profile`)}>
            <Button
              onClick={() => {
                props.onClick ? props.onClick() : null;
              }}
              style={btnStyle}
            >
              Sell
            </Button>
          </a>
        </>
      ) : (
        <Button onClick={async () => await authentication()} style={btnStyle}>
          Sign in
        </Button>
      )}
    </div>
  );
};

export const CurrentUserBadge = (props: {
  showBalance?: boolean;
  showAddress?: boolean;
  iconSize?: number;
}) => {
  const { wallet, publicKey, disconnect } = useWallet();
  const { removeAuthToken } = useAuthToken();
  const { account } = useNativeAccount();
  const [show, setShow] = useState(false);
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  if (!wallet || !publicKey) {
    return null;
  }

  let name = props.showAddress ? shortenAddress(`${publicKey}`) : "";
  const unknownWallet = wallet as any;
  if (unknownWallet.name && !props.showAddress) {
    name = unknownWallet.name;
  }

  const handleDisconnect = () => {
    setShow(false);
    disconnect();
    removeAuthToken();
  };

  return (
    <div className="wallet-container">
      {props.showBalance && (
        <span>
          {formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)} SOL
        </span>
      )}

      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <Settings
            additionalSettings={
              <div className="modal-container">
                <h5>BALANCE</h5>
                <div
                  style={{
                    display: "flex",
                    marginBottom: 10,
                  }}
                >
                  <TokenCircle iconSize={24} iconFile="/icons/sol.png" />
                  &nbsp;
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    {formatNumber.format(balance)} SOL
                  </span>
                  &nbsp;
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: 10,
                  }}
                >
                  <Button onClick={handleDisconnect} style={btnStyle}>
                    Disconnect
                  </Button>
                </div>
                <UserActions onClick={() => setShow(false)} />
              </div>
            }
          />
        }
        visible={show}
        onVisibleChange={() => setShow((prev) => !prev)}
      >
        <Button>{name}</Button>
      </Popover>
    </div>
  );
};
