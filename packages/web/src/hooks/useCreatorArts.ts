import { useMeta } from '../contexts';
import { Metadata, ParsedAccount, StringPublicKey } from '@oyster/common';
import { useAuctions } from './useAuctions';

export const useCreatorArts = (id?: StringPublicKey) => {
  const { metadata } = useMeta();
  const auctions = useAuctions();
  const arts = metadata.filter(
    m => m.info.data.creators?.some(c => c.address === id) && m.info.collection,
  );

  const listedArts: ParsedAccount<Metadata>[] = [];
  arts.forEach(item => {
    if (
      auctions.findIndex(ac => ac.thumbnail.metadata.pubkey === item.pubkey) >
      -1
    ) {
      listedArts.push(item);
    }
  });

  return { arts, listedArts };
};
