import { AUCTION_HOUSE_ID, getMetadata, sendTransactionWithRetry, toPublicKey, WalletSigner } from "@oyster/common";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { getAtaForMint } from "../../views/launchpadDetail/utils";

export async function sendListing(
  connection: Connection,
  wallet: WalletSigner,
  price: number,
  mint: string,
) {
  const { createSellInstruction } = AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };

  try {
    const metadata = await getMetadata(mint);
    const tokenAccount = (await getAtaForMint(toPublicKey(mint), wallet.publicKey!))[0];
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(connection, AUCTION_HOUSE_ID);
    const buyerPrice = price * LAMPORTS_PER_SOL;
    const mintKey = new PublicKey(mint);
    const [tradeState, tradeStateBump] = await AuctionHouseProgram.findTradeStateAddress(
      wallet.publicKey!,
      AUCTION_HOUSE_ID,
      tokenAccount,
      auctionHouseObj.treasuryMint,
      mintKey,
      buyerPrice,
      1
    );
    const [freeTradeState, freeTradeStateBump] = await AuctionHouseProgram.findTradeStateAddress(
      wallet.publicKey!,
      AUCTION_HOUSE_ID,
      tokenAccount,
      auctionHouseObj.treasuryMint,
      mintKey,
      0,
      1
    );
    const [programAsSigner, programAsSignerBump] = await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const instruction = createSellInstruction(
      {
        wallet: wallet.publicKey!,
        tokenAccount,
        metadata: new PublicKey(metadata),
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        sellerTradeState: tradeState,
        freeSellerTradeState: freeTradeState,
        programAsSigner
      },
      {
        tradeStateBump,
        freeTradeStateBump,
        programAsSignerBump,
        buyerPrice,
        tokenSize: 1,
      }
    );

    instruction.keys
      .filter(k => k.pubkey.equals(wallet.publicKey!))
      .map(k => (k.isSigner = true));

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [instruction],
      [],
      'max'
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
  
  return {status};
}
