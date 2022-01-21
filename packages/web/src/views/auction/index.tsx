import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Carousel,
  Col,
  Row,
  Skeleton,
  Menu,
  Dropdown,
  Collapse,
} from 'antd';
import { AuctionCard } from '../../components/AuctionCard';
import { Connection } from '@solana/web3.js';
import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import {
  AuctionView as Auction,
  useArt,
  useAuction,
  useBidsForAuction,
  // useCreators,
  useExtendedArt,
} from '../../hooks';
import { ArtContent } from '../../components/ArtContent';

import { format } from 'timeago.js';

import {
  AuctionState,
  formatTokenAmount,
  Identicon,
  MetaplexModal,
  shortenAddress,
  StringPublicKey,
  toPublicKey,
  useConnection,
  useConnectionConfig,
  useMint,
  useMeta,
  // BidStateType,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintInfo } from '@solana/spl-token';
import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import useWindowDimensions from '../../utils/layout';
import { CheckOutlined } from '@ant-design/icons';
// import { ArtType } from '../../types';
import { AmountLabel } from '../../components/AmountLabel';
import { ClickToCopy } from '../../components/ClickToCopy';
import { useTokenList } from '../../contexts/tokenList';
import { ArtistInfo } from './ArtistInfo';

const { Panel } = Collapse;

export const AuctionItem = ({
  item,
  index,
  size,
  active,
}: {
  item: AuctionViewItem;
  index: number;
  size: number;
  active?: boolean;
}) => {
  const id = item.metadata.pubkey;
  const style: React.CSSProperties = {
    transform:
      index === 0
        ? ''
        : `translate(${index * 15}px, ${-40 * index}px) scale(${Math.max(
            1 - 0.2 * index,
            0,
          )})`,
    transformOrigin: 'right bottom',
    position: index !== 0 ? 'absolute' : 'static',
    zIndex: -1 * index,
    marginLeft: size > 1 && index === 0 ? '0px' : 'auto',
    background: 'black',
    boxShadow: 'rgb(0 0 0 / 10%) 12px 2px 20px 14px',
    aspectRatio: '1/1',
  };
  return (
    <ArtContent
      pubkey={id}
      className="artwork-image stack-item"
      style={style}
      active={active}
      allowMeshRender={true}
    />
  );
};

export const AuctionView = () => {
  const { id } = useParams<{ id: string }>();
  const { endpoint } = useConnectionConfig();
  const auction = useAuction(id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  // const creators = useCreators(auction);
  const { pullAuctionPage } = useMeta();
  useEffect(() => {
    pullAuctionPage(id);
  }, []);

  // let edition = '';
  // if (art.type === ArtType.NFT) {
  //   edition = 'Unique';
  // } else if (art.type === ArtType.Master) {
  //   edition = 'NFT 0';
  // } else if (art.type === ArtType.Print) {
  //   edition = `${art.edition} of ${art.supply}`;
  // }
  // const nftCount = auction?.items.flat().length;
  // const winnerCount = auction?.items.length;
  // const isOpen =
  //   auction?.auction.info.bidState.type === BidStateType.OpenEdition;
  // const hasDescription = data === undefined || data.description === undefined;
  // const description = data?.description;
  // const attributes = data?.attributes;

  // const tokenInfo = useTokenList()?.mainnetTokens.filter(
  //   m => m.address == auction?.auction.info.tokenMint,
  // )[0];

  const items = [
    ...(auction?.items
      .flat()
      .reduce((agg, item) => {
        agg.set(item.metadata.pubkey, item);
        return agg;
      }, new Map<string, AuctionViewItem>())
      .values() || []),
    auction?.participationItem,
  ].map((item, index, arr) => {
    if (!item || !item?.metadata || !item.metadata?.pubkey) {
      return null;
    }

    return (
      <AuctionItem
        key={item.metadata.pubkey}
        item={item}
        index={index}
        size={arr.length}
        active={index === currentIndex}
      />
    );
  });

  const menu = (
    <Menu>
      <Menu.Item key={0}>
        <Link to={'/'} className="social-menu-item">
          <img width={24} src={'/icons/facebook2.png'} />
          <span>Share on Facebook</span>
        </Link>
      </Menu.Item>
      <Menu.Item key={1}>
        <Link to={'/'} className="social-menu-item">
          <img width={24} src={'/icons/twitter2.png'} />
          <span>Share on Twitter</span>
        </Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link to={'/'} className="social-menu-item">
          <img width={24} src={'/icons/telegram2.png'} />
          <span>Share on Telegram</span>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="main-area">
      <div className="container">
        <Row ref={ref} gutter={24} >
          <Col span={24} lg={12}>
            <div className='auction-view'>
              { auction?.thumbnail.metadata.pubkey === undefined ? (
                <Skeleton paragraph={{rows: 3}} active />
              ) : (
                <ArtContent pubkey={auction.thumbnail.metadata.pubkey} className="artwork-image"/>
              )}
            </div>
            <Collapse className="price-history" expandIconPosition="right">
              <Panel key={0} header="Price History" className="bg-secondary"
                extra={<img src='/icons/activity.svg' width={24} alt='price history' />}
              >
                <Skeleton paragraph={{ rows: 3 }} active />
              </Panel>
            </Collapse>
          </Col>

          <Col span={24} lg={12}>
            <span className="art-title">
              {art.title || <Skeleton paragraph={{ rows: 0 }} />}
            </span>
            <div className="collection-container">
              <Link to={''} className="collection-name">
                <img width={20} src={'/icons/check.svg'} />
                <span>{'collection_name'}</span>
              </Link>
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="social-share" onClick={e => e.preventDefault()}>
                  <img width={20} src={'/icons/share.svg'} />
                  <span>Share</span>
                </a>
              </Dropdown>
              <div onClick={() => {}}>
                <img width={20} src={'/icons/refresh.svg'} />
              </div>
            </div>
            <div className="info-view">
              <span className="info-title">View on:</span>
              <Button
                className="tag"
                onClick={() => window.open(art.uri || '', '_blank')}
              >
                Arweave
              </Button>
              <Button
                className="tag"
                onClick={() => {
                  const cluster = endpoint.name;
                  const explorerURL = new URL(
                    `account/${art?.mint || ''}`,
                    'https://explorer.solana.com',
                  );
                  if (!cluster.includes('mainnet')) {
                    explorerURL.searchParams.set('cluster', cluster);
                  }
                  window.open(explorerURL.href, '_blank');
                }}
              >
                Solana
              </Button>
            </div>
            {!auction && <Skeleton paragraph={{ rows: 6 }} />}
            {auction && (
              <AuctionCard auctionView={auction} hideDefaultAction={false} />
            )}
            {!auction?.isInstantSale && <AuctionBids auctionView={auction} />}
            <ArtistInfo art={art} data={data} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

const BidLine = (props: {
  bid: any;
  index: number;
  mint?: MintInfo;
  isCancelled?: boolean;
  isActive?: boolean;
  mintKey: string;
}) => {
  const { bid, index, mint, isCancelled, isActive, mintKey } = props;
  const { publicKey } = useWallet();
  const bidder = bid.info.bidderPubkey;
  const isme = publicKey?.toBase58() === bidder;
  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == mintKey,
  )[0];

  // Get Twitter Handle from address
  const connection = useConnection();
  const [bidderTwitterHandle, setBidderTwitterHandle] = useState('');
  useEffect(() => {
    const getTwitterHandle = async (
      connection: Connection,
      bidder: StringPublicKey,
    ): Promise<string | undefined> => {
      try {
        const [twitterHandle] = await getHandleAndRegistryKey(
          connection,
          toPublicKey(bidder),
        );
        setBidderTwitterHandle(twitterHandle);
      } catch (err) {
        console.warn(`err`);
        return undefined;
      }
    };
    getTwitterHandle(connection, bidder);
  }, [bidderTwitterHandle]);
  const { width } = useWindowDimensions();
  if (width < 768) {
    return (
      <Row className="mobile-bid-history">
        <div className="bid-info-container">
          <div className="bidder-info-container">
            <Identicon
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                marginTop: 2,
              }}
              address={bidder}
            />
            {bidderTwitterHandle ? (
              <a
                target="_blank"
                title={shortenAddress(bidder)}
                href={`https://twitter.com/${bidderTwitterHandle}`}
              >{`@${bidderTwitterHandle}`}</a>
            ) : (
              shortenAddress(bidder)
            )}
          </div>
          <div>
            {!isCancelled && (
              <div className={'flex '}>
                {isme && (
                  <>
                    <CheckOutlined />
                    &nbsp;
                  </>
                )}
                <AmountLabel
                  style={{ marginBottom: 0, fontSize: '16px' }}
                  containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  displaySymbol={tokenInfo?.symbol || 'CUSTOM'}
                  iconSize={24}
                  amount={formatTokenAmount(bid.info.lastBid, mint)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="bid-info-container">
          {format(bid.info.lastBidTimestamp.toNumber() * 1000)}
        </div>
      </Row>
    );
  } else {
    return (
      <Row className={'bid-history'}>
        {isCancelled && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 1,
              background: 'grey',
              top: 'calc(50% - 1px)',
              zIndex: 2,
            }}
          />
        )}
        <Col span={8}>
          {!isCancelled && (
            <div className={'flex '}>
              {isme && (
                <>
                  <CheckOutlined />
                  &nbsp;
                </>
              )}
              <AmountLabel
                style={{ marginBottom: 0, fontSize: '16px' }}
                containerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                displaySymbol={tokenInfo?.symbol || 'CUSTOM'}
                tokenInfo={tokenInfo}
                iconSize={24}
                amount={formatTokenAmount(bid.info.lastBid, mint)}
              />
            </div>
          )}
        </Col>
        <Col span={8} style={{ opacity: 0.7 }}>
          {/* uses milliseconds */}
          {format(bid.info.lastBidTimestamp.toNumber() * 1000)}
        </Col>
        <Col span={8}>
          <div className={'flex-right'}>
            <Identicon
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                marginTop: 2,
              }}
              address={bidder}
            />{' '}
            <span style={{ opacity: 0.7 }}>
              {bidderTwitterHandle ? (
                <Row className="pubkey-row">
                  <a
                    target="_blank"
                    title={shortenAddress(bidder)}
                    href={`https://twitter.com/${bidderTwitterHandle}`}
                  >{`@${bidderTwitterHandle}`}</a>
                  <ClickToCopy
                    className="copy-pubkey"
                    copyText={bidder as string}
                    tooltip="Click to copy pubkey"
                  />
                </Row>
              ) : (
                <Row className="pubkey-row">
                  {shortenAddress(bidder)}
                  <ClickToCopy
                    className="copy-pubkey"
                    copyText={bidder as string}
                    tooltip="Click to copy pubkey"
                  />
                </Row>
              )}
            </span>
          </div>
        </Col>
      </Row>
    );
  }
};

