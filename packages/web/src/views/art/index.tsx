import React from 'react';
import {
  Row,
  Col,
  Tag,
  Button,
  Skeleton,
  Collapse,
  Dropdown,
  Menu,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useArt, useExtendedArt } from '../../hooks';

import { ArtContent } from '../../components/ArtContent';
import { shortenAddress, useConnection } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaAvatar } from '../../components/MetaAvatar';
import { sendSignMetadata } from '../../actions/sendSignMetadata';
import { ViewOn } from '../../components/ViewOn';
import { ArtInfo } from './ArtInfo';

const { Panel } = Collapse;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();

  const connection = useConnection();
  const art = useArt(id);
  
  const { ref, data } = useExtendedArt(id);

  // const { userAccounts } = useUserAccounts();

  // const accountByMint = userAccounts.reduce((prev, acc) => {
  //   prev.set(acc.info.mint.toBase58(), acc);
  //   return prev;
  // }, new Map<string, TokenAccount>());


  const pubkey = wallet?.publicKey?.toBase58() || '';

  const tag = (
    <div className="info-header">
      <Tag color="blue">UNVERIFIED</Tag>
    </div>
  );

  const unverified = (
    <>
      {tag}
      <div style={{ fontSize: 12 }}>
        <i>
          This artwork is still missing verification from{' '}
          {art.creators?.filter(c => !c.verified).length} contributors before it
          can be considered verified and sellable on the platform.
        </i>
      </div>
      <br />
    </>
  );

  const menu = (
    <Menu>
      <Menu.Item key={0}>
        <Link to={'/'} className="social-menu-item">
          <img width={24} src={'/icons/facebook2.png'} />
          <span>Share on Facebook</span>
        </Link>
      </Menu.Item>
      <Menu.Item key={1}>
        <Link to={'/'} className="social-menu-item">
          <img width={24} src={'/icons/twitter2.png'} />
          <span>Share on Twitter</span>
        </Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link to={'/'} className="social-menu-item">
          <img width={24} src={'/icons/telegram2.png'} />
          <span>Share on Telegram</span>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className='main-area'>
      <div className='container'>
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
            <div className="collection-container">
              <Link to={''} className="collection-name">
                <img width={20} src={'/icons/check.svg'} />
                <span>{'collection_name'}</span>
              </Link>
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="social-share" onClick={e => e.preventDefault()}>
                  <img width={20} src={'/icons/share.svg'} />
                  <span>Share</span>
                </a>
              </Dropdown>
              <div onClick={() => {}}>
                <img width={20} src={'/icons/refresh.svg'} />
              </div>
            </div>
            <ViewOn id={id} />
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Created By</h6>
                <div className="creators">
                  {(art.creators || []).map((creator, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}
                      >
                        <MetaAvatar creators={[creator]} size={64} />
                        <div>
                          <span className="creator-name">
                            {creator.name ||
                              shortenAddress(creator.address || '')}
                          </span>
                          <div style={{ marginLeft: 10 }}>
                            {!creator.verified &&
                              (creator.address === pubkey ? (
                                <Button
                                  onClick={async () => {
                                    try {
                                      await sendSignMetadata(
                                        connection,
                                        wallet,
                                        id,
                                      );
                                    } catch (e) {
                                      console.error(e);
                                      return false;
                                    }
                                    return true;
                                  }}
                                >
                                  Approve
                                </Button>
                              ) : (
                                tag
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <ArtInfo art={art} data={data} />
          </Col>
          
        </Row>
      </div>
    </div>
  );
};
