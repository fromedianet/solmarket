import { useEffect, useState } from "react";
import { useGetter } from "store/accessors";
import { Wallets } from "services/wallet/types";

export default function WalletSuite() {
  const [connectorsShown, showConnectors] = useState(false);
  const { activeWallet, isLoading } = useGetter((state) => state.wallet);
  const isConnected = activeWallet !== Wallets.none;
  const toggleConnector = () => showConnectors((p) => !p);
  const hideConnectors = () => showConnectors(false);

  // close modal after connecting
  useEffect(() => {
    isConnected && showConnectors(false);
    //eslint-disable-next-line
  }, [isConnected]);

  return (
    <div className="flex border-1 border-purple-700 hover:bg-purple-700 rounded-md ml-auto">
      {!isConnected && (
        <button
          className="flex py-2 px-3 items-center text-white  "
          disabled={isLoading}
          onClick={toggleConnector}
        >
          <span>{isLoading ? "Loading" : "Connect"}</span>
        </button>
      )}
    </div>
  );
}
