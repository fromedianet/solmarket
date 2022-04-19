import { sendTransactionWithRetry, WalletSigner } from "@oyster/common";
import { Connection, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";

export async function buyNowME(params: {
  connection: Connection,
  wallet: WalletSigner,
  data: Buffer
}) {
  const { connection, wallet, data } = params;

  let status: any = { err: true };
  if (!wallet.publicKey) {
    return status;
  }

  try {
    const transaction = Transaction.from(data);
    console.log(transaction.instructions.keys);
    
    // const {txid} = await sendTransactionWithRetry(
    //   connection,
    //   wallet,
    //   transaction.instructions,
    //   [],
    // );
    // console.log(txid);

    // if (txid) {
    //   status = await connection.confirmTransaction(txid, 'confirmed');
    //   console.log('>>> txid >>>', txid);
    //   console.log('>>> buyNow status >>>', status);
    // }
  } catch (e) {
    console.error('------- buyNowME error ------------', e);
  }

  return status;
}

