import { pubkeyToString, TokenAccount, TokenAccountParser, TOKEN_PROGRAM_ID } from '@oyster/common';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';

export const getTokenAccountByMint = async (
  connection: Connection,
  mintAddress: PublicKey,
): Promise<TokenAccount | undefined> => {
  const result = await connection.getTokenLargestAccounts(mintAddress, 'confirmed');
  
  if (result.value && result.value.length > 0) {
    const tokenAddress = result.value[0].address;

    const res1 = await connection.getAccountInfo(tokenAddress, 'confirmed');
    if (res1 && isTokenAccount(res1)) {
      const account = TokenAccountParser(tokenAddress.toBase58(), res1);
      return account;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

const isTokenAccount = (account: AccountInfo<Buffer>) =>
  account && pubkeyToString(account.owner) === TOKEN_PROGRAM_ID.toString();
