import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import {
  AUCTION_HOUSE_ID,
  sendTransactionWithRetry,
  WalletSigner,
} from '@oyster/common';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from 'bn.js';

export async function deposit(params: {
  connection: Connection;
  wallet: WalletSigner;
  amount: number;
}) {
  const { connection, wallet, amount } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const { createDepositInstruction } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  const pubkey = wallet.publicKey;
  if (!pubkey || amount === 0) {
    return status;
  }

  try {
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(
        AUCTION_HOUSE_ID,
        pubkey,
      );

    const instruction = createDepositInstruction(
      {
        wallet: pubkey,
        paymentAccount: pubkey,
        transferAuthority: pubkey,
        escrowPaymentAccount: escrowPaymentAccount,
        treasuryMint: auctionHouseObj.treasuryMint,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
      },
      {
        escrowPaymentBump,
        amount: new BN(amount * LAMPORTS_PER_SOL),
      },
    );

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [instruction],
      [],
    );

    if (txid) {
      status = await connection.confirmTransaction(txid, 'confirmed');
      console.log('>>> txid >>>', txid);
      console.log('>>> Deposit status >>>', status);
    }
  } catch (e) {
    console.error(e);
  }

  return status;
}
