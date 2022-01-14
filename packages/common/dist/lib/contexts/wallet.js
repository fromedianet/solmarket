"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProvider = exports.WalletModalProvider = exports.WalletModal = exports.useWalletModal = exports.WalletModalContext = void 0;
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_wallets_1 = require("@solana/wallet-adapter-wallets");
const antd_1 = require("antd");
const react_1 = __importStar(require("react"));
const utils_1 = require("../utils");
const components_1 = require("../components");
const { Panel } = antd_1.Collapse;
exports.WalletModalContext = (0, react_1.createContext)({});
function useWalletModal() {
    return (0, react_1.useContext)(exports.WalletModalContext);
}
exports.useWalletModal = useWalletModal;
const WalletModal = () => {
    const { wallets, select } = (0, wallet_adapter_react_1.useWallet)();
    const { visible, setVisible } = useWalletModal();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showWallets, setShowWallets] = (0, react_1.useState)(false);
    const close = (0, react_1.useCallback)(() => {
        setVisible(false);
        setShowWallets(false);
    }, [setVisible, setShowWallets]);
    const phantomWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getPhantomWallet)(), []);
    const slopeWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getSlopeWallet)(), []);
    const solletWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getSolletWallet)(), []);
    const solflareWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getSolflareWallet)(), []);
    const ledgerWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getLedgerWallet)(), []);
    const solongWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getSolongWallet)(), []);
    const mathWallet = (0, react_1.useMemo)(() => (0, wallet_adapter_wallets_1.getMathWallet)(), []);
    const handleConnectWallet = (name) => {
        console.log("wallet name", name);
        select(name);
        close();
    };
    return (react_1.default.createElement(components_1.MetaplexModal, { visible: visible, onCancel: close },
        react_1.default.createElement("div", { className: "modal-top-content" },
            react_1.default.createElement("img", { src: "/favicon.ico", alt: "logo", className: "logo" }),
            react_1.default.createElement("p", { className: "text" }, "Connect Wallet")),
        react_1.default.createElement("div", { className: "modal-btn-container" },
            react_1.default.createElement(antd_1.Button, { className: "wallet-adapter-btn", onClick: () => handleConnectWallet(phantomWallet.name) },
                "Phantom",
                react_1.default.createElement("img", { src: phantomWallet === null || phantomWallet === void 0 ? void 0 : phantomWallet.icon, className: "end-icon" })),
            react_1.default.createElement(antd_1.Collapse, { className: "modal-collapse", expandIconPosition: "right" },
                react_1.default.createElement(Panel, { header: "Other Wallets", key: "1" }, wallets.map((wallet, index) => {
                    if (wallet.name === 'Phantom')
                        return null;
                    return (react_1.default.createElement(antd_1.Button, { key: index, className: "wallet-adapter-btn", onClick: () => handleConnectWallet(wallet.name) },
                        wallet.name,
                        react_1.default.createElement("img", { src: wallet === null || wallet === void 0 ? void 0 : wallet.icon, className: "end-icon" })));
                }))))));
};
exports.WalletModal = WalletModal;
const WalletModalProvider = ({ children, }) => {
    const { publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const [connected, setConnected] = (0, react_1.useState)(!!publicKey);
    const [visible, setVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (publicKey) {
            const base58 = publicKey.toBase58();
            const keyToDisplay = base58.length > 20
                ? `${base58.substring(0, 7)}.....${base58.substring(base58.length - 7, base58.length)}`
                : base58;
            (0, utils_1.notify)({
                message: 'Wallet update',
                description: 'Connected to wallet ' + keyToDisplay,
            });
        }
    }, [publicKey]);
    (0, react_1.useEffect)(() => {
        if (!publicKey && connected) {
            (0, utils_1.notify)({
                message: 'Wallet update',
                description: 'Disconnected from wallet',
            });
        }
        setConnected(!!publicKey);
    }, [publicKey, connected, setConnected]);
    return (react_1.default.createElement(exports.WalletModalContext.Provider, { value: {
            visible,
            setVisible,
        } },
        children,
        react_1.default.createElement(exports.WalletModal, null)));
};
exports.WalletModalProvider = WalletModalProvider;
const WalletProvider = ({ children }) => {
    const wallets = (0, react_1.useMemo)(() => [
        (0, wallet_adapter_wallets_1.getPhantomWallet)(),
        (0, wallet_adapter_wallets_1.getSolflareWallet)(),
        (0, wallet_adapter_wallets_1.getSlopeWallet)(),
        // getTorusWallet({
        //   options: {
        //     // @FIXME: this should be changed for Metaplex, and by each Metaplex storefront
        //     clientId:
        //       'BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ',
        //   },
        // }),
        (0, wallet_adapter_wallets_1.getLedgerWallet)(),
        (0, wallet_adapter_wallets_1.getSolongWallet)(),
        (0, wallet_adapter_wallets_1.getMathWallet)(),
        (0, wallet_adapter_wallets_1.getSolletWallet)(),
    ], []);
    const onError = (0, react_1.useCallback)((error) => {
        console.error(error);
        (0, utils_1.notify)({
            message: 'Wallet error',
            description: error.message,
        });
    }, []);
    return (react_1.default.createElement(wallet_adapter_react_1.WalletProvider, { wallets: wallets, onError: onError, autoConnect: true },
        react_1.default.createElement(exports.WalletModalProvider, null, children)));
};
exports.WalletProvider = WalletProvider;
//# sourceMappingURL=wallet.js.map