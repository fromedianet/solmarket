import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { Image } from 'antd';
import ReadMore from '../../../components/ReadMore';
import { ExCollection, ExCollectionStats } from '../../../models/exCollection';

export const CollectionInfo = (props: {
  collection: ExCollection | undefined;
  stats: ExCollectionStats;
}) => {
  return (
    <div className="info-container">
      {props.collection && props.collection.thumbnail ? (
        <Image
          loading="lazy"
          className="info-image"
          src={props.collection.thumbnail}
          alt="avatar"
        />
      ) : (
        <img className="info-image" src="/image-placeholder.svg" alt="avatar" />
      )}

      <h1 className="info-title">{props.collection && props.collection.name}</h1>
      <div
        role="group"
        className="info-group"
      >
        {props.collection && (
          <div className="inline mr-1">
            {props.collection.website && (
              <a
                target="_blank"
                className="mr-1"
                href={props.collection.website}
                rel="noreferrer"
              >
                <img
                  src="/icons/website.svg"
                  className="info-icon"
                  alt="twitter"
                />
              </a>
            )}
            {props.collection.discord && (
              <a
                target="_blank"
                className="mr-1"
                href={props.collection.discord}
                rel="noreferrer"
              >
                <img
                  src="/icons/discord.svg"
                  className="info-icon"
                  alt="twitter"
                />
              </a>
            )}
            {props.collection.twitter && (
              <a
                target="_blank"
                className="mr-1"
                href={props.collection.twitter}
                rel="noreferrer"
              >
                <img
                  src="/icons/twitter2.svg"
                  className="info-icon"
                  alt="twitter"
                />
              </a>
            )}
          </div>
        )}
      </div>
      <Row gutter={[16, 16]}>
        <Col key="floor" span={12} lg={8}>
          <Statistic
            title="Floor Price"
            value={props.stats.floorPrice ? props.stats.floorPrice.toFixed(2) : '--'}
            suffix="◎"
            className="info-attribute"
          />
        </Col>
        <Col key="total" span={12} lg={8}>
          <Statistic
            title="Total Volume (ALL Time, ALL Marketplaces)"
            value={props.stats.volume ? props.stats.volume.toFixed(2) : '--'}
            suffix="◎"
            className="info-attribute"
          />
        </Col>
        <Col key="count" span={12} lg={8}>
          <Statistic
            title="Total Listed Count"
            value={props.stats.listedCount || '--'}
            className="info-attribute"
          />
        </Col>
      </Row>
      <div className="info-description">
        {props.collection && props.collection.description && (
          <ReadMore
            // eslint-disable-next-line react/no-children-prop
            children={props.collection.description || ''}
            maxLength={300}
          />
        )}
      </div>
    </div>
  );
};
