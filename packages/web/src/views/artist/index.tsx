import { Col, Divider, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ArtCard } from '../../components/ArtCard';
import { CardLoader } from '../../components/MyLoader';
import { useAuctions, useCreator, useCreatorArts } from '../../hooks';

export const ArtistView = () => {
  const { id } = useParams<{ id: string }>();
  const creator = useCreator(id);
  const artwork = useCreatorArts(id);

  const artworkGrid = (
    <Row gutter={[16, 16]}>
      {artwork.length > 0
        ? artwork.map(m => {
            const id = m.pubkey;
            return (
              <Col key={id} span={12} md={8} lg={6} xl={4}>
                <ArtCard pubkey={m.pubkey} preview={false} artView={true} />
              </Col>
            );
          })
        : [...Array(6)].map((_, idx) => (
            <Col key={idx} span={24} md={8} lg={6} xl={4}>
              <CardLoader />
            </Col>
          ))}
    </Row>
  );

  return (
    <div className="main-area">
      <div className='main-page'>
        <div className="container">
          <Divider />
          <Row style={{ textAlign: 'left', fontSize: '1.4rem' }}>
            <Col span={24}>
              <h2>
                {/* <MetaAvatar creators={creator ? [creator] : []} size={100} /> */}
                {creator?.info.name || creator?.info.address}
              </h2>
              <br />
              <div className="info-header">ABOUT THE CREATOR</div>
              <div className="info-content">{creator?.info.description}</div>
              <br />
              <div className="info-header">Art Created</div>
              {artworkGrid}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
