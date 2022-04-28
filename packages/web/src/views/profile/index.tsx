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
import { Transaction as TransactionModel } from '../../models/exCollection';
import { ActivityColumns, OffersReceivedColumns } from './tableColumns';
import { showEscrow } from '../../actions/showEscrow';
import { Offer } from '../../models/offer';
import { toast } from 'react-toastify';
import { useSocket } from '../../contexts/socketProvider';
import { Message, Transaction } from '@solana/web3.js';
import { useExNftAPI } from '../../hooks/useExNftAPI';
import { MarketType } from '../../constants';
import { OffersMade } from './components/offersMade';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { useMECollectionsAPI } from '../../hooks/useMECollectionsAPI';
import { groupBy } from '../../utils/utils';
import { GroupItem } from './components/groupItem';

const { TabPane } = Tabs;
const { TextArea } = Input;

export const ProfileView = () => {
  const wallet = useWallet();
  const { socket } = useSocket();
  const { authToken, user } = useAuthToken();
  const [visible, setVisible] = useState(false);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [listedItems, setListedItems] = useState<any[]>([]);
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
  const { authentication, updateUser } = useAuthAPI();
  const { getNFTsByWallet } = useNFTsAPI();
  const { cancelBid, acceptOffer, deposit, withdraw } = useInstructionsAPI();
  const { getTransactionsByWallet, getOffersMade, getOffersReceived } =
    useTransactionsAPI();
  const {
    getExNFTsByOwner,
    getExNFTsByEscrowOwner,
    getExGlobalActivities,
    getExEscrowBalance,
  } = useExNftAPI();
  const { getMultiCollectionEscrowStats } = useCollectionsAPI();
  const { getMEMultiCollectionEscrowStats, getMEBiddingQuery } =
    useMECollectionsAPI();

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

      loadOffersMade().then(res => setOffersMade(res));

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
    const result1: any[] = [];
    const result2: any[] = [];
    let total = 0;
    if (wallet.publicKey) {
      let items1: any[] = [];
      let items2: any[] = [];
      const symbols1: string[] = [];
      const symbols2: string[] = [];
      const res: any = await getNFTsByWallet(wallet.publicKey.toBase58());
      if ('data' in res) {
        res['data'].forEach(k => {
          if (k && !symbols1.includes(k)) {
            symbols1.push(k);
          }
        });
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

      const exTemp = exRes1.concat(exRes2);
      exTemp.forEach(k => {
        if (k.symbol && !symbols2.includes(k.symbol)) {
          symbols2.push(k.symbol);
        }
      });

      let tempCols: any = {};
      if (symbols1.length > 0) {
        const colRes: any = await getMultiCollectionEscrowStats(symbols1);
        if ('data' in colRes) {
          tempCols = colRes['data'];
        }
      }
      if (symbols2.length > 0) {
        const colRes = await getMEMultiCollectionEscrowStats({
          market: MarketType.MagicEden,
          symbols: symbols2,
        });
        tempCols = {
          ...tempCols,
          ...colRes,
        };
      }

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

      const group1 = groupBy(items1, k => k.symbol);
      const group2 = groupBy(items2, k => k.symbol);

      group1.forEach((val, key) => {
        let col: any = {};
        if (key in tempCols) {
          col = tempCols[key];
          col['items'] = val.length;
          col['totalFloorPrice'] = col['floorPrice'] * val.length;
        } else {
          col = {
            symbol: val[0].symbol,
            name: val[0].collectionName,
            image: val[0].image,
            items: val.length,
            floorPrice: 0,
            totalFloorPrice: 0,
          };
        }

        total += col['totalFloorPrice'];

        result1.push({
          collection: col,
          nfts: val,
        });
      });

      group2.forEach((val, key) => {
        let col: any = {};

        if (key in tempCols) {
          col = tempCols[key];
          col['items'] = val.length;
          col['totalFloorPrice'] = col['floorPrice'] * val.length;
        } else {
          col = {
            symbol: val[0].symbol,
            name: val[0].collectionName,
            image: val[0].image,
            items: val.length,
            floorPrice: 0,
            totalFloorPrice: 0,
          };
        }

        total += col['totalFloorPrice'];
        result2.push({
          collection: col,
          nfts: val,
        });
      });
    }
    setTotalFloorPrice(total);
    return {
      myItems: result1,
      listedItems: result2,
    };
  }

  async function loadOffersMade() {
    let list: Offer[] = [];
    if (wallet.publicKey) {
      const res1: any = await getOffersMade(wallet.publicKey.toBase58());
      if ('data' in res1) {
        list = res1['data'];
      }

      const query = {
        $match: {
          bidderPubkey: wallet.publicKey.toBase58(),
        },
        $sort: { createdAt: -1 },
      };

      const params = `?q=${encodeURI(JSON.stringify(query))}`;

      const res2 = await getMEBiddingQuery({
        market: MarketType.MagicEden,
        params: params,
      });

      list = list.concat(res2);
    }
    return list;
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
          tradeState: offer.tradeState!,
          price: offer.bidPrice,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              socket.emit('syncAuctionHouse', {
                wallet: wallet.publicKey!.toBase58(),
              });
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
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await acceptOffer({
          buyer: offer.buyer,
          seller: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: offer.mint,
          tokenAccount: offer.tokenAccount,
          bidPrice: offer.bidPrice,
          listPrice: offer.listingPrice,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              socket.emit('syncAuctionHouse', {
                wallet: wallet.publicKey!.toBase58(),
              });
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
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await deposit({
          pubkey: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          amount: amount,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              setTimeout(() => {
                callShowEscrow();
              }, 15000);
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
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await withdraw({
          pubkey: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          amount: amount,
        });
        if ('data' in result) {
          const data = result['data']['data'];
          if (data) {
            const status = await runInstructions(data);
            if (!status['err']) {
              setTimeout(() => {
                callShowEscrow();
              }, 15000);
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
            <Col span={6} style={{ alignSelf: 'center' }}>
              <button
                onClick={() => setRefresh(Date.now())}
                style={{
                  background: 'transparent',
                  border: 'none',
                  marginLeft: 24,
                }}
                disabled={loading}
              >
                {loading ? (
                  <Spin />
                ) : (
                  <img
                    src="/icons/refresh.svg"
                    style={{ width: 24, height: 24 }}
                  />
                )}
              </button>
            </Col>
          </Row>
          {!loading && (
            <Tabs defaultActiveKey="2" className="profile-tabs">
              <TabPane tab="My items" key="1">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {myItems.map((item, index) => (
                    <GroupItem key={index} item={item} />
                  ))}
                </div>
              </TabPane>
              <TabPane tab="Listed items" key="2">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {listedItems.map((item, index) => (
                    <GroupItem key={index} item={item} />
                  ))}
                </div>
              </TabPane>
              <TabPane tab="Offers made" key="3">
                <OffersMade
                  offers={offersMade}
                  balance={balance}
                  exBalance={exBalance}
                  loadingBalance={loadingBalance}
                  callShowEscrow={callShowEscrow}
                  onCancelBid={onCancelBid}
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
