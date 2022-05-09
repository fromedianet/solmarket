import {
  AUCTION_HOUSE_ID,
  ConnectButton,
  CopySpan,
  formatAmount,
  MetaplexModal,
  notify,
  sendTransaction,
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
import { OffersMade } from './components/offersMade';
import { useInstructionsAPI } from '../../hooks/useInstructionsAPI';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { groupBy } from '../../utils/utils';
import { GroupItem } from './components/groupItem';
import { useMEApis } from '../../hooks/useMEApis';

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
  const { getMultiCollectionEscrowStats } = useCollectionsAPI();
  const meApis = useMEApis();

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

      socket.emit('syncGetNFTsByOwner', {
        wallet: wallet.publicKey.toBase58(),
      });

      socket.on('syncedNFTsByOwner', (params: any) => {
        if (params.wallet === wallet.publicKey?.toBase58()) {
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

      getTransactionsByWallet(wallet.publicKey.toBase58()).then(res => {
        setTransactions(res);
      });

      loadOffersMade().then(res => setOffersMade(res));

      loadOffersReceived().then(res => setOffersReceived(res));
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
      const symbols: string[] = [];
      const res = await getNFTsByWallet(wallet.publicKey.toBase58());
      items1 = res.filter(k => k.price === 0);
      items2 = res.filter(k => k.price > 0);

      const exRes = await meApis.getNFTsByEscrowOwner(
        wallet.publicKey.toBase58(),
      );
      items2 = items2.concat(exRes);

      items1.forEach(k => {
        if (k.symbol && !symbols.includes(k.symbol)) {
          symbols.push(k.symbol);
        }
      });

      items2.forEach(k => {
        if (k.symbol && !symbols.includes(k.symbol)) {
          symbols.push(k.symbol);
        }
      });

      let tempCols: any = {};
      if (symbols.length > 0) {
        const colRes = await getMultiCollectionEscrowStats(symbols);
        tempCols = await meApis.getMultiCollectionEscrowStats(symbols);
        for (const [key, value] of Object.entries(colRes)) {
          if (!(key in tempCols)) {
            tempCols[key] = value;
          }
        }
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
      list = await getOffersMade(wallet.publicKey.toBase58());
      list = list.map((item, index) => ({
        ...item,
        key: index,
      }));
    }
    return list;
  }

  async function loadOffersReceived() {
    let list: Offer[] = [];
    if (wallet.publicKey) {
      list = await getOffersReceived(wallet.publicKey.toBase58());
      list = list.map((item, index) => ({
        ...item,
        key: index,
      }));
    }
    return list;
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
        if (result && 'data' in result) {
          const status = await runInstructions(result['data']);
          if (!status['err']) {
            socket.emit('syncAuctionHouse', {
              wallet: wallet.publicKey!.toBase58(),
            });
            resolve('');
            return;
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
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
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
        if (result && 'data' in result) {
          const status = await runInstructions(result['data']);
          if (!status['err']) {
            socket.emit('syncAuctionHouse', {
              wallet: wallet.publicKey!.toBase58(),
            });
            resolve('');
            return;
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
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
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
        if (result && 'data' in result) {
          const status = await runInstructions(result['data']);
          if (!status['err']) {
            setTimeout(() => {
              callShowEscrow();
            }, 20000);
            resolve('');
            return;
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
        if (result && 'data' in result) {
          const status = await runInstructions(result['data']);
          if (!status['err']) {
            setTimeout(() => {
              callShowEscrow();
            }, 20000);
            resolve('');
            return;
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
        pending:
          'After wallet approval, your transaction will be finished in a few seconds',
        error: 'Something wrong. Please refresh the page and try again.',
        success:
          'Transaction has been successed! Your data will be updated in a minute',
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
      console.log('----- transaction -----', transaction);
      const { txid } = await sendTransaction(
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
