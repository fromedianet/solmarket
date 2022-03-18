import React from 'react';
import { Card, CardProps, Statistic } from 'antd';
import { ArtContent } from '../ArtContent';
import {
  AuctionView,
  AuctionViewState,
  useArt,
  useCreators,
} from '../../hooks';

import { useAuctionStatus } from './hooks/useAuctionStatus';
import { Link } from 'react-router-dom';
import { CountdownState, formatAmount, shortenAddress } from '@oyster/common';
import { TokenCircle } from '../Custom';
import { useAuctionCountdown } from '../../hooks/useAuctionCountdown';

export interface AuctionCard extends CardProps {
  auctionView: AuctionView;
  itemId?: string;
  className?: string;
}

const isNotSet = (state?: CountdownState) =>
  state?.days === 0 &&
  state?.hours === 0 &&
  state?.minutes === 0 &&
  state?.seconds === 0;

export const AuctionRenderCard = (props: AuctionCard) => {
  const { auctionView } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const creators = useCreators(auctionView);
  const name = art?.title || ' ';

  const { amount, status } = useAuctionStatus(auctionView);

  const _amount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formattedAmount = formatAmount(_amount);

  const state = useAuctionCountdown(auctionView);
  const ended =
    auctionView.state === AuctionViewState.Ended ||
    auctionView.state === AuctionViewState.BuyNow;
  const countdown =
    state && !ended
      ? isNotSet(state)
        ? 'N/A'
        : state?.days > 0
        ? `${state?.days}d ${state?.hours}h ${state?.minutes}m`
        : `${state?.hours}h ${state?.minutes}m ${state?.seconds}s`
      : 'ENDED';

  const card = (
    <Card
      hoverable={true}
      className={`auction-render-card ${props.className && props.className}`}
      bordered={false}
    >
      <Link
        key={auctionView.auction.pubkey}
        to={`/auction/${auctionView.auction.pubkey}`}
      >
        <div className="image-over auction-card">
          <ArtContent
            className="auction-image no-events"
            preview={false}
            pubkey={id}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <div className="card-body">
            <h5>{name}</h5>
            <div className="card-creator">
              <span>
                {creators[0]?.name ||
                  shortenAddress(creators[0]?.address || '')}
              </span>
              <img src="/icons/check-circle.svg" alt="check-circle" />
            </div>
          </div>
          <div className="card-bid">
            <Statistic
              className="bid-statistic"
              title={status}
              value={`${formattedAmount} SOL`}
              prefix={
                <TokenCircle
                  iconSize={20}
                  iconFile='sol.png'
                />
              }
            />
            {!auctionView.isInstantSale && (
              <Statistic
                className="bid-statistic tw-text-right"
                title="ENDDING IN"
                value={countdown}
              />
            )}
          </div>
        </div>
      </Link>
    </Card>
  );

  return card;
};
