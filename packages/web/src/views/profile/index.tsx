import {
  ConnectButton,
  CopySpan,
  MetaplexModal,
  shortenAddress,
  useConnectionConfig,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Statistic, Tabs, Form, Input, Table } from 'antd';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { useCreator } from '../../hooks';
import { useAuthToken } from '../../contexts/authProvider';
import { useAuthAPI } from '../../hooks/useAuthAPI';
import { useNFTsAPI } from '../../hooks/useNFTsAPI';
import { NFTCard } from '../marketplace/components/Items';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
import { Transaction } from '../../models/exCollection';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {
  const wallet = useWallet();
  const { authToken } = useAuthToken();
  const { authentication } = useAuthAPI();
  const { getNFTsByWallet } = useNFTsAPI();
  const [visible, setVisible] = useState(false);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [listedItems, setListedItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalFloorPrice, setTotalFloorPrice] = useState(0);
  const creator = useCreator(wallet.publicKey?.toBase58());
  const [form] = Form.useForm();
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;
  const { getTransactionsByWallet } = useTransactionsAPI();

  const getColor = txType => {
    if (txType === 'SALE') {
      return '#2fc27d';
    } else if (txType === 'PLACE BID') {
      return '#6d79c9';
    } else if (txType === 'LISTING') {
      return '#f8f7f8';
    } else {
      return '#9c93a5';
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'image',
      key: 'image',
      render: uri => <img src={uri} width={40} alt="image" />,
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={`/item-details/${record.mint}`} style={{ cursor: 'pointer' }}>
          {record.name}
        </a>
      ),
    },
    {
      title: 'TRANSACTION ID',
      dataIndex: 'transaction',
      key: 'transaction',
      render: txId => (
        <a
          href={`https://explorer.solana.com/tx/${txId}${
            network === 'mainnet-beta' ? '' : `?cluster=${network}`
          }`}
          target="_blank"
          rel="noreferrer"
          style={{ cursor: 'pointer' }}
        >
          {shortenAddress(txId)}
        </a>
      ),
    },
    {
      title: 'TRANSACTION TYPE',
      dataIndex: 'txType',
      key: 'txType',
      render: type => <span style={{ color: getColor(type) }}>{type}</span>,
    },
    {
      title: 'TIME',
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: timestamp => timeAgo.format(timestamp * 1000),
    },
    {
      title: 'TOTAL AMOUNT',
      dataIndex: 'price',
      key: 'price',
      render: price => price > 0 && `${price} SOL`,
    },
    {
      title: 'BUYER',
      dataIndex: 'buyer',
      key: 'buyer',
      render: text =>
        text ? <CopySpan value={shortenAddress(text)} copyText={text} /> : '',
    },
    {
      title: 'SELLER',
      dataIndex: 'seller',
      key: 'seller',
      render: text =>
        text ? <CopySpan value={shortenAddress(text)} copyText={text} /> : '',
    },
  ];

  useEffect(() => {
    if (wallet.publicKey) {
      getNFTsByWallet(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            const result = res['data'];
            setMyItems(result.filter(item => item.price === 0));
            setListedItems(result.filter(item => item.price > 0));
          }
        });

      getTransactionsByWallet(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setTransactions(res['data']);
          }
        });
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    let total = 0;
    listedItems.forEach(item => {
      total += item.price;
    });
    setTotalFloorPrice(total);
  }, [listedItems]);

  const onSubmit = values => {
    console.log(values);
  };

  const onSubmitFailed = () => {};

  const EmptyView = () => {
    return (
      <div className="empty-container">
        <img src="/icons/no-data.svg" width={100} alt="empty" />
        <span>No Items</span>
      </div>
    );
  };

  if (!wallet.connected) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: 'white' }}>
          Connect wallet to see your profile page
        </p>
      </div>
    );
  }

  return (
    <div className="main-area">
      <div className="profile-page">
        <div className="container">
          <div className="profile-info">
            {wallet.publicKey ? (
              <img
                src={`https://avatars.dicebear.com/api/jdenticon/${wallet.publicKey.toBase58()}.svg`}
                className="profile-image"
              />
            ) : (
              <img
                src={`https://avatars.dicebear.com/api/jdenticon/unknown.svg`}
                className="profile-image"
              />
            )}
            {wallet.publicKey && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CopySpan
                  value={shortenAddress(wallet.publicKey.toBase58(), 8)}
                  copyText={wallet.publicKey!.toBase58()}
                  className="wallet-address"
                />
              </div>
            )}
            {wallet.connected ? (
              authToken ? (
                <Button
                  className="profile-button"
                  onClick={() => setVisible(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  className="profile-button"
                  onClick={async () => await authentication()}
                >
                  Sign in
                </Button>
              )
            ) : (
              <ConnectButton className="profile-button" />
            )}
          </div>
          <Row className="profile-details">
            <Col span={12} md={8} lg={6} className="details-container">
              <Statistic
                title="TOTAL FLOOR VALUE"
                value={`${totalFloorPrice > 0 ? totalFloorPrice : '---'} SOL`}
              />
            </Col>
          </Row>
          <Tabs defaultActiveKey="1" className="profile-tabs">
            <TabPane tab="My items" key="1">
              {myItems.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {myItems.map((item, index) => (
                    <Col key={index} span={12} md={8} lg={6} xl={4}>
                      <NFTCard item={item} collection={item.collectionName} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <EmptyView />
              )}
            </TabPane>
            <TabPane tab="Listed items" key="2">
              {listedItems.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {listedItems.map((item, index) => (
                    <Col key={index} span={12} md={8} lg={6} xl={4}>
                      <NFTCard item={item} collection={item.collectionName} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <EmptyView />
              )}
            </TabPane>
            <TabPane tab="Offers made" key="3">
              Offers made - Comming soom
            </TabPane>
            <TabPane tab="Offers received" key="4">
              Offers received - Comming soon
            </TabPane>
            <TabPane tab="Activites" key="5">
              <Table
                columns={columns}
                dataSource={transactions}
                style={{ overflowX: 'auto' }}
                pagination={{ position: ['bottomLeft'], pageSize: 10 }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <MetaplexModal visible={visible} onCancel={() => setVisible(false)}>
        <div className="profile-modal">
          <h1>Profile settings</h1>
          <Form
            form={form}
            layout="vertical"
            requiredMark="optional"
            autoComplete="off"
            onFinish={onSubmit}
            onFinishFailed={onSubmitFailed}
          >
            <Form.Item
              name={['user', 'name']}
              label="Display name"
              required
              tooltip="This is a required field"
              rules={[{ required: true }]}
            >
              <Input placeholder="Display name" value={creator?.info.name} />
            </Form.Item>
            <Form.Item name={['user', 'description']} label="Description">
              <TextArea
                placeholder="Description"
                autoSize={{ minRows: 2, maxRows: 5 }}
                value={creator?.info.description}
              />
            </Form.Item>
            <Form.Item name={['user', 'twitter']} label="Twitter">
              <Input addonBefore="https://" value={creator?.info.twitter} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="submit-button">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </MetaplexModal>
    </div>
  );
};