export const AuctionBids = ({
  auctionView,
}: {
  auctionView?: Auction | null;
}) => {
  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');

  const mint = useMint(auctionView?.auction.info.tokenMint);
  const { width } = useWindowDimensions();

  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const winnersCount = auctionView?.auction.info.bidState.max.toNumber() || 0;
  const activeBids = auctionView?.auction.info.bidState.bids || [];
  const activeBidders = useMemo(() => {
    return new Set(activeBids.map(b => b.key));
  }, [activeBids]);
  const auctionState = auctionView
    ? auctionView.auction.info.state
    : AuctionState.Created;
  const bidLines = useMemo(() => {
    let activeBidIndex = 0;
    return bids.map((bid, index) => {
      const isCancelled =
        (index < winnersCount && !!bid.info.cancelled) ||
        (auctionState !== AuctionState.Ended && !!bid.info.cancelled);

      const line = (
        <BidLine
          bid={bid}
          index={activeBidIndex}
          key={index}
          mint={mint}
          isCancelled={isCancelled}
          isActive={!bid.info.cancelled}
          mintKey={auctionView?.auction.info.tokenMint || ''}
        />
      );

      if (!isCancelled) {
        activeBidIndex++;
      }

      return line;
    });
  }, [auctionState, bids, activeBidders]);

  if (!auctionView || bids.length < 1) return null;

  return (
    <Row>
      <Col className="bids-lists">
        <h6 className={'info-title'}>Bid History</h6>
        {bidLines.slice(0, 10)}
        {bids.length > 10 && (
          <div
            className="full-history"
            onClick={() => setShowHistoryModal(true)}
            style={{
              cursor: 'pointer',
            }}
          >
            View full history
          </div>
        )}
        <MetaplexModal
          visible={showHistoryModal}
          onCancel={() => setShowHistoryModal(false)}
          title="Bid history"
          bodyStyle={{
            background: 'unset',
            boxShadow: 'unset',
            borderRadius: 0,
          }}
          centered
          width={width < 768 ? width - 10 : 600}
        >
          <div
            style={{
              maxHeight: 600,
              overflowY: 'scroll',
              width: '100%',
            }}
          >
            {bidLines}
          </div>
        </MetaplexModal>
      </Col>
    </Row>
  );
};
