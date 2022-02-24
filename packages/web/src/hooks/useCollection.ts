import { Metadata, ParsedAccount, useMeta } from '@oyster/common';

export enum CollectionState {
  All = '0',
  Popular = '1',
  New = '2',
}

export const useCollection = (): ParsedAccount<Metadata>[] => {
  const { metadata } = useMeta();
  const collections: ParsedAccount<Metadata>[] = [];
  const symbols: string[] = [];
  metadata.forEach(item => {
    if (!symbols.includes(item.info.data.symbol) && !item.info.collection) {
      collections.push(item);
      symbols.push(item.info.data.symbol);
    }
  });
  return collections;
};
