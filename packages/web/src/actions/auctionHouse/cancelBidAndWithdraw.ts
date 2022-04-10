import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
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
import { BN } from 'bn.js';
import { Offer } from '../../models/offer';

export async function cancelBidAndWithdraw(params: {
  connection: Connection;
  wallet: WalletSigner;
  offer: Offer;
}) {
  const { connection, wallet, offer } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const {
    createWithdrawInstruction,
    createCancelInstruction,
    createCancelBidReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  const pubkey = wallet.publicKey;
  if (!pubkey || !offer) {
    return status;
  }

  try {
    const buyerPrice = new BN(offer.bidPrice * LAMPORTS_PER_SOL);
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(
        AUCTION_HOUSE_ID,
        pubkey,
      );

    const withdrawInstruction = createWithdrawInstruction(
      {
        wallet: pubkey,
        receiptAccount: pubkey,
        escrowPaymentAccount: escrowPaymentAccount,
        treasuryMint: auctionHouseObj.treasuryMint,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
      },
      {
        escrowPaymentBump,
        amount: buyerPrice,
      },
    );

    const cancelInstruction = createCancelInstruction(
      {
        wallet: pubkey,
        tokenAccount: new PublicKey(offer.tokenAccount),
        tokenMint: new PublicKey(offer.mint),
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        tradeState: new PublicKey(offer.tradeState),
      },
      {
        buyerPrice: new BN(offer.bidPrice * LAMPORTS_PER_SOL),
        tokenSize: offer.tokenSize,
      },
    );

    const [receipt] = await AuctionHouseProgram.findBidReceiptAddress(
      new PublicKey(offer.tradeState),
    );
    const cancelBidReceiptInstruction = createCancelBidReceiptInstruction({
      receipt: receipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    });

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [withdrawInstruction, cancelInstruction, cancelBidReceiptInstruction],
      [],
    );

    if (txid) {
      status = await connection.confirmTransaction(txid, 'confirmed');
      console.log('>>> txid >>>', txid);
      console.log('>>> WithdrawFromFee status >>>', status);
    }
  } catch (e) {
    console.error(e);
  }

  return status;
}
