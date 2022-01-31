import { ConnectButton, MetaplexModal, shortenAddress } from "@oyster/common";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { Button, Row, Col, Statistic, Tabs, Form, Input, message } from 'antd';
import { CopySpan } from "../../components/CopySpan";
import { useCreator } from "../../hooks";

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {

  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const wallet = useWallet();
  const creator = useCreator(wallet.publicKey?.toBase58());
  
  const onSubmit = (values) => {
    console.log(values);
    message.success('Submit success!');
  }

  const onSubmitFailed = () => {
    message.error("Submit failed!");
  }

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