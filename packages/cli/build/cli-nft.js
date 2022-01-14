"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const loglevel_1 = __importDefault(require("loglevel"));
const mint_nft_1 = require("./commands/mint-nft");
const accounts_1 = require("./helpers/accounts");
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const various_1 = require("./helpers/various");
commander_1.program.version('0.0.1');
loglevel_1.default.setLevel('info');
programCommand('mint')
    .option('-u, --url <string>', 'metadata url')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
    const { keypair, env, url } = cmd.opts();
    const solConnection = new anchor_1.web3.Connection((0, various_1.getCluster)(env));
    const walletKeyPair = (0, accounts_1.loadWalletKey)(keypair);
    await (0, mint_nft_1.mintNFT)(solConnection, walletKeyPair, url);
});
programCommand('update-metadata')
    .option('-m, --mint <string>', 'base58 mint key')
    .option('-u, --url <string>', 'metadata url')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
    const { keypair, env, mint, url } = cmd.opts();
    const mintKey = new web3_js_1.PublicKey(mint);
    const solConnection = new anchor_1.web3.Connection((0, various_1.getCluster)(env));
    const walletKeyPair = (0, accounts_1.loadWalletKey)(keypair);
    await (0, mint_nft_1.updateMetadata)(mintKey, solConnection, walletKeyPair, url);
});
function programCommand(name) {
    return commander_1.program
        .command(name)
        .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
        .option('-k, --keypair <path>', `Solana wallet location`, '--keypair not provided')
        .option('-l, --log-level <string>', 'log level', setLogLevel);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value, prev) {
    if (value === undefined || value === null) {
        return;
    }
    loglevel_1.default.info('setting the log value to: ' + value);
    loglevel_1.default.setLevel(value);
}
commander_1.program.parse(process.argv);
