import {
  AUCTION_HOUSE_ID,
  getMetadata,
  sendTransactionWithRetry,
  WalletSigner,
} from '@oyster/common';
import {
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { NFT } from '../../models/exCollection';

export async function sendSell(params: {
  connection: Connection;
  wallet: WalletSigner;
  buyerPrice: number;
  nft: NFT;
}) {
  const { connection, wallet, buyerPrice, nft } = params;
  const {
    createBuyInstruction,
    createPrintBidReceiptInstruction,
    createExecuteSaleInstruction,
    createPrintPurchaseReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };
  const buyerKey = wallet.publicKey;
  if (!buyerKey || !nft || buyerPrice === 0) {
    return status;
  }

  try {
    const sellerKey = new PublicKey(nft.owner);
    const mintKey = new PublicKey(nft.mint);
    const metadata = await getMetadata(nft.mint);
    const [tokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        mintKey,
        sellerKey,
      );
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

    const [buyerReceiptTokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        mintKey,
        buyerKey,
      );

    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const buyInstruction = createBuyInstruction(
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

    const executeSaleInstruction = createExecuteSaleInstruction(
      {
        buyer: buyerKey,
        seller: sellerKey,
        tokenAccount: tokenAccount,
        tokenMint: mintKey,
        metadata: new PublicKey(metadata),
        treasuryMint: auctionHouseObj.treasuryMint,
        escrowPaymentAccount: escrowPaymentAccount,
        sellerPaymentReceiptAccount: sellerKey,
        buyerReceiptTokenAccount: buyerReceiptTokenAccount,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        auctionHouseTreasury: auctionHouseObj.auctionHouseTreasury,
        buyerTradeState: buyerTradeState,
        sellerTradeState: sellerTradeState,
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

    const creatorKeys = nft.creators.map(creator => ({
      pubkey: new PublicKey(creator.address),
      isSigner: false,
      isWritable: true,
    }));

    const executeSaleInstructionEx = new TransactionInstruction({
      programId: AuctionHouseProgram.PUBKEY,
      data: executeSaleInstruction.data,
      keys: executeSaleInstruction.keys.concat(creatorKeys),
    });

    const [purchaseReceipt, purchaseReceiptBump] =
      await AuctionHouseProgram.findPurchaseReceiptAddress(
        sellerTradeState,
        buyerTradeState,
      );
    const [listingReceipt] =
      await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);

    const [bidReceipt, bidReceiptBump] =
      await AuctionHouseProgram.findBidReceiptAddress(buyerTradeState);

    const bidReceiptInstruction = createPrintBidReceiptInstruction(
      {
        receipt: bidReceipt,
        bookkeeper: buyerKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump: bidReceiptBump,
      },
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
      [
        buyInstruction,
        bidReceiptInstruction,
        executeSaleInstructionEx,
        purchaseReceiptInstruction,
      ],
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
