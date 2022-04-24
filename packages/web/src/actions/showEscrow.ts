import { AUCTION_HOUSE_ID, AUCTION_HOUSE_PROGRAM_ID } from '@oyster/common';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export async function showEscrow(
  connection: Connection,
  wallet: PublicKey,
): Promise<number> {
  try {
    const escrow = (
      await PublicKey.findProgramAddress(
        [
          Buffer.from('auction_house'),
          AUCTION_HOUSE_ID.toBuffer(),
          wallet.toBuffer(),
        ],
        AUCTION_HOUSE_PROGRAM_ID,
      )
    )[0];
    const amount = await connection.getBalance(escrow);
    return amount / LAMPORTS_PER_SOL;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
