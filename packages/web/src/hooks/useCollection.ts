import { Metadata, ParsedAccount, useMeta } from '@oyster/common';

export const useCollection = (): ParsedAccount<Metadata>[] => {
  const { metadata } = useMeta();
  const collections: ParsedAccount<Metadata>[] = [];
  const symbols: string[] = [];
  metadata.forEach(item => {
    if (!symbols.includes(item.info.data.symbol)) {
      collections.push(item);
      symbols.push(item.info.data.symbol);
    }
  });
  return collections;
};
