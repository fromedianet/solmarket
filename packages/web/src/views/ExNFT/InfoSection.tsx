import React from 'react';
import { Row, Col, Collapse, Skeleton, Button, Statistic } from 'antd';
import { NFTData } from '../../models/exCollection';
import { ArtContent } from '../../components/ArtContent';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton, CopySpan, shortenAddress } from '@oyster/common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const { Panel } = Collapse;

export const InfoSection = (props: {
  nft: NFTData;
  collection: string;
  market: string;
  priceData: any[];
  onRefresh: () => void;
  onBuy: () => void;
}) => {
  const wallet = useWallet();
  const alreadyListed = props.nft.price || 0 > 0;
  const collectionUri = `/excollection/${encodeURIComponent(
    props.collection,
  )}?market=${props.market}`;
  return (
    <Row gutter={24}>
      <Col span={24} lg={12}>
        <div className="artwork-view">
          <ArtContent
            className="artwork-image"
            uri={props.nft.img}
            animationURL={props.nft.animationURL}
            active={true}
            allowMeshRender={true}
            artview={true}
          />
        </div>
        <Collapse
          className="price-history"
          expandIconPosition="right"
          defaultActiveKey={'price'}
        >
          <Panel
            key="price"
            header="Price History"
            className="bg-secondary"
            extra={
              <img src="/icons/activity.svg" width={24} alt="price history" />
            }
          >
            {props.priceData.length > 0 && (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={props.priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: 'Price (SOL)',
                        angle: -90,
                        position: 'insideLeft',
                        textAnchor: 'middle',
                        fill: '#888888',
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </Collapse>
      </Col>
      <Col span={24} lg={12}>
        <div className="art-title">
          {props.nft.title || <Skeleton paragraph={{ rows: 0 }} />}
        </div>
        <div className="collection-container">
          <Link to={collectionUri} className="collection-name">
            <img width={20} src={'/icons/check.svg'} />
            <span>{props.nft.collectionTitle || props.collection}</span>
          </Link>
          <div
            onClick={props.onRefresh}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
          >
            <img width={20} src={'/icons/refresh.svg'} />
          </div>
        </div>
        <div className="action-view">
          {alreadyListed && <span className="label">Current Price</span>}
          <div className="price-container">
            <img
              src="/icons/price.svg"
              width={24}
              alt="price"
              style={{ marginRight: '8px' }}
            />
            {alreadyListed && (
              <span className="value">{props.nft.price} SOL</span>
            )}
          </div>
          {!alreadyListed && <span className="value">Not listed</span>}
          {alreadyListed && (
            <div className="btn-container">
              {!wallet.connected ? (
                <ConnectButton className="button" />
              ) : (
                <Button className="button" onClick={props.onBuy} disabled>
                  Buy now
                </Button>
              )}
            </div>
          )}
        </div>
        <Collapse
          expandIconPosition="right"
          className="art-info"
          defaultActiveKey={['attributes', 'details']}
        >
          <Panel
            header={`About ${props.nft.title}`}
            key="about"
            className="bg-secondary"
            extra={<img src="/icons/user.svg" width={24} alt="about" />}
          >
            <div>
              {props.nft.content || (
                <div style={{ fontStyle: 'italic' }}>
                  No description provided.
                </div>
              )}
            </div>
          </Panel>
          <Panel
            header="Attributes"
            key="attributes"
            extra={<img src="/icons/shield.svg" width={24} alt="attributes" />}
          >
            <Row gutter={[16, 16]}>
              {props.nft.attributes.map((item, index) => (
                <Col key={index} span={24} lg={8}>
                  <Statistic title={item.trait_type} value={item.value} />
                </Col>
              ))}
            </Row>
          </Panel>
          <Panel
            header="Details"
            key="details"
            className="bg-secondary"
            extra={<img src="/icons/detail.svg" width={24} alt="details" />}
          >
            <div className="details-container">
              <div className="sub-container">
                <span className="details-key">Mint Address</span>
                <div className="details-value">
                  <CopySpan
                    value={shortenAddress(props.nft.mintAddress)}
                    copyText={props.nft.mintAddress}
                  />
                </div>
              </div>
              <div className="sub-container">
                <span className="details-key">Token Address</span>
                <div className="details-value">
                  <CopySpan
                    value={shortenAddress(props.nft.tokenAddress || '')}
                    copyText={props.nft.tokenAddress || ''}
                  />
                </div>
              </div>
              <div className="sub-container">
                <span className="details-key">Owner</span>
                <div className="details-value">
                  <CopySpan
                    value={shortenAddress(props.nft.owner || '')}
                    copyText={props.nft.owner || ''}
                  />
                </div>
              </div>
              <div className="sub-container">
                <span className="details-key">Artist Royalties</span>
                <div className="details-value">
                  {((props.nft.sellerFeeBasisPoints || 0) / 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
};
