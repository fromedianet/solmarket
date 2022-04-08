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
} from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { NFT } from '../../models/exCollection';

export async function sendPlaceBid(params: {
  connection: Connection;
  wallet: WalletSigner;
  buyerPrice: number;
  nft: NFT;
}) {
  const { connection, wallet, buyerPrice, nft } = params;
  const {
    createDepositInstruction,
    createBuyInstruction,
    createPrintBidReceiptInstruction,
  } = AuctionHouseProgram.instructions;
  const { AuctionHouse } = AuctionHouseProgram.accounts;
  let status: any = { err: true };
  const buyerKey = wallet.publicKey;
  if (!buyerKey || !nft || buyerPrice === 0) {
    return status;
  }

  try {
    const metadata = await getMetadata(nft.mint);
    const mintKey = new PublicKey(nft.mint);
    const [tokenAccount] =
      await AuctionHouseProgram.findAssociatedTokenAccountAddress(
        mintKey,
        new PublicKey(nft.owner),
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

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(
        AUCTION_HOUSE_ID,
        buyerKey,
      );

    const depositInstruction = createDepositInstruction(
      {
        wallet: buyerKey,
        paymentAccount: buyerKey,
        transferAuthority: buyerKey,
        treasuryMint: auctionHouseObj.treasuryMint,
        escrowPaymentAccount: escrowPaymentAccount,
        authority: auctionHouseObj.authority,
        auctionHouse: AUCTION_HOUSE_ID,
        auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
      },
      {
        escrowPaymentBump,
        amount: buyerPrice,
      },
    );

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

    const [receipt, receiptBump] =
      await AuctionHouseProgram.findBidReceiptAddress(buyerTradeState);
    const printBidReceiptInstruction = createPrintBidReceiptInstruction(
      {
        receipt: receipt,
        bookkeeper: buyerKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump,
      },
    );

    const { txid } = await sendTransactionWithRetry(
      connection,
      wallet,
      [depositInstruction, buyInstruction, printBidReceiptInstruction],
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
