import { shortenAddress } from '@oyster/common';
import { Col, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { CollectionCard } from '../../components/CollectionCard';
import { EmptyView } from '../../components/EmptyView';
import { useCreator } from '../../hooks';
import { useCollection } from '../../hooks/useCollection';

export const ArtistView = () => {
  const { id } = useParams<{ id: string }>();
  const creator = useCreator(id);
  const collections = useCollection();
  const ownCollections = collections.filter(item =>
    item.info.data.creators?.map(it => it.address).includes(id),
  );

  return (
    <div className="main-area">
      <div className="creator-page">
        <div className="container">
          <div className="creator-info">
            {creator?.info.image ? (
              <img
                src={creator.info.image}
                alt="profile"
                className="creator-image"
              />
            ) : (
              <img
                src={`https://avatars.dicebear.com/api/jdenticon/${creator?.info.address}.svg`}
                className="creator-image"
              />
            )}
            <h1>{shortenAddress(creator?.info.address || '')}</h1>
          </div>
          <div className="collection-area">
            <span className="section-title">Collections</span>
            {ownCollections.length > 0 ? (
              <Row gutter={[16, 16]}>
                {ownCollections.map((item, index) => (
                  <Col key={index} span={12} md={8} lg={8} xl={6} xxl={4}>
                    <CollectionCard pubkey={item.pubkey} preview={false}/>
                  </Col>
                ))}
              </Row>
            ) : (
              <EmptyView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
