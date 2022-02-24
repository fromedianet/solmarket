import React, { useCallback, useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Table,
  Switch,
  Spin,
  Modal,
  Button,
  Input,
  Divider,
} from 'antd';
import { toast } from 'react-toastify';
import { useMeta } from '../../contexts';
import {
  Store,
  WhitelistedCreator,
} from '@oyster/common/dist/lib/models/metaplex/index';
import {
  notify,
  ParsedAccount,
  shortenAddress,
  StringPublicKey,
  useConnection,
  useStore,
  useWalletModal,
  WalletSigner,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { saveAdmin } from '../../actions/saveAdmin';
import { Link } from 'react-router-dom';
import { SetupVariables } from '../../components/SetupVariables';
import { cacheAllAuctions } from '../../actions/cacheAllAuctions';

const { Content } = Layout;
export const AdminView = () => {
  const { store, whitelistedCreatorsByCreator, isLoading } = useMeta();
  const connection = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const connect = useCallback(
    () => (wallet.wallet ? wallet.connect().catch() : setVisible(true)),
    [wallet.wallet, wallet.connect, setVisible],
  );
  const { storeAddress, setStoreForOwner, isConfigured } = useStore();

  useEffect(() => {
    if (
      !store &&
      !storeAddress &&
      wallet.publicKey &&
      !process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS
    ) {
      setStoreForOwner(wallet.publicKey.toBase58());
    }
  }, [store, storeAddress, wallet.publicKey]);

  return (
    <div className="main-area">
      <div className="container">
        {!wallet.connected ? (
          <p>
            <Button type="primary" className="app-btn" onClick={connect}>
              Connect
            </Button>{' '}
            to admin store.
          </p>
        ) : !storeAddress || isLoading ? (
          <Spin />
        ) : store && wallet ? (
          <>
            <InnerAdminView
              store={store}
              whitelistedCreatorsByCreator={whitelistedCreatorsByCreator}
              connection={connection}
              wallet={wallet}
            />
            {!isConfigured && (
              <>
                <Divider />
                <Divider />
                <p>
                  To finish initialization please copy config below into{' '}
                  <b>packages/web/.env</b> and restart yarn or redeploy
                </p>
                <SetupVariables
                  storeAddress={storeAddress}
                  storeOwnerAddress={wallet.publicKey?.toBase58()}
                />
              </>
            )}
          </>
        ) : (
          <>
            <p>Store is not initialized</p>
            <Link to={`/`}>Go to initialize</Link>
          </>
        )}
      </div>
    </div>
  );
};

function ArtistModal({
  setUpdatedCreators,
  uniqueCreatorsWithUpdates,
}: {
  setUpdatedCreators: React.Dispatch<
    React.SetStateAction<Record<string, WhitelistedCreator>>
  >;
  uniqueCreatorsWithUpdates: Record<string, WhitelistedCreator>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAddress, setModalAddress] = useState<string>('');
  return (
    <>
      <Modal
        className={'modal-box'}
        title="Add New Artist Address"
        visible={modalOpen}
        onOk={() => {
          const addressToAdd = modalAddress;
          setModalAddress('');
          setModalOpen(false);

          if (uniqueCreatorsWithUpdates[addressToAdd]) {
            notify({
              message: 'Artist already added!',
              type: 'error',
            });
            return;
          }

          let address: StringPublicKey;
          try {
            address = addressToAdd;
            setUpdatedCreators(u => ({
              ...u,
              [modalAddress]: new WhitelistedCreator({
                address,
                activated: true,
              }),
            }));
          } catch {
            notify({
              message: 'Only valid Solana addresses are supported',
              type: 'error',
            });
          }
        }}
        onCancel={() => {
          setModalAddress('');
          setModalOpen(false);
        }}
      >
        <Input
          autoFocus
          value={modalAddress}
          onChange={e => setModalAddress(e.target.value)}
        />
      </Modal>
      <Button onClick={() => setModalOpen(true)} className="admin-btn">
        Add Creator
      </Button>
    </>
  );
}

function InnerAdminView({
  store,
  whitelistedCreatorsByCreator,
  connection,
  wallet,
}: {
  store: ParsedAccount<Store>;
  whitelistedCreatorsByCreator: Record<
    string,
    ParsedAccount<WhitelistedCreator>
  >;
  connection: Connection;
  wallet: WalletSigner;
}) {
  const [newStore, setNewStore] = useState(
    store && store.info && new Store(store.info),
  );
  const [updatedCreators, setUpdatedCreators] = useState<
    Record<string, WhitelistedCreator>
  >({});
  const [loading, setLoading] = useState<boolean>();
  const state = useMeta();

  const uniqueCreators = Object.values(whitelistedCreatorsByCreator).reduce(
    (acc: Record<string, WhitelistedCreator>, e) => {
      acc[e.info.address] = e.info;
      return acc;
    },
    {},
  );

  const uniqueCreatorsWithUpdates = { ...uniqueCreators, ...updatedCreators };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (val: StringPublicKey) => <span>{val}</span>,
      key: 'address',
    },
    {
      title: 'Activated',
      dataIndex: 'activated',
      key: 'activated',
      render: (
        value: boolean,
        record: {
          address: StringPublicKey;
          activated: boolean;
          name: string;
          key: string;
        },
      ) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={value}
          onChange={val =>
            setUpdatedCreators(u => ({
              ...u,
              [record.key]: new WhitelistedCreator({
                activated: val,
                address: record.address,
              }),
            }))
          }
        />
      ),
    },
  ];

  return (
    <Content className={'admin-content'}>
      <Col style={{ marginTop: 10 }}>
        <Row>
          <Col span={21}>
            <ArtistModal
              setUpdatedCreators={setUpdatedCreators}
              uniqueCreatorsWithUpdates={uniqueCreatorsWithUpdates}
            />
            <Button
              onClick={async () => {
                // eslint-disable-next-line no-async-promise-executor
                const resolveWithData = new Promise(async (resolve, reject) => {
                  try {
                    await saveAdmin(
                      connection,
                      wallet,
                      newStore.public,
                      Object.values(updatedCreators),
                    );
                    resolve('');
                  } catch (e) {
                    reject(e);
                  }
                });

                toast.promise(
                  resolveWithData,
                  {
                    pending: 'Saving info...',
                    error: 'Saving rejected.',
                    success: 'saving successed.',
                  },
                  {
                    position: 'top-center',
                    theme: 'dark',
                    autoClose: 6000,
                    hideProgressBar: false,
                    pauseOnFocusLoss: false,
                  },
                );
              }}
              type="primary"
              className="admin-btn"
            >
              Submit
            </Button>
          </Col>
          <Col span={3}>
            <Switch
              checkedChildren="Public"
              unCheckedChildren="Whitelist Only"
              checked={newStore.public}
              onChange={val => {
                setNewStore(() => {
                  const newS = new Store(store.info);
                  newS.public = val;
                  return newS;
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Table
            className="artist-whitelist-table"
            columns={columns}
            dataSource={Object.keys(uniqueCreatorsWithUpdates).map(key => ({
              key,
              address: uniqueCreatorsWithUpdates[key].address,
              activated: uniqueCreatorsWithUpdates[key].activated,
              name:
                uniqueCreatorsWithUpdates[key].name ||
                shortenAddress(uniqueCreatorsWithUpdates[key].address),
              image: uniqueCreatorsWithUpdates[key].image,
            }))}
          ></Table>
        </Row>
      </Col>

      <Col>
        <p style={{ marginTop: '30px' }}>
          Upgrade the performance of your existing auctions.
        </p>
        <Row>
          <Button
            disabled={loading}
            className="admin-btn"
            onClick={async () => {
              setLoading(true);
              await cacheAllAuctions(wallet, connection, state);
              setLoading(false);
            }}
          >
            {loading ? <Spin /> : <span>Upgrade Auction Performance</span>}
          </Button>
        </Row>
      </Col>
    </Content>
  );
}
