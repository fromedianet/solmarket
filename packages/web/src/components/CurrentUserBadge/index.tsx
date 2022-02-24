import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Button, Popover, Select } from 'antd';
import {
  ENDPOINTS,
  formatNumber,
  formatUSD,
  MetaplexModal,
  Settings,
  shortenAddress,
  useConnectionConfig,
  useNativeAccount,
  useQuerySearch,
  WRAPPED_SOL_MINT,
} from '@oyster/common';
import { useMeta, useSolPrice } from '../../contexts';
import { useTokenList } from '../../contexts/tokenList';
import { TokenCircle } from '../Custom';

('@solana/wallet-adapter-base');

const btnStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  marginTop: '8px',
};

const UserActions = (props: { mobile?: boolean; onClick?: any }) => {
  const { publicKey } = useWallet();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  const pubkey = publicKey?.toBase58() || '';

  const canCreate = useMemo(() => {
    return (
      store?.info?.public ||
      whitelistedCreatorsByCreator[pubkey]?.info?.activated
    );
  }, [pubkey, whitelistedCreatorsByCreator, store]);

  return (
    <>
      {store && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {canCreate && (
            <>
              <Link to={`/collection/create`}>
                <Button
                  onClick={() => {
                    props.onClick ? props.onClick() : null;
                  }}
                  style={btnStyle}
                >
                  Create collection
                </Button>
              </Link>
              <Link to={`/art/create`}>
                <Button
                  onClick={() => {
                    props.onClick ? props.onClick() : null;
                  }}
                  style={btnStyle}
                >
                  Create NFT
                </Button>
              </Link>
            </>
          )}
          <Link to={`/auction/create/0`}>
            <Button
              onClick={() => {
                props.onClick ? props.onClick() : null;
              }}
              style={btnStyle}
            >
              Sell
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

const AddFundsModal = (props: {
  showAddFundsModal: any;
  setShowAddFundsModal: any;
  balance: number;
  publicKey: PublicKey;
}) => {
  return (
    <MetaplexModal
      visible={props.showAddFundsModal}
      onCancel={() => props.setShowAddFundsModal(false)}
      title="Add Funds"
      bodyStyle={{
        alignItems: 'start',
      }}
    >
      <div style={{ maxWidth: '100%' }}>
        <p style={{ color: 'white' }}>
          We partner with <b>FTX</b> to make it simple to start purchasing
          digital collectibles.
        </p>
        <div
          style={{
            width: '100%',
            background: '#242424',
            borderRadius: 12,
            marginBottom: 10,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            justifyContent: 'space-between',
            fontWeight: 700,
          }}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Balance</span>
          <span>
            {formatNumber.format(props.balance)}&nbsp;&nbsp;
            <span
              style={{
                borderRadius: '50%',
                background: 'black',
                display: 'inline-block',
                padding: '1px 4px 4px 4px',
                lineHeight: 1,
              }}
            >
              <img src="/sol.svg" width="10" />
            </span>{' '}
            SOL
          </span>
        </div>
        <p>
          If you have not used FTX Pay before, it may take a few moments to get
          set up.
        </p>
        <Button
          onClick={() => props.setShowAddFundsModal(false)}
          style={{
            background: '#454545',
            borderRadius: 14,
            width: '30%',
            padding: 10,
            height: 'auto',
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            window.open(
              `https://ftx.com/pay/request?coin=SOL&address=${props.publicKey?.toBase58()}&tag=&wallet=sol&memoIsRequired=false`,
              '_blank',
              'resizable,width=680,height=860',
            );
          }}
          style={{
            background: 'black',
            borderRadius: 14,
            width: '68%',
            marginLeft: '2%',
            padding: 10,
            height: 'auto',
            borderColor: 'black',
          }}
        >
          <div
            style={{
              display: 'flex',
              placeContent: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              fontSize: 16,
            }}
          >
            <span style={{ marginRight: 5 }}>Sign with</span>
            <img src="/ftxpay.png" width="80" />
          </div>
        </Button>
      </div>
    </MetaplexModal>
  );
};

export const CurrentUserBadge = (props: {
  showBalance?: boolean;
  showAddress?: boolean;
  iconSize?: number;
}) => {
  const { wallet, publicKey, disconnect } = useWallet();
  const { endpoint } = useConnectionConfig();
  const routerSearchParams = useQuerySearch();
  const { account } = useNativeAccount();
  const solPrice = useSolPrice();
  const [showAddFundsModal, setShowAddFundsModal] = useState<Boolean>(false);
  const [show, setShow] = useState(false);
  const tokenList = useTokenList();
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const balanceInUSD = balance * solPrice;
  const solMintInfo = tokenList.tokenMap.get(WRAPPED_SOL_MINT.toString());

  if (!wallet || !publicKey) {
    return null;
  }

  let name = props.showAddress ? shortenAddress(`${publicKey}`) : '';
  const unknownWallet = wallet as any;
  if (unknownWallet.name && !props.showAddress) {
    name = unknownWallet.name;
  }

  const handleDisconnect = () => {
    setShow(false);
    disconnect();
  };

  return (
    <div className="wallet-container">
      {props.showBalance && (
        <span>
          {formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)} SOL
        </span>
      )}

      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <Settings
            additionalSettings={
              <div className="modal-container">
                <h5>BALANCE</h5>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: 10,
                  }}
                >
                  <TokenCircle
                    iconFile={solMintInfo ? solMintInfo.logoURI : ''}
                  />
                  &nbsp;
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    {formatNumber.format(balance)} SOL
                  </span>
                  &nbsp;
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {formatUSD.format(balanceInUSD)}
                  </span>
                  &nbsp;
                </div>
                <div style={{ width: '100%' }}>
                  <h5>NETWORK</h5>
                  <Select
                    onSelect={network => {
                      routerSearchParams.set('network', network);
                      window.location.href = `${
                        window.location.origin
                      }?${routerSearchParams.toString()}`;
                      console.log(window.location);
                    }}
                    value={endpoint.name}
                    bordered={false}
                    style={{ width: '100%' }}
                  >
                    {ENDPOINTS.map(({ name }) => (
                      <Select.Option value={name} key={name}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: 10,
                  }}
                >
                  <Button onClick={handleDisconnect} style={btnStyle}>
                    Disconnect
                  </Button>
                </div>
                <UserActions onClick={() => setShow(false)} />
              </div>
            }
          />
        }
        visible={show}
        onVisibleChange={() => setShow(prev => !prev)}
      >
        <Button>{name}</Button>
      </Popover>
      <AddFundsModal
        setShowAddFundsModal={setShowAddFundsModal}
        showAddFundsModal={showAddFundsModal}
        publicKey={publicKey}
        balance={balance}
      />
    </div>
  );
};
