import {
  ConnectButton,
  CopySpan,
  MetaplexModal,
  shortenAddress,
  useConnection,
  useConnectionConfig,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Statistic, Tabs, Form, Input, Table } from 'antd';
import { useCreator } from '../../hooks';
import { useAuthToken } from '../../contexts/authProvider';
import { useAuthAPI } from '../../hooks/useAuthAPI';
import { useNFTsAPI } from '../../hooks/useNFTsAPI';
import { NFTCard } from '../marketplace/components/Items';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
import { Transaction } from '../../models/exCollection';
import {
  ActivityColumns,
  OffersMadeColumns,
  OffersReceivedColumns,
} from './tableColumns';
import { PriceInput } from '../../components/PriceInput';
import {
  showEscrow,
  cancelBid,
  withdrawFromFee,
} from '../../actions/auctionHouse';
import { Offer } from '../../models/offer';
import { EmptyView } from '../../components/EmptyView';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {
  const wallet = useWallet();
  const { authToken } = useAuthToken();
  const { authentication } = useAuthAPI();
  const { getNFTsByWallet } = useNFTsAPI();
  const [visible, setVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [listedItems, setListedItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [offersMade, setOffersMade] = useState<Offer[]>([]);
  const [offersReceived, setOffersReceived] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [totalFloorPrice, setTotalFloorPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [depositValue, setDepositValue] = useState(0);
  const creator = useCreator(wallet.publicKey?.toBase58());
  const [form] = Form.useForm();
  const connection = useConnection();
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;
  const { getTransactionsByWallet, getOffersMade, getOffersReceived } =
    useTransactionsAPI();

  const activityColumns = ActivityColumns(network);
  const offersMadeColumns = OffersMadeColumns({
    balance: balance,
    onCancel: (data: Offer) => {
      setSelectedOffer(data);
      setCancelVisible(true);
    },
    onDeposit: () => {},
  });

  const offersReceivedColumns = OffersReceivedColumns({
    onReject: (data: Offer) => onCancelBid(data),
    onAccept: () => {},
  });

  useEffect(() => {
    if (wallet.publicKey) {
      showEscrow(connection, wallet.publicKey).then(val => setBalance(val));

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

      getOffersMade(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setOffersMade(res['data']);
          }
        });

      getOffersReceived(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setOffersReceived(res['data']);
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

  const onCancelBid = (offer: Offer) => {
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result = await cancelBid({
          connection,
          wallet,
          offer,
        });
        if (!result['err']) {
          setTimeout(() => {}, 7000);
          resolve('');
        } else {
          reject();
        }
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending: 'Cancel bid now...',
        error: 'Cancel bid rejected.',
        success: 'Cancel bid successed. Your data maybe updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
    );
  };

  const onWithdrawFromFee = (offer: Offer) => {
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result = await withdrawFromFee({
          connection,
          wallet,
          offer,
        });
        if (!result['err']) {
          setTimeout(() => {}, 7000);
          resolve('');
        } else {
          reject();
        }
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending: 'Cancel bid now...',
        error: 'Cancel bid rejected.',
        success: 'Cancel bid successed. Your data maybe updated in a minute',
      },
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      },
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
              <Table
                columns={offersMadeColumns}
                dataSource={offersMade}
                style={{ overflowX: 'auto' }}
                pagination={{ position: ['bottomLeft'], pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab="Offers received" key="4">
              <Table
                columns={offersReceivedColumns}
                dataSource={offersReceived}
                style={{ overflowX: 'auto' }}
                pagination={{ position: ['bottomLeft'], pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab="Activites" key="5">
              <Table
                columns={activityColumns}
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
      <MetaplexModal
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
      >
        <div className="cancel-modal">
          <div className="header-container">
            <img src="/icons/wallet.png" className="header-icon" alt="wallet" />
            <span className="header-text">
              After cancelling your offer, do you want to withdraw funds back to
              your wallet?
            </span>
          </div>
          <div className="body-container">
            <span className="main-text">
              The funds for your offer is held in an escrow account as collatral
              to support multiple offers. If you choose &quot;Keep funds in
              escrow&quot;, you will be able to make offers faster and more
              easily.
            </span>
          </div>
          <Row>
            <Col span={9}>
              <Button onClick={() => onWithdrawFromFee(selectedOffer!)}>
                Withdraw
              </Button>
            </Col>
            <Col span={12}>
              <Button
                style={{ marginLeft: 8, background: '#009999' }}
                onClick={() => onCancelBid(selectedOffer!)}
              >
                Keep funds in escrow
              </Button>
            </Col>
          </Row>
        </div>
      </MetaplexModal>
      <div className="balance-container">
        <Row>
          <Col
            span={24}
            md={12}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <span className="label">
              Account balance:{' '}
              <span style={{ color: '#eb2f96' }}>{`${balance} SOL`}</span>
            </span>
          </Col>
          <Col span={24} md={12}>
            <div className="right-container">
              <div>
                <span className="balance-label">Deposit</span>
                <div className="button-container">
                  <PriceInput
                    placeholder="Price"
                    addonAfter="SOL"
                    className="balance-input"
                    value={{ number: depositValue }}
                    onChange={val => setDepositValue(val.number || 0)}
                  />
                  <span
                    className={`balance-btn ${depositValue <= 0 && 'disabled'}`}
                  >
                    Deposit
                  </span>
                </div>
              </div>
              <div>
                <span className="balance-label">Withdraw</span>
                <div className="button-container">
                  <PriceInput
                    placeholder="Price"
                    addonAfter="SOL"
                    className="balance-input"
                    value={{ number: withdrawValue }}
                    onChange={val => setWithdrawValue(val.number || 0)}
                  />
                  <span
                    className={`balance-btn ${
                      (withdrawValue <= 0 || withdrawValue > balance) &&
                      'disabled'
                    }`}
                  >
                    Withdraw
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
