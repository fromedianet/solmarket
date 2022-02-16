import React from 'react';
import { Collapse, Skeleton, Row, Col, Statistic } from 'antd';
import {
  IMetadataExtension,
  shortenAddress,
  TokenAccount,
} from '@oyster/common';
import { Art } from '../../types';
import { CopySpan } from '../../components/CopySpan';

const { Panel } = Collapse;
export const ArtDetails = ({
  art,
  data,
  account,
}: {
  art: Art;
  data: IMetadataExtension | undefined;
  account: TokenAccount | undefined;
}) => {
  const hasDescription = data === undefined || data.description === undefined;
  const description = data?.description;
  const attributes = data?.attributes;
  // let badge = '';
  // let maxSupply = '';
  // if (art.type === ArtType.NFT) {
  //   badge = 'Unique';
  // } else if (art.type === ArtType.Master) {
  //   badge = 'NFT 0';
  //   if (art.maxSupply !== undefined) {
  //     maxSupply = art.maxSupply.toString();
  //   } else {
  //     maxSupply = 'Unlimited';
  //   }
  // } else if (art.type === ArtType.Print) {
  //   badge = `${art.edition} of ${art.supply}`;
  // }

  return (
    <Collapse
      expandIconPosition="right"
      className="art-info"
      defaultActiveKey={["attributes", "details"]}
    >
      <Panel
        header={`About ${art.title}`}
        key="about"
        className="bg-secondary"
        extra={<img src="/icons/user.svg" width={24} alt="about" />}
      >
        <div>
          {hasDescription && <Skeleton paragraph={{ rows: 1 }} />}
          {description || (
            <div style={{ fontStyle: 'italic' }}>No description provided.</div>
          )}
        </div>
      </Panel>
      <Panel
        header="Attributes"
        key="attributes"
        extra={<img src="/icons/shield.svg" width={24} alt="attributes" />}
      >
        {attributes === undefined ? (
          <Skeleton paragraph={{ rows: 3 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {attributes.map((item, index) => (
              <Col key={index} span={24} lg={8}>
                <Statistic title={item.trait_type} value={item.value} />
              </Col>
            ))}
          </Row>
        )}
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
              {art.mint === undefined ? (
                <Skeleton paragraph={{ rows: 0 }} active />
              ) : (
                <CopySpan
                  value={shortenAddress(art.mint)}
                  copyText={art.mint}
                  className=""
                />
              )}
            </div>
          </div>
          {account && (
            <>
              <div className="sub-container">
                <span className="details-key">Token Address</span>
                <div className="details-value">
                  <CopySpan
                    value={shortenAddress(account.pubkey)}
                    copyText={account.pubkey}
                    className=""
                  />
                </div>
              </div>
              <div className="sub-container">
                <span className="details-key">Owner</span>
                <div className="details-value">
                  <CopySpan
                    value={shortenAddress(account.info.owner.toBase58())}
                    copyText={account.info.owner.toBase58()}
                    className=""
                  />
                </div>
              </div>
            </>
          )}
          <div className="sub-container">
            <span className="details-key">Artist Royalties</span>
            <div className="details-value">
              {((art.seller_fee_basis_points || 0) / 100).toFixed(2)}%
            </div>
          </div>
          {/* <div className="sub-container">
            <span className="details-key">Edition</span>
            <div className="details-value">{badge}</div>
          </div>
          {art.type === ArtType.Master && (
            <div className="sub-container">
              <span className="details-key">Max Supply</span>
              <div className="details-value">{maxSupply}</div>
            </div>
          )} */}
        </div>
      </Panel>
    </Collapse>
  );
};
