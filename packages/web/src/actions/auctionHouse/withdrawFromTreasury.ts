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

export async function withdrawFromTreasury(params: {
  connection: Connection;
  wallet: WalletSigner;
  amount: number;
}) {
  const { connection, wallet, amount } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const {
    createWithdrawFromTreasuryInstruction,
  } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  const pubkey = wallet.publicKey;
  if (!pubkey || !amount) {
    return status;
  }

  try {
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );

    const withdrawInstruction = createWithdrawFromTreasuryInstruction(
      {
        treasuryMint: auctionHouseObj.treasuryMint,
        authority: auctionHouseObj.authority,
        treasuryWithdrawalDestination:
          auctionHouseObj.treasuryWithdrawalDestination,
        auctionHouseTreasury: auctionHouseObj.auctionHouseTreasury,
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
      console.log('>>> WithdrawFromTreasury status >>>', status);
    }
  } catch (e) {
    console.error(e);
  }

  return status;
}
