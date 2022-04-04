import {
  AUCTION_HOUSE_ID,
  getMetadata,
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

export async function sendSell(params: {
  connection: Connection;
  seller: string;
  wallet: WalletSigner;
  buyerPrice: number;
  mint: string;
}) {
  const { connection, seller, wallet, buyerPrice, mint } = params;
  const {
    createExecuteSaleInstruction,
    createPrintPurchaseReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };

  try {
    const buyerKey = wallet.publicKey!;
    const sellerKey = new PublicKey(seller);
    const metadata = await getMetadata(mint);
    const tokenAccount = (await getAtaForMint(toPublicKey(mint), sellerKey))[0];
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );
    const mintKey = new PublicKey(mint);
    const buyerTradeState = (
      await AuctionHouseProgram.findTradeStateAddress(
        buyerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        mintKey,
        buyerPrice,
        1,
      )
    )[0];

    const sellerTradeState = (
      await AuctionHouseProgram.findTradeStateAddress(
        sellerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        mintKey,
        buyerPrice,
        1,
      )
    )[0];

    const [freeTradeState, freeTradeStateBump] =
      await AuctionHouseProgram.findTradeStateAddress(
        sellerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        mintKey,
        0,
        1,
      );

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(
        AUCTION_HOUSE_ID,
        buyerKey,
      );

    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const instruction = createExecuteSaleInstruction(
      {
        buyer: buyerKey,
        seller: sellerKey,
        tokenAccount: tokenAccount,
        tokenMint: mintKey,
        metadata: new PublicKey(metadata),
        treasuryMint: auctionHouseObj.treasuryMint,
        escrowPaymentAccount: escrowPaymentAccount,
        sellerPaymentReceiptAccount: sellerKey,
        buyerReceiptTokenAccount: (await getAtaForMint(mintKey, buyerKey))[0],
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        auctionHouseTreasury: auctionHouseObj.auctionHouseTreasury,
        sellerTradeState: sellerTradeState,
        buyerTradeState: buyerTradeState,
        freeTradeState: freeTradeState,
        programAsSigner: programAsSigner,
      },
      {
        escrowPaymentBump,
        freeTradeStateBump,
        programAsSignerBump,
        buyerPrice,
        tokenSize: 1,
      },
    );

    const [purchaseReceipt, purchaseReceiptBump] =
      await AuctionHouseProgram.findPurchaseReceiptAddress(
        sellerTradeState,
        buyerTradeState,
      );
    const [listingReceipt] =
      await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);
    const [bidReceipt] = await AuctionHouseProgram.findBidReceiptAddress(
      buyerTradeState,
    );
    const purchaseReceiptInstruction = createPrintPurchaseReceiptInstruction(
      {
        purchaseReceipt: purchaseReceipt,
        listingReceipt: listingReceipt,
        bidReceipt: bidReceipt,
        bookkeeper: buyerKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        purchaseReceiptBump,
      },
    );

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [instruction, purchaseReceiptInstruction],
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
