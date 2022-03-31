import React from 'react';
import { Row, Col, Collapse, Skeleton, Statistic } from 'antd';
import { NFT } from '../../models/exCollection';
import { ArtContent } from '../../components/ArtContent';
import { Link } from 'react-router-dom';
import { CopySpan, shortenAddress } from '@oyster/common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ItemAction } from './itemAction';

const { Panel } = Collapse;

export const InfoSection = (props: {
  nft: NFT;
  priceData: any[];
  onRefresh: () => void;
  onBuy: () => void;
}) => {
  return (
    <Row gutter={24}>
      <Col span={24} lg={12}>
        <div className="artwork-view">
          <ArtContent
            className="artwork-image"
            uri={props.nft.image}
            // @ts-ignore
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
          {props.nft.name || <Skeleton paragraph={{ rows: 0 }} />}
        </div>
        <div className="collection-container">
          <Link
            to={`/marketplace/${props.nft.symbol}`}
            className="collection-name"
          >
            <img width={20} src={'/icons/check.svg'} />
            <span>{props.nft.collectionName}</span>
          </Link>
          <div
            onClick={props.onRefresh}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
          >
            <img width={20} src={'/icons/refresh.svg'} />
          </div>
        </div>
        <ItemAction nft={props.nft} onBuy={props.onBuy} />
        <Collapse
          expandIconPosition="right"
          className="art-info"
          defaultActiveKey={['attributes', 'details']}
        >
          <Panel
            header={`About ${props.nft.name}`}
            key="about"
            className="bg-secondary"
            extra={<img src="/icons/user.svg" width={24} alt="about" />}
          >
            <div>
              {props.nft.description || (
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
                    value={shortenAddress(props.nft.mint)}
                    copyText={props.nft.mint}
                  />
                </div>
              </div>
              <div className="sub-container">
                <span className="details-key">Owner</span>
                <div className="details-value">
                  <CopySpan
                    value={shortenAddress(props.nft.updateAuthority || '')}
                    copyText={props.nft.updateAuthority || ''}
                  />
                </div>
              </div>
              <div className="sub-container">
                <span className="details-key">Artist Royalties</span>
                <div className="details-value">
                  {((props.nft.seller_fee_basis_points || 0) / 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
};
