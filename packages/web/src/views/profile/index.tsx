import { ConnectButton, shortenAddress, useMeta } from "@oyster/common";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { Button, Row, Col, Statistic, Tabs } from 'antd';
import { CopySpan } from "../../components/CopySpan";

const { TabPane } = Tabs;

export const ProfileView = () => {

  const wallet = useWallet();
  const { whitelistedCreatorsByCreator } = useMeta();
  let item;
  if (wallet.connected) {
    item = whitelistedCreatorsByCreator[wallet.publicKey?.toBase58() || ''];
  }
  console.log('item', item);
  return (
    <div className="main-area">
      <div className="profile-page">
        <div className="container">
          <div className="collection-info">
            {item && item.info ? (
              item.info.image 
                ? (<img src={item.info.image} alt='profile' className="profile-image" />)
                : (<img src={`https://avatars.dicebear.com/api/jdenticon/${item.info.address}.svg`} className='profile-image' />)
            ) : (
              <img src={`https://avatars.dicebear.com/api/jdenticon/unknown.svg`} className='profile-image' />
            )}
            {item && item.info ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {item.info.name && (<h1>{item.info.name}</h1>)}
                <CopySpan value={shortenAddress(item.info.address, 8)} copyText={item.info.address} className='wallet-address'/>
                {item.info.description && (<span className="description">{item.info.description}</span>)}
                <Button className="profile-button">Edit Profile</Button>
              </div>
            ) : (
              <ConnectButton className="profile-button" />
            )}
          </div>
          <Row className="collection-details">
            <Col span={12} md={8} lg={6} className='details-container'>
              <Statistic title='TOTAL FLOOR VALUE' value='--SOL'/>
            </Col>
          </Row>
          <Tabs defaultActiveKey="1" className="profile-tabs">
            <TabPane tab='My items' key='1'>
              My items
            </TabPane>
            <TabPane tab='Listed items' key='2'>
              Listed items
            </TabPane>
            <TabPane tab='Offers made' key='3'>
              Offers made
            </TabPane>
            <TabPane tab='Offers received' key='4'>
              Offers received
            </TabPane>
            <TabPane tab='Activites' key='5'>
              Activites
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  )
}