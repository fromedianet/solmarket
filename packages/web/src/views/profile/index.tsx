import {
  AUCTION_HOUSE_ID,
  ConnectButton,
  CopySpan,
  formatAmount,
  MetaplexModal,
  notify,
  sendTransactionWithRetry,
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
import { NFT, Transaction as TransactionModel } from '../../models/exCollection';
import { ActivityColumns, OffersReceivedColumns } from './tableColumns';
import {
  showEscrow,
} from '../../actions/auctionHouse';
import { Offer } from '../../models/offer';
import { toast } from 'react-toastify';
import { useSocket } from '../../contexts/socketProvider';
import { LAMPORTS_PER_SOL, Message, Transaction } from '@solana/web3.js';
import { useExNFT } from '../../hooks/useExNFT';
import { MarketType } from '../../constants';
import { MyItems } from './components/myItems';
import { ListedItems } from './components/listedItems';
import { OffersMade } from './components/offersMade';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {
  const wallet = useWallet();
  const { socket } = useSocket();
  const { authToken, user } = useAuthToken();
  const { authentication, updateUser } = useAuthAPI();
  const { getNFTsByWallet } = useNFTsAPI();
  const { cancelBid, cancelBidAndWithdraw, acceptOffer, deposit, withdraw } = useInstructionsAPI();
  const [visible, setVisible] = useState(false);
  const [myItems, setMyItems] = useState<NFT[]>([]);
  const [listedItems, setListedItems] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [offersMade, setOffersMade] = useState<Offer[]>([]);
  const [offersReceived, setOffersReceived] = useState<Offer[]>([]);
  const [totalFloorPrice, setTotalFloorPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [exBalance, setExBalance] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [form] = Form.useForm();
  const connection = useConnection();
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;
  const { getTransactionsByWallet, getOffersMade, getOffersReceived } =
    useTransactionsAPI();
  const {
    getExNFTsByOwner,
    getExNFTsByEscrowOwner,
    getExGlobalActivities,
    getExEscrowBalance,
  } = useExNFT();

  const activityColumns = ActivityColumns(network);

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

      loadGlobalActivities().then(res => {
        setTransactions(res);
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

  async function loadGlobalActivities() {
    let data: TransactionModel[] = [];
    if (wallet.publicKey) {
      const res: any = await getTransactionsByWallet(
        wallet.publicKey.toBase58(),
      );
      if ('data' in res) {
        data = res['data'];
      }
      const exData: TransactionModel[] = await getExGlobalActivities(
        wallet.publicKey.toBase58(),
        MarketType.MagicEden,
      );
      data = data.concat(exData);
      data.sort((a, b) => b.blockTime - a.blockTime);
    }
    return data;
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

  const callShowEscrow = async () => {
    if (wallet.publicKey) {
      setLoadingBalance(true);
      const val = await showEscrow(connection, wallet.publicKey);
      setBalance(val);

      const val1 = await getExEscrowBalance({
        wallet: wallet.publicKey.toBase58(),
        auctionHouse: '',
        market: MarketType.MagicEden,
      });
      setExBalance(val1);
      setLoadingBalance(false);
    }
  };

  const onCancelBid = (offer: Offer) => {
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await cancelBid({
          buyer: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: offer.mint,
          tokenAccount: offer.tokenAccount,
          tradeState: offer.tradeState,
          price: offer.bidPrice,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              socket.emit('syncAuctionHouse', { wallet: wallet.publicKey!.toBase58() });
              resolve('');
              return;
            }
          }
        }
        reject();
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
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await cancelBidAndWithdraw({
          buyer: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: offer.mint,
          tokenAccount: offer.tokenAccount,
          tradeState: offer.tradeState,
          price: offer.bidPrice,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              socket.emit('syncAuctionHouse', { wallet: wallet.publicKey!.toBase58() });
              resolve('');
              return;
            }
          }
        }
        reject();
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

  async function runInstructions(data: Buffer) {
    let status: any = { err: true };
    try {
      const transaction = Transaction.populate(Message.from(data));
      const { txid } = await sendTransactionWithRetry(
        connection,
        wallet,
        transaction.instructions,
        [],
      );
      
      if (txid) {
        status = await connection.confirmTransaction(txid, 'confirmed');
      }
    } catch (e) {
      console.error('----- runInstructions error ------------', e);
    }
    return status;
  }

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
                <OffersMade
                  offers={offersMade}
                  balance={balance}
                  exBalance={exBalance}
                  loadingBalance={loadingBalance}
                  callShowEscrow={callShowEscrow}
                  onCancelBid={onCancelBid}
                  onCancelBidAndWithdraw={onCancelBidAndWithdraw}
                  onDeposit={onDeposit}
                  onWithdraw={onWithdraw}
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
    </div>
  );
};
