import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Skeleton, Statistic } from 'antd';
import { useArt, useAuction, useExtendedArt } from '../../hooks';
import { ArtContent } from '../../components/ArtContent';

import { shortenAddress, useMeta } from '@oyster/common';
import { CopySpan } from '../../components/CopySpan';
import { BidLines } from './components/BidLines';

export const AuctionView = () => {
  const { id } = useParams<{ id: string }>();
  const auction = useAuction(id);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  const { pullAuctionPage } = useMeta();
  useEffect(() => {
    console.log('------------- pullAuctionPage -----------');
    pullAuctionPage(id);
  }, []);

  const hasDescription = data === undefined || data.description === undefined;
  const description = data?.description;
  const attributes = data?.attributes || [];

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container auction-content">
          <div className="artwork-container">
            <div className="artwork-content">
              {auction?.thumbnail.metadata.pubkey === undefined ? (
                <Skeleton paragraph={{ rows: 3 }} active />
              ) : (
                <ArtContent
                  style={{ width: '100%', height: 'auto', margin: '0 auto' }}
                  height={300}
                  width={300}
                  className="artwork-image"
                  pubkey={auction.thumbnail.metadata.pubkey}
                  active={true}
                  allowMeshRender={true}
                  artview={true}
                />
              )}
            </div>
          </div>
          <Row ref={ref} gutter={24}>
            <Col span={24} lg={12}>
              <span className="art-title">
                {art.title || <Skeleton paragraph={{ rows: 0 }} />}
              </span>
              <div className="created-by-container">
                <span>CREATED BY</span>
                <div className="created-by-content">
                  {(art.creators || []).map((creator, index) => (
                    <CopySpan
                      key={index}
                      value={shortenAddress(creator.address || '')}
                      copyText={creator.address || ''}
                      className="creator-address"
                    />
                  ))}
                </div>
              </div>
              <a
                href=""
                target="_blank"
                rel="noreferer"
                className="social-link"
                title="Twitter"
              >
                <img src="/icons/twitter.svg" width={20} alt="twitter" />
              </a>
              <div className="description-container">
                {hasDescription && <Skeleton paragraph={{ rows: 1 }} />}
                {description || (
                  <div style={{ fontStyle: 'italic' }}>
                    No description provided.
                  </div>
                )}
              </div>
              <div className="attributes-container">
                <span className="attributes-label">Attributes</span>
                <Row gutter={[12, 12]}>
                  {attributes.map((item, index) => (
                    <Col key={index} span={24} md={12} lg={8}>
                      <Statistic title={item.trait_type} value={item.value} />
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>

            <Col span={24} lg={12}>
              {!auction && <Skeleton paragraph={{ rows: 6 }} />}
              {/* {auction && (
                <AuctionCard auctionView={auction} hideDefaultAction={false} />
              )} */}
              {auction && <BidLines auctionView={auction} />}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
