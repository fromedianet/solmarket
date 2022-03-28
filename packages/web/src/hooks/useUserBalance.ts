import {
  fromLamports,
  StringPublicKey,
  useMint,
  useUserAccounts,
} from '@oyster/common';
import { useMemo } from 'react';

export function useUserBalance(
  mintAddress?: StringPublicKey,
  account?: StringPublicKey,
) {
  const mint = useMemo(
    () => (typeof mintAddress === 'string' ? mintAddress : mintAddress),
    [mintAddress],
  );
  const { userAccounts } = useUserAccounts();

  const mintInfo = useMint(mint);
  const accounts = useMemo(() => {
    return userAccounts
      .filter(
        acc =>
          mint === acc.info.mint.toBase58() &&
          (!account || account === acc.pubkey),
      )
      .sort((a, b) => b.info.amount.sub(a.info.amount).toNumber());
  }, [userAccounts, mint, account]);

  const balanceLamports = useMemo(() => {
    return accounts.reduce(
      // TODO: Edge-case: If a number is too big (more than 10Mil) and the decimals
      //    for the token are > 8, the lamports.toNumber() crashes, as it is more then 53 bits.
      (res, item) => (res += item.info.amount.toNumber()),
      0,
    );
  }, [accounts]);

  const balance = useMemo(
    () => fromLamports(balanceLamports, mintInfo),
    [mintInfo, balanceLamports],
  );

  return {
    balance,
    balanceLamports,
    accounts,
    hasBalance: accounts.length > 0 && balance > 0,
  };
}
