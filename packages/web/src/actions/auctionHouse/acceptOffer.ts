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

export async function acceptOffer(params: {
  connection: Connection;
  wallet: WalletSigner;
  offer: Offer;
}) {
  const { connection, wallet, offer } = params;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  const {
    createCancelInstruction,
    createCancelListingReceiptInstruction,
    createSellInstruction,
    createPrintListingReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  let status: any = { err: true };
  const sellerKey = wallet.publicKey;
  if (!sellerKey || !offer) {
    return status;
  }

  try {
    const tokenMint = new PublicKey(offer.mint);
    const metadataKey = new PublicKey(offer.metadata);
    const [tokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        tokenMint,
        sellerKey,
      );
    const auctionHouseObj = await AuctionHouse.fromAccountAddress(
      connection,
      AUCTION_HOUSE_ID,
    );
    const bidPrice = new BN(offer.bidPrice * LAMPORTS_PER_SOL);
    const listingPrice = new BN(offer.listingPrice * LAMPORTS_PER_SOL);

    const [cancelTradeState] = await AuctionHouseProgram.findTradeStateAddress(
      sellerKey,
      AUCTION_HOUSE_ID,
      tokenAccount,
      auctionHouseObj.treasuryMint,
      tokenMint,
      listingPrice.toNumber(),
      1,
    );

    const cancelInstruction = createCancelInstruction(
      {
        wallet: sellerKey,
        tokenAccount,
        tokenMint,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        tradeState: cancelTradeState,
      },
      {
        buyerPrice: listingPrice,
        tokenSize: 1,
      },
    );

    const [cancelReceipt] = await AuctionHouseProgram.findListingReceiptAddress(
      cancelTradeState,
    );

    const cancelReceiptInstruction = createCancelListingReceiptInstruction({
      receipt: cancelReceipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    });

    const [sellerTradeState, sellerTradeStateBump] =
      await AuctionHouseProgram.findTradeStateAddress(
        sellerKey,
        AUCTION_HOUSE_ID,
        tokenAccount,
        auctionHouseObj.treasuryMint,
        tokenMint,
        bidPrice.toNumber(),
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

    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const listingInstruction = createSellInstruction(
      {
        wallet: sellerKey,
        tokenAccount,
        metadata: metadataKey,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
        sellerTradeState: sellerTradeState,
        freeSellerTradeState: freeTradeState,
        programAsSigner,
      },
      {
        tradeStateBump: sellerTradeStateBump,
        freeTradeStateBump: freeTradeStateBump,
        programAsSignerBump: programAsSignerBump,
        buyerPrice: bidPrice,
        tokenSize: 1,
      },
    );

    const [listingReceipt, listingReceiptBump] =
      await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);

    const printListingReceiptInstruction = createPrintListingReceiptInstruction(
      {
        receipt: listingReceipt,
        bookkeeper: sellerKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump: listingReceiptBump,
      },
    );

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [
        cancelInstruction,
        cancelReceiptInstruction,
        listingInstruction,
        printListingReceiptInstruction,
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
