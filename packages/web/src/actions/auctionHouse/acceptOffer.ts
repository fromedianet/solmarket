import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import {
  AUCTION_HOUSE_ID,
  getMetadata,
  sendTransactionWithRetry,
  WalletSigner,
} from '@oyster/common';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { BN } from 'bn.js';
import { Offer } from '../../models/offer';

export async function acceptOffer(params: {
  connection: Connection;
  wallet: WalletSigner;
  offer: Offer;
}) {
  const { connection, wallet, offer } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const {
    createSellInstruction,
    createPrintListingReceiptInstruction,
    createCancelInstruction,
    createCancelListingReceiptInstruction,
    createExecuteSaleInstruction,
    createPrintPurchaseReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  const sellerKey = wallet.publicKey;
  if (!sellerKey || !offer) {
    return status;
  }

  try {
    const buyerKey = new PublicKey(offer.buyer);
    const tokenMint = new PublicKey(offer.mint);
    const metadata = await getMetadata(offer.mint);
    const [tokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        tokenMint,
        sellerKey,
      );
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );
    const buyerPrice = new BN(offer.bidPrice * LAMPORTS_PER_SOL);
    const listingPrice = new BN(offer.listingPrice * LAMPORTS_PER_SOL);

    const [sellerTradeState, sellerTradeStateBump] =
      await AuctionHouseProgram.findTradeStateAddress(
        sellerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        tokenMint,
        buyerPrice.toNumber(),
        1,
      );

    const [buyerTradeState] = await AuctionHouseProgram.findTradeStateAddress(
      buyerKey,
      AUCTION_HOUSE_ID,
      tokenAccount,
      auctionHouseObj.treasuryMint,
      tokenMint,
      buyerPrice.toNumber(),
      1,
    );

    const [freeTradeState, freeTradeStateBump] =
      await AuctionHouseProgram.findTradeStateAddress(
        sellerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        tokenMint,
        0,
        1,
      );

    const [buyerReceiptTokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        tokenMint,
        buyerKey,
      );

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(
        AUCTION_HOUSE_ID,
        buyerKey,
      );

    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const listingInstruction = createSellInstruction(
      {
        wallet: sellerKey,
        tokenAccount: tokenAccount,
        metadata: new PublicKey(metadata),
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        sellerTradeState: sellerTradeState,
        freeSellerTradeState: freeTradeState,
        programAsSigner: programAsSigner,
      },
      {
        tradeStateBump: sellerTradeStateBump,
        freeTradeStateBump,
        programAsSignerBump,
        buyerPrice,
        tokenSize: 1,
      },
    );

    const executeSaleInstruction = createExecuteSaleInstruction(
      {
        buyer: buyerKey,
        seller: sellerKey,
        tokenAccount: tokenAccount,
        tokenMint: tokenMint,
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

    const creatorKeys = offer.nftCreators.map(creator => ({
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

    const [listingReceipt, listingReceiptBump] =
      await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);

    const [bidReceipt] = await AuctionHouseProgram.findBidReceiptAddress(
      buyerTradeState,
    );

    const listingReceiptInstruction = createPrintListingReceiptInstruction(
      {
        receipt: listingReceipt,
        bookkeeper: sellerKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump: listingReceiptBump,
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

    const cancelInstruction = createCancelInstruction(
      {
        wallet: sellerKey,
        tokenAccount,
        tokenMint,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        tradeState: new PublicKey(offer.tradeState),
      },
      {
        buyerPrice: listingPrice,
        tokenSize: 1,
      },
    );

    const [cancelTradeStateReceipt] =
      await AuctionHouseProgram.findListingReceiptAddress(
        new PublicKey(offer.tradeState),
      );

    const cancelReceiptInstruction = createCancelListingReceiptInstruction({
      receipt: cancelTradeStateReceipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    });

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [
        listingInstruction,
        listingReceiptInstruction,
        executeSaleInstructionEx,
        purchaseReceiptInstruction,
        cancelInstruction,
        cancelReceiptInstruction,
      ],
      [],
    );

    if (txid) {
      status = await connection.confirmTransaction(txid, 'confirmed');
      console.log('>>> txid >>>', txid);
      console.log('>>> Accept offer status >>>', status);
    }
  } catch (e) {
    console.error(e);
  }

  return status;
}
