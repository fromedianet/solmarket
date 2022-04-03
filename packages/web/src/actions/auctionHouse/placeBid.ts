import {
  AUCTION_HOUSE_ID,
  getMetadata,
  sendTransactionWithRetry,
  WalletSigner,
} from '@oyster/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';

export async function sendPlaceBid(params: {
  connection: Connection,
  wallet: WalletSigner,
  buyerPrice: number,
  mint: string,
}) {
  const { connection, wallet, buyerPrice, mint } = params;
  const { createBuyInstruction } = AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };

  try {
    const buyerKey = wallet.publicKey!;
    const metadata = await getMetadata(mint);
    const mintKey = new PublicKey(mint);
    const results = await connection.getTokenLargestAccounts(mintKey)
    const tokenAccount = results.value[0].address;
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );
    
    const [buyerTradeState, tradeStateBump] =
      await AuctionHouseProgram.findTradeStateAddress(
        buyerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        mintKey,
        buyerPrice,
        1,
      );

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(
        AUCTION_HOUSE_ID,
        buyerKey,
      );

    const instruction = createBuyInstruction(
      {
        wallet: buyerKey,
        paymentAccount: buyerKey,
        transferAuthority: buyerKey,
        treasuryMint: auctionHouseObj.treasuryMint,
        tokenAccount: tokenAccount,
        metadata: new PublicKey(metadata),
        escrowPaymentAccount: escrowPaymentAccount,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        buyerTradeState: buyerTradeState,
      },
      {
        tradeStateBump,
        escrowPaymentBump,
        buyerPrice,
        tokenSize: 1,
      },
    );

    instruction.keys
      .filter(k => k.pubkey.equals(buyerKey))
      .map(k => (k.isSigner = true));

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [instruction],
      [],
      'max',
    );

    if (txid) {
      status = await connection.confirmTransaction(txid, 'max');
      console.log('>>> txid >>>', txid);
      console.log('>>> status >>>', status);
    }
    return { status, txid };
  } catch (e) {
    console.error(e);
  }

  return { status };
}
