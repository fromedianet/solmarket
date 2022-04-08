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

/**
 * CancelBid + withdrawFromFee
 * @param params
 * @returns
 */
export async function withdrawFromFee(params: {
  connection: Connection;
  wallet: WalletSigner;
  offer: Offer;
}) {
  const { connection, wallet, offer } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const {
    createWithdrawFromFeeInstruction,
    createCancelInstruction,
    createCancelBidReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  const pubkey = wallet.publicKey;
  if (!pubkey || !offer) {
    return status;
  }

  try {
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );

    const withdrawInstruction = createWithdrawFromFeeInstruction(
      {
        authority: auctionHouseObj.authority,
        feeWithdrawalDestination: auctionHouseObj.feeWithdrawalDestination,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        auctionHouse: AUCTION_HOUSE_ID,
      },
      {
        amount: new BN(offer.bidPrice * LAMPORTS_PER_SOL),
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

    const cancelBidReceiptInstruction = createCancelBidReceiptInstruction({
      receipt: new PublicKey(offer.buyer),
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
