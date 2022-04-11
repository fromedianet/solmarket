import {
  AUCTION_HOUSE_ID,
  sendTransactionWithRetry,
  WalletSigner,
} from '@oyster/common';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { NFT } from '../../models/exCollection';
import { BN } from 'bn.js';

export async function sendCancelList(params: {
  connection: Connection;
  wallet: WalletSigner;
  nft: NFT;
}) {
  const { connection, wallet, nft } = params;
  const { createCancelInstruction, createCancelListingReceiptInstruction } =
    AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };
  const pubkey = wallet.publicKey;
  if (!pubkey || !nft) {
    return status;
  }

  try {
    const mintKey = new PublicKey(nft.mint);
    const buyerPrice = new BN(nft.price * LAMPORTS_PER_SOL);
    const [tokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        mintKey,
        pubkey,
      );
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );
    const [tradeState] = await AuctionHouseProgram.findTradeStateAddress(
      pubkey,
      AUCTION_HOUSE_ID,
      tokenAccount,
      auctionHouseObj.treasuryMint,
      mintKey,
      buyerPrice.toNumber(),
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
  } catch (e) {
    console.error(e);
  }

  return status;
}
