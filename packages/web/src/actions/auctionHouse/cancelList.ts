import {
  AUCTION_HOUSE_ID,
  sendTransactionWithRetry,
  toPublicKey,
  WalletSigner,
} from '@oyster/common';
import {
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { getAtaForMint } from '../../views/launchpadDetail/utils';

export async function sendCancelList(params: {
  connection: Connection;
  wallet: WalletSigner;
  buyerPrice: number;
  mint: string;
}) {
  const { connection, wallet, buyerPrice, mint } = params;
  const { createCancelInstruction, createCancelListingReceiptInstruction } =
    AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };
  const pubkey = wallet.publicKey;
  if (!pubkey || !mint || buyerPrice === 0) {
    return { status };
  }

  try {
    const tokenAccount = (await getAtaForMint(toPublicKey(mint), pubkey))[0];
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );
    const mintKey = new PublicKey(mint);
    const [tradeState] = await AuctionHouseProgram.findTradeStateAddress(
      pubkey,
      AUCTION_HOUSE_ID,
      tokenAccount,
      auctionHouseObj.treasuryMint,
      mintKey,
      buyerPrice,
      1,
    );

    const instruction = createCancelInstruction(
      {
        wallet: pubkey,
        tokenAccount,
        tokenMint: mintKey,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        tradeState: tradeState,
      },
      {
        buyerPrice,
        tokenSize: 1,
      },
    );

    const [receipt] = await AuctionHouseProgram.findListingReceiptAddress(
      tradeState,
    );
    const cancelReceiptInstruction = createCancelListingReceiptInstruction({
      receipt: receipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    });

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [instruction, cancelReceiptInstruction],
      [],
    );

    if (txid) {
      status = await connection.confirmTransaction(txid, 'confirmed');
      console.log('>>> txid >>>', txid);
      console.log('>>> status >>>', status);
    }
    return { status, txid };
  } catch (e) {
    console.error(e);
  }

  return { status };
}
