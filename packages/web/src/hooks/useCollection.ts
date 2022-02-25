import { Metadata, ParsedAccount, useMeta } from '@oyster/common';

export enum CollectionState {
  All = '0',
  Popular = '1',
  New = '2',
}

export const useCollection = (): ParsedAccount<Metadata>[] => {
  const { metadata } = useMeta();
  const collections: ParsedAccount<Metadata>[] = [];
  metadata.forEach(item => {
    if (!item.info.collection) {
      collections.push(item);
    }
  });
  return collections;
};
