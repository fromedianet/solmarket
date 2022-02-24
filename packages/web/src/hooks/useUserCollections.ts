import {
  Metadata,
  ParsedAccount,
  useUserAccounts,
} from '@oyster/common';
import { useMeta } from './../contexts';

export const useUserCollections = (): ParsedAccount<Metadata>[] => {
  const { metadata } = useMeta();
  const { accountByMint } = useUserAccounts();

  const ownedMetadata = metadata.filter(
    m =>
      !m.info.collection &&
      accountByMint.has(m.info.mint) &&
      (accountByMint?.get(m.info.mint)?.info?.amount?.toNumber() || 0) > 0,
  );

  return ownedMetadata;
};
