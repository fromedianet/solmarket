import { useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { AuctionView, AuctionViewState, useAuctions } from './useAuctions';
import { useMeta } from '@oyster/common';

export const useAuctionsList = (
  activeKey: AuctionViewState,
): { auctions: AuctionView[]; hasResaleAuctions: boolean } => {
  const { publicKey } = useWallet();
  const auctions = useAuctions();
  const { pullAuctionListData, isLoading } = useMeta();

  useEffect(() => {
    if (!auctions.length || isLoading) return;
    for (const auction of auctions) {
      pullAuctionListData(auction.auction.pubkey);
    }
  }, [auctions.length, isLoading]);

  const filteredAuctions = useMemo(() => {
    const filterFn = getFilterFunction(activeKey);

    return auctions.filter(auction => filterFn(auction, publicKey));
  }, [activeKey, auctions, publicKey]);

  const hasResaleAuctions = useMemo(() => {
    return auctions.some(auction => resaleAuctionsFilter(auction));
  }, [auctions]);

  return { auctions: filteredAuctions, hasResaleAuctions };
};

// Check if the auction is primary sale or not
const checkPrimarySale = (auction: AuctionView): boolean =>
  auction.thumbnail.metadata.info.primarySaleHappened;

// Removed resales from live auctions
const liveAuctionsFilter = (auction: AuctionView): boolean =>
  auction.state === AuctionViewState.Live && !checkPrimarySale(auction);

const upcomingAuctionsFilter = (auction: AuctionView): boolean =>
  auction.state === AuctionViewState.Upcoming;

// const participatedAuctionsFilter = (
//   auction: AuctionView,
//   bidderPublicKey?: PublicKey | null,
// ): boolean =>
//   auction.state !== AuctionViewState.Defective &&
//   auction.auction.info.bidState.bids.some(
//     b => b.key == bidderPublicKey?.toBase58(),
//   );

const resaleAuctionsFilter = (auction: AuctionView): boolean =>
  auction.state === AuctionViewState.Live && checkPrimarySale(auction);

const endedAuctionsFilter = ({ state }: AuctionView): boolean =>
  [AuctionViewState.Ended, AuctionViewState.BuyNow].includes(state);

// const ownAuctionsFilter = (
//   auction: AuctionView,
//   bidderPublicKey?: PublicKey | null,
// ): boolean => {
//   return (
//     auction.state === AuctionViewState.Live &&
//     auction.auctionManager.authority === bidderPublicKey?.toBase58()
//   );
// };

const getFilterFunction = (
  activeKey: AuctionViewState,
): ((auction: AuctionView, bidderPublicKey?: PublicKey | null) => boolean) => {
  switch (activeKey) {
    case AuctionViewState.Live:
      return liveAuctionsFilter;
    case AuctionViewState.Upcoming:
      return upcomingAuctionsFilter;
    case AuctionViewState.Ended:
      return endedAuctionsFilter;
    default:
      return liveAuctionsFilter;
  }
};
