import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import {
  AUCTION_HOUSE_ID,
  sendTransactionWithRetry,
  WalletSigner,
} from '@oyster/common';
import {
  Connection,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { BN } from 'bn.js';

/**
 * CancelBid + withdrawFromFee
 * @param params
 * @returns
 */
export async function withdrawFromFee(params: {
  connection: Connection;
  wallet: WalletSigner;
  amount: number;
}) {
  const { connection, wallet, amount } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const {
    createWithdrawFromFeeInstruction,
  } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  if (!wallet.publicKey || amount === 0) {
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
        amount: new BN(amount * LAMPORTS_PER_SOL),
      },
    );

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [withdrawInstruction],
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
