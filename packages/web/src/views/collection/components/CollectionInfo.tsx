import React from 'react';
import { Row, Col, Statistic } from 'antd';
import ReadMore from '../../../components/ReadMore';
import { IMetadataExtension } from '@oyster/common';

export const CollectionInfo = (props: {
  data: IMetadataExtension | undefined;
}) => {
  return (
    <div className="info-container">
      <img
        loading="lazy"
        className="info-image"
        src={props.data?.image}
        alt="avatar"
      />
      <h1 className="info-title">{props.data?.name}</h1>
      <span className='info-symbol'>{props.data?.symbol}</span>
      <div
        role="group"
        className="info-group flex relative lg:absolute lg:top-20 lg:right-6 mb-2"
      >
        <div className="inline mr-1">
          <a
            target="_blank"
            className="mr-1 hover:opacity-80"
            href="https://twitter.com/spacerunnersnft"
            rel="noreferrer"
          >
            <img
              src="/icons/twitter2.svg"
              className="w-8 lg:w-10"
              alt="twitter"
            />
          </a>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col key="floor" span={12} lg={6}>
          <Statistic
            title="Floor Price"
            value={7.1}
            suffix="◎"
            className="info-attribute"
          />
        </Col>
        <Col key="total" span={12} lg={6}>
          <Statistic
            title="Total Volume (ALL Time, ALL Marketplaces)"
            value={205}
            suffix="◎"
            className="info-attribute"
          />
        </Col>
        <Col key="avg" span={12} lg={6}>
          <Statistic
            title="Avg Sale Price (Last 24HR)"
            value={27.1}
            suffix="◎"
            className="info-attribute"
          />
        </Col>
        <Col key="count" span={12} lg={6}>
          <Statistic
            title="Total Listed Count"
            value={701}
            className="info-attribute"
          />
        </Col>
      </Row>
      <div className="info-description">
        <ReadMore
          // eslint-disable-next-line react/no-children-prop
          children={props.data?.description || ''}
          maxLength={300}
        />
      </div>
    </div>
  );
};
