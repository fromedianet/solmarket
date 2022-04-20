import {
  ConnectButton,
  CopySpan,
  formatAmount,
  MetaplexModal,
  notify,
  shortenAddress,
  useConnection,
  useConnectionConfig,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  Statistic,
  Tabs,
  Form,
  Input,
  Table,
  Spin,
} from 'antd';
import { useAuthToken } from '../../contexts/authProvider';
import { useAuthAPI } from '../../hooks/useAuthAPI';
import { useNFTsAPI } from '../../hooks/useNFTsAPI';
import { useTransactionsAPI } from '../../hooks/useTransactionsAPI';
import { NFT, Transaction } from '../../models/exCollection';
import {
  ActivityColumns,
  OffersMadeColumns,
  OffersReceivedColumns,
} from './tableColumns';
import { PriceInput } from '../../components/PriceInput';
import {
  showEscrow,
  cancelBid,
  cancelBidAndWithdraw,
  acceptOffer,
  withdraw,
  deposit,
} from '../../actions/auctionHouse';
import { Offer } from '../../models/offer';
import { toast } from 'react-toastify';
import { useSocket } from '../../contexts/socketProvider';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useExNFT } from '../../hooks/useExNFT';
import { MarketType } from '../../constants';
import { MyItems } from './components/myItems';
import { ListedItems } from './components/listedItems';
import { OffersMade } from './components/offersMade';

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {
  const wallet = useWallet();
  const { socket } = useSocket();
  const { authToken, user } = useAuthToken();
  const { authentication, updateUser } = useAuthAPI();
  const { getNFTsByWallet } = useNFTsAPI();
  const [visible, setVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [myItems, setMyItems] = useState<NFT[]>([]);
  const [listedItems, setListedItems] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [offersMade, setOffersMade] = useState<Offer[]>([]);
  const [offersReceived, setOffersReceived] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [totalFloorPrice, setTotalFloorPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [depositValue, setDepositValue] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [form] = Form.useForm();
  const connection = useConnection();
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;
  const { getTransactionsByWallet, getOffersMade, getOffersReceived } =
    useTransactionsAPI();
  const { getExNFTsByOwner, getExNFTsByEscrowOwner } = useExNFT();

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
    onAccept: (data: Offer) => onAcceptOffer(data),
  });

  useEffect(() => {
    if (socket && wallet.publicKey) {
      socket.on('syncedAuctionHouse', (params: any[]) => {
        if (params.some(k => k.wallet === wallet.publicKey!.toBase58())) {
          setRefresh(Date.now());
        }
      });

      socket.on('syncedAcceptOffer', params => {
        if (params.some(k => k.wallet === wallet.publicKey!.toBase58())) {
          setRefresh(Date.now());
        }
      });
    }
  }, [socket, wallet]);

  useEffect(() => {
    if (wallet.publicKey) {
      setLoading(true);
      callShowEscrow();

      loadNFTs()
        .then(res => {
          setMyItems(res.myItems);
          setListedItems(res.listedItems);
        })
        .finally(() => setLoading(false));

      getTransactionsByWallet(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if ('data' in res) {
            setTransactions(res['data']);
          }
        });

      getOffersMade(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if ('data' in res) {
            setOffersMade(res['data']);
          }
        });

      getOffersReceived(wallet.publicKey.toBase58())
        // @ts-ignore
        .then((res: {}) => {
          if ('data' in res) {
            setOffersReceived(res['data']);
          }
        });
    }
  }, [wallet.publicKey, refresh]);

  useEffect(() => {
    let total = 0;
    listedItems.forEach(item => {
      total += item.price;
    });
    setTotalFloorPrice(total);
  }, [listedItems]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        bio: user.bio,
      });
    }
  }, [user]);

  async function loadNFTs() {
    let items1: any[] = [];
    let items2: any[] = [];
    if (wallet.publicKey) {
      const res: any = await getNFTsByWallet(wallet.publicKey.toBase58());
      if ('data' in res) {
        items1 = res['data'].filter(k => k.price === 0);
        items2 = res['data'].filter(k => k.price > 0);
      }

      const exRes1 = await getExNFTsByOwner(
        wallet.publicKey.toBase58(),
        MarketType.MagicEden,
      );
      items1 = items1.concat(exRes1);
      const exRes2 = await getExNFTsByEscrowOwner(
        wallet.publicKey.toBase58(),
        MarketType.MagicEden,
      );
      items2 = items2.concat(exRes2);

      items1 = items1.map(item => ({
        ...item,
        symbol: item.symbol || 'undefined',
        collectionName: item.collectionName || 'undefined',
      }));

      items2 = items2.map(item => ({
        ...item,
        symbol: item.symbol || 'undefined',
        collectionName: item.collectionName || 'undefined',
      }));
    }

    return {
      myItems: items1,
      listedItems: items2,
    };
  }

  const onSubmit = values => {
    const displayName = values.displayName || '';
    const username = values.username || '';
    const email = values.email || '';
    const bio = values.bio || '';

    if (checkUpdatedInfo(displayName, username, email, bio)) {
      updateUser({
        displayName,
        username,
        email,
        bio,
      }).then((res: any) => {
        notify({
          message: `Your profile is saved. ${
            res.email && !res.emailVerified
              ? 'Please check email inbox to verify your email.'
              : ''
          }`,
          type: 'success',
        });
      });
    }
  };

  function checkUpdatedInfo(displayName, username, email, bio) {
    if (
      user?.displayName === displayName &&
      user?.username === username &&
      user?.email === email &&
      user?.bio === bio
    ) {
      return false;
    }
    return true;
  }

  const callShowEscrow = () => {
    if (wallet.publicKey) {
      setLoadingBalance(true);
      showEscrow(connection, wallet.publicKey)
        .then(val => {
          setBalance(val);
        })
        .finally(() => setLoadingBalance(false));
    }
  };

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
          socket.emit('syncAuctionHouse', { wallet: wallet.publicKey! });
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

  const onCancelBidAndWithdraw = (offer: Offer) => {
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result = await cancelBidAndWithdraw({
          connection,
          wallet,
          offer,
        });
        if (!result['err']) {
          socket.emit('syncAuctionHouse', { wallet: wallet.publicKey! });
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

  const onAcceptOffer = (offer: Offer) => {
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result = await acceptOffer({
          connection,
          wallet,
          offer,
        });
        if (!result['err']) {
          socket.emit('acceptOffer', {
            bookKeeper: wallet.publicKey!.toBase58(),
            buyer: offer.buyer,
            mint: offer.mint,
            price: offer.bidPrice * LAMPORTS_PER_SOL,
          });
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
        pending: 'Accept offer now...',
        error: 'Accept offer rejected.',
        success: 'Accept offer successed. Your data maybe updated in a minute',
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

  const onDeposit = (amount: number) => {
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result = await deposit({
          connection,
          wallet,
          amount,
        });
        if (!result['err']) {
          setTimeout(() => {
            callShowEscrow();
          }, 15000);
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
        pending: 'Deposit now...',
        error: 'Deposit rejected.',
        success: 'Deposit successed. Your data maybe updated in a minute',
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

  const onWithdraw = (amount: number) => {
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result = await withdraw({
          connection,
          wallet,
          amount,
        });
        if (!result['err']) {
          setTimeout(() => {
            callShowEscrow();
          }, 15000);
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
        pending: 'Withdraw now...',
        error: 'Withdraw rejected.',
        success: 'Withdraw successed. Your data maybe updated in a minute',
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
          <div className="profile-area">
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
            {user?.displayName && <h1>{user.displayName}</h1>}
            {wallet.publicKey && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user?.username && (
                  <CopySpan
                    value={`@${user.username}`}
                    copyText={user.username}
                    className="username"
                  />
                )}
                <CopySpan
                  value={shortenAddress(wallet.publicKey.toBase58(), 8)}
                  copyText={wallet.publicKey.toBase58()}
                  className="wallet-address"
                />
              </div>
            )}
            {user?.bio && <p className="description">{user.bio}</p>}
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
                value={`${
                  totalFloorPrice > 0
                    ? formatAmount(totalFloorPrice, 2, true)
                    : '--'
                } SOL`}
              />
            </Col>
          </Row>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Tabs defaultActiveKey="2" className="profile-tabs">
              <TabPane tab="My items" key="1">
                <MyItems items={myItems} />
              </TabPane>
              <TabPane tab="Listed items" key="2">
                <ListedItems items={listedItems} />
              </TabPane>
              <TabPane tab="Offers made" key="3">
                <OffersMade />
                {/* <Table
                  columns={offersMadeColumns}
                  dataSource={offersMade}
                  style={{ overflowX: 'auto' }}
                  pagination={{ position: ['bottomLeft'], pageSize: 10 }}
                /> */}
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
          )}
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
          >
            <Form.Item
              name="displayName"
              label="Display name"
              rules={[{ min: 3, max: 50 }]}
            >
              <Input value={user?.displayName || ''} />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { min: 3, max: 20, pattern: new RegExp('^[a-zA-Z0-9]{3,20}$') },
              ]}
            >
              <Input value={user?.username || ''} />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
              <Input value={user?.email || ''} />
            </Form.Item>
            <Form.Item name="bio" label="Bio">
              <TextArea
                autoSize={{ minRows: 5, maxRows: 5 }}
                value={user?.bio || ''}
              />
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
              <Button
                onClick={() => {
                  setCancelVisible(false);
                  onCancelBidAndWithdraw(selectedOffer!);
                }}
              >
                Withdraw
              </Button>
            </Col>
            <Col span={12}>
              <Button
                style={{ marginLeft: 8, background: '#009999' }}
                onClick={() => {
                  setCancelVisible(false);
                  onCancelBid(selectedOffer!);
                }}
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
            <button
              onClick={callShowEscrow}
              className="balance-btn"
              disabled={loadingBalance}
            >
              {loadingBalance ? (
                <Spin />
              ) : (
                <img
                  src="/icons/refresh.svg"
                  style={{ width: 16, height: 16 }}
                />
              )}
            </button>
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
                  <button
                    className="balance-btn"
                    disabled={depositValue <= 0}
                    onClick={() => onDeposit(depositValue)}
                  >
                    Deposit
                  </button>
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
                  <button
                    className="balance-btn"
                    disabled={withdrawValue <= 0 || withdrawValue > balance}
                    onClick={() => onWithdraw(withdrawValue)}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
