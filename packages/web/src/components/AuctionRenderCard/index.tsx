import React from 'react';
import { Card, CardProps, Statistic } from 'antd';
import { ArtContent } from '../ArtContent';
import { AuctionView, useArt, useCreators } from '../../hooks';

import { useAuctionStatus } from './hooks/useAuctionStatus';
import { useTokenList } from '../../contexts/tokenList';
import { Link } from 'react-router-dom';
import { CountdownState, formatAmount, shortenAddress } from '@oyster/common';
import { TokenCircle } from '../Custom';
import { useAuctionCountdown } from '../../hooks/useAuctionCountdown';

export interface AuctionCard extends CardProps {
  auctionView: AuctionView;
}

const isEnded = (state?: CountdownState) =>
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

  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == auctionView.auction.info.tokenMint,
  )[0];
  const { amount } = useAuctionStatus(auctionView);

  const _amount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formattedAmount = formatAmount(_amount);

  const state = useAuctionCountdown(auctionView);
  const ended = isEnded(state);
  const countdown =
    state && !ended
      ? state?.days > 0
        ? `${state?.days}d ${state?.hours}h ${state?.minutes}m`
        : `${state?.hours}h ${state?.minutes}m ${state?.seconds}s`
      : 'ENDED';

  const card = (
    <Card hoverable={true} className={`auction-render-card`} bordered={false}>
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
              title="CURRENT BID"
              value={`${formattedAmount} SOL`}
              prefix={
                <TokenCircle
                  iconSize={20}
                  iconFile={
                    tokenInfo?.logoURI == '' ? undefined : tokenInfo?.logoURI
                  }
                />
              }
            />
            <Statistic
              className="bid-statistic tw-text-right"
              title="ENDDING IN"
              value={countdown}
            />
          </div>
        </div>
      </Link>
    </Card>
  );

  return card;
};
