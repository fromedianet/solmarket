import React from 'react';
import { Row, Col, Statistic } from 'antd';
import ReadMore from '../../../components/ReadMore';

export const CollectionInfo = () => {
  return (
    <div className="info-container">
      <img
        loading="lazy"
        className="info-image"
        src="/preview.gif"
        alt="avatar"
      />
      <h1 className="info-title">
        EYE NFT
      </h1>
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
            <img src='/icons/twitter2.svg' className="w-8 lg:w-10" alt="twitter" />
          </a>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col key='floor' span={12} lg={6}>
          <Statistic title='Floor Price' value={7.1} suffix='◎' className='info-attribute'/>
        </Col>
        <Col key='total' span={12} lg={6}>
          <Statistic title='Total Volume (ALL Time, ALL Marketplaces)' value={205} suffix='◎' className='info-attribute'/>
        </Col>
        <Col key='avg' span={12} lg={6}>
          <Statistic title='Avg Sale Price (Last 24HR)' value={27.1} suffix='◎' className='info-attribute'/>
        </Col>
        <Col key='count' span={12} lg={6}>
          <Statistic title='Total Listed Count' value={701} className='info-attribute' />
        </Col>
      </Row>
      <div className="info-description">
        <ReadMore
          children="Space Runners is the first NFT Metaverse Fashion brand in
          collaboration with artists and brands, designing digitally through
          through Augmented Reality (AR) and plug-in&apos;s into the Metaverse as
          as items. As the genesis batch, Space Runners teamed up with NBA
          Champions Kyle Kuzma and Nick Young to launch a 10K Sneaker NFT
          Collection. Owners of the NFTs become members of an exclusive
          RUNNERS club, where they can reap members-only benefits such as
          tickets to NBA basketball games, signed Kyle Kuzma &amp; Nick Young
          merchandise, exclusive invites to NBA parties &amp; pick up games,
          auto-whitelist for Space Runners&apos; next drop, and more. Visit
          www.spacerunners.com for more information."
          maxLength={300} />
      </div>
    </div>
  );
}
