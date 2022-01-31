import { ConnectButton, MetaplexModal, shortenAddress } from "@oyster/common";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { Button, Row, Col, Statistic, Tabs, Form, Input, message } from 'antd';
import { CopySpan } from "../../components/CopySpan";
import { useCreator, useCreatorArts } from "../../hooks";
import { Link } from "react-router-dom";
import { ArtCard } from "../../components/ArtCard";

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {
  const [visible, setVisible] = useState(false);
  const wallet = useWallet();
  const artwork = useCreatorArts(wallet.publicKey?.toBase58());
  
  const creator = useCreator(wallet.publicKey?.toBase58());
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    console.log(values);
    message.success('Submit success!');
  }

  const onSubmitFailed = () => {
    message.error("Submit failed!");
  }

  const EmptyView = () => {
    return (
      <div className="empty-container">
        <img src="/icons/no-data.svg" width={100} alt='empty' />
        <span>No Items</span>
      </div>
    );
  };

  return (
    <div className="main-area">
      <div className="profile-page">
        <div className="container">
          <div className="collection-info">
            {creator && creator.info ? (
              creator.info.image 
                ? (<img src={creator.info.image} alt='profile' className="profile-image" />)
                : (<img src={`https://avatars.dicebear.com/api/jdenticon/${creator.info.address}.svg`} className='profile-image' />)
            ) : (
              <img src={`https://avatars.dicebear.com/api/jdenticon/unknown.svg`} className='profile-image' />
            )}
            {creator && creator.info ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {creator.info.name && (<h1>{creator.info.name}</h1>)}
                <CopySpan value={shortenAddress(creator.info.address, 8)} copyText={creator.info.address} className='wallet-address'/>
                {creator.info.description && (<span className="description">{creator.info.description}</span>)}
                <Button className="profile-button" onClick={() => setVisible(true)}>Edit Profile</Button>
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
              {artwork && artwork.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {artwork.map((item, index) => 
                    <Col key={index} span={24} md={8} xl={6} >
                      <Link to={`/art/${item.pubkey}`}>
                        <ArtCard
                          pubkey={item.pubkey}
                          preview={false}
                          artView={true}
                        />
                      </Link>
                    </Col>
                  )}
                </Row>
              ) : (
                <EmptyView />
              )}
            </TabPane>
            <TabPane tab='Listed items' key='2'>
              Listed items - Comming soon
            </TabPane>
            <TabPane tab='Offers made' key='3'>
              Offers made - Comming soom
            </TabPane>
            <TabPane tab='Offers received' key='4'>
              Offers received - Comming soon
            </TabPane>
            <TabPane tab='Activites' key='5'>
              Activites - Comming soon
            </TabPane>
          </Tabs>
        </div>
      </div>
      <MetaplexModal visible={visible} onCancel={() => setVisible(false)} >
        <div className="profile-modal">
          <h1>Profile settings</h1>
          <Form
            form={form}
            layout='vertical'
            requiredMark='optional'
            autoComplete="off"
            onFinish={onSubmit}
            onFinishFailed={onSubmitFailed}
          >
            <Form.Item name={['user', 'name']} label='Display name' required tooltip='This is a required field' rules={[{ required: true }]}>
              <Input placeholder="Display name" value={creator?.info.name}/>
            </Form.Item>
            <Form.Item name={['user', 'description']} label='Description'>
              <TextArea placeholder="Description" autoSize={{ minRows: 2, maxRows: 5 }} value={creator?.info.description}/>
            </Form.Item>
            <Form.Item name={['user', 'twitter']} label='Twitter'>
              <Input addonBefore='https://' value={creator?.info.twitter} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="submit-button">Submit</Button>
            </Form.Item>
          </Form>
        </div>
      </MetaplexModal>
    </div>
  )
}