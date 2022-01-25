import React from 'react';
import {
  Row,
  Col,
  Skeleton,
  Collapse,
  Dropdown,
  Menu,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import { AuctionView, useArt, useAuctions, useExtendedArt } from '../../hooks';

import { ArtContent } from '../../components/ArtContent';
import { useWallet } from '@solana/wallet-adapter-react';
import { ViewOn } from '../../components/ViewOn';
import { ArtInfo } from './ArtInfo';
import { CollectionInfo } from './CollectionInfo';

const { Panel } = Collapse;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();

  const art = useArt(id);
  let auction: AuctionView | undefined;
  const auctions = useAuctions();
  const filters = auctions.filter(item => item.thumbnail.metadata.pubkey === id);
  if (filters.length > 0) {
    auction = filters[0];
  }
  const pubkey = wallet?.publicKey?.toBase58() || '';
  
  const { ref, data } = useExtendedArt(id);

  return (
    <div className='main-area'>
      <div className='container art-container'>
        <Row ref={ref} gutter={24}>
          <Col span={24} lg={12}>
            <div className='artwork-view'>
              <ArtContent
                className="artwork-image"
                pubkey={id}
                active={true}
                allowMeshRender={true}
                artView={true}
              />
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
            <div className="art-title">
              {art.title || <Skeleton paragraph={{ rows: 0 }} />}
            </div>
            <CollectionInfo />
            <ViewOn id={id} />
            
            <ArtInfo art={art} data={data} />
          </Col>
          
        </Row>
      </div>
    </div>
  );
};
