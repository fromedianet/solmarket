import React, { useEffect, useState } from 'react';
import {
  Dropdown,
  Menu,
  Spin,
  Row,
  Col,
  Button,
  Table,
  Form,
  Divider,
} from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { formatAmount, MetaplexModal, useNativeAccount } from '@oyster/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { OffersMadeColumns } from '../tableColumns';
import { Offer } from '../../../models/offer';
import { PriceInput } from '../../../components/PriceInput';
import { Link } from 'react-router-dom';
import { MarketType } from '../../../constants';

export const OffersMade = ({
  offers,
  balance,
  exBalance,
  loadingBalance,
  callShowEscrow,
  onCancelBid,
  onDeposit,
  onWithdraw,
}: {
  offers: Offer[];
  balance: number;
  exBalance: number;
  loadingBalance: boolean;
  callShowEscrow: () => void;
  onCancelBid: (a) => void;
  onDeposit: (a, b) => void;
  onWithdraw: (a, b) => void;
}) => {
  const [form] = Form.useForm();
  const { account } = useNativeAccount();
  const mainBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const [cancelVisible, setCancelVisible] = useState(false);
  const [depositVisible, setDepositVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [selectedMarket, setSelectedMarket] = useState<string | undefined>();
  const [depositValue, setDepositValue] = useState(0);
  const [offersColumns, setOffersColumns] = useState<any>();

  useEffect(() => {
    const columns = OffersMadeColumns({
      balance: balance,
      exBalance: exBalance,
      onCancel: (data: Offer) => {
        setSelectedOffer(data);
        setCancelVisible(true);
      },
      onDeposit: (data: Offer) => {
        let val = 0;
        if (data.market) {
          val = data.bidPrice - exBalance;
        } else {
          val = data.bidPrice - balance;
        }
        setDepositValue(val);
        setSelectedMarket(data.market);
        form.setFieldsValue({
          price: { number: val },
        });
        setDepositVisible(true);
      },
    });
    setOffersColumns(columns);
  }, [balance, exBalance, loadingBalance]);

  const onFinish = values => {
    const val = values.price.number;
    setDepositVisible(false);
    onDeposit(val, selectedOffer);
  };

  const menu = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet',
          key: '0',
          disabled: mainBalance === 0,
          onClick: () => {
            setSelectedMarket(undefined);
            setDepositValue(0);
            form.setFieldsValue({
              price: { number: 0 },
            });
            setDepositVisible(true);
          },
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
          disabled: balance === 0,
          onClick: () => onWithdraw(balance, undefined),
        },
      ]}
    />
  );

  const exMenu = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet (ME)',
          key: '0',
          disabled: mainBalance === 0,
          onClick: () => {
            setSelectedMarket(MarketType.MagicEden);
            setDepositValue(0);
            form.setFieldsValue({
              price: { number: 0 },
            });
            setDepositVisible(true);
          },
        },
        {
          label: 'Withdraw all to main wallet (ME)',
          key: '1',
          disabled: exBalance === 0,
          onClick: () => onWithdraw(exBalance, MarketType.MagicEden),
        },
      ]}
    />
  );

  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      if (value.number > mainBalance) {
        return Promise.reject(
          new Error('Price must be less than main wallet balance!'),
        );
      } else {
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error('Price must be greater than zero!'));
  };

  return (
    <div className="offers-made">
      <div className="wallet-container">
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} />
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Bidding Wallet</span>
            <span className="wallet-price">{`${formatAmount(
              balance,
              2,
              true,
            )} ◎`}</span>
          </div>
          <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <MoreOutlined style={{ color: 'white', fontSize: 24 }} />
            </a>
          </Dropdown>
        </div>
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} />
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Bidding Wallet (ME)</span>
            <span className="wallet-price">{`${formatAmount(
              exBalance,
              2,
              true,
            )} ◎`}</span>
          </div>
          <Dropdown overlay={exMenu} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <MoreOutlined style={{ color: 'white', fontSize: 24 }} />
            </a>
          </Dropdown>
        </div>
        <div className="wallet-content">
          <div className="wallet-icon">
            <img src="/icons/sol.svg" style={{ width: 20, height: 20 }} />
          </div>
          <div className="wallet-info">
            <span className="wallet-name">Main Wallet</span>
            <span className="wallet-price">{`${formatAmount(
              mainBalance,
              2,
              true,
            )} ◎`}</span>
          </div>
        </div>
        <button
          onClick={callShowEscrow}
          className="balance-btn"
          disabled={loadingBalance}
        >
          {loadingBalance ? (
            <Spin />
          ) : (
            <img src="/icons/refresh.svg" style={{ width: 24, height: 24 }} />
          )}
        </button>
      </div>
      {offersColumns && (
        <Table
          columns={offersColumns}
          dataSource={offers}
          style={{ overflowX: 'auto' }}
          pagination={{ position: ['bottomLeft'], pageSize: 10 }}
        />
      )}
      <MetaplexModal
        className="deposit-modal"
        visible={depositVisible}
        onCancel={() => setDepositVisible(false)}
      >
        <div>
          <span className="header-text">
            {selectedMarket ? 'Deposit (ME)' : 'Deposit'}
          </span>
          <div className="body-container">
            <span className="description">
              You&apos;re about to deposit SOL from your main wallet into the
              bidding wallet.
            </span>
            <Form form={form} layout="inline" onFinish={onFinish}>
              <Row style={{ width: '100%' }}>
                <Col span={18}>
                  <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                    <PriceInput
                      addonAfter="SOL"
                      onChange={val => setDepositValue(val.number || 0)}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button
                      className="button"
                      htmlType="submit"
                      disabled={depositValue === 0}
                    >
                      Deposit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label">Main wallet balance</span>
              <span className="wallet-label">{`${parseFloat(
                mainBalance.toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Bidding wallet balance</span>
              <span className="wallet-label">{`${parseFloat(
                (selectedMarket ? exBalance : balance).toFixed(5),
              )} SOL`}</span>
            </div>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label">
                New main wallet balance{' '}
                {depositValue > 0 ? (
                  <span style={{ color: '#ffaa00' }}>{` -${formatAmount(
                    depositValue,
                  )} SOL`}</span>
                ) : (
                  ''
                )}
              </span>
              <span className="wallet-label">{`${parseFloat(
                (mainBalance - depositValue).toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">
                New bidding wallet balance{' '}
                {depositValue > 0 ? (
                  <span style={{ color: '#00db80' }}>{` +${formatAmount(
                    depositValue,
                  )} SOL`}</span>
                ) : (
                  ''
                )}
              </span>
              <span className="wallet-label">{`${parseFloat(
                ((selectedMarket ? exBalance : balance) + depositValue).toFixed(
                  5,
                ),
              )} SOL`}</span>
            </div>
            <span className="bottom-label">
              By selecting &quot;Deposit&quot;, you agree to{' '}
              <Link to="" style={{ fontWeight: 600 }}>
                Terms of Service
              </Link>
            </span>
          </div>
        </div>
      </MetaplexModal>
      <MetaplexModal
        className="cancel-modal"
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
      >
        <div>
          <span className="header-text">
            {selectedOffer?.market
              ? 'Cancel the offer (ME)'
              : 'Cancel the offer'}
          </span>
          <div className="body-container">
            <span className="description">
              When your offer is canceled, the funds will remain in your bidding
              wallet until you withdraw them. This is to allow your other bids
              to remain open and prevent them from becoming invalid. When
              you&apos;re ready to withdraw the funds from your bidding wallet,
              you can do so from the &apos;Offers Made&apos; page of your
              profile.
            </span>
            <Button
              className="button"
              onClick={() => {
                setCancelVisible(false);
                onCancelBid(selectedOffer!);
              }}
            >
              Cancel offer
            </Button>
            <span className="nft-name" style={{ marginTop: 24 }}>
              {`${selectedOffer?.name} ${selectedOffer?.market ? `(ME)` : ''}`}
            </span>
            <span className="nft-symbol">
              {selectedOffer?.symbol}
              <img
                src="/icons/check.svg"
                style={{ width: 14, height: 14, marginLeft: 8 }}
              />
            </span>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label text-gray">Buy now price</span>
              <span className="wallet-label text-gray">{`${parseFloat(
                (selectedOffer?.listingPrice || 0).toFixed(5),
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Your offer</span>
              <span className="wallet-label">{`${parseFloat(
                (selectedOffer?.bidPrice || 0).toFixed(5),
              )} SOL`}</span>
            </div>
            <span className="bottom-label">
              By selecting &quot;Cancel offer&quot;, you agree to{' '}
              <Link to="" style={{ fontWeight: 600 }}>
                Terms of Service
              </Link>
            </span>
          </div>
        </div>
      </MetaplexModal>
    </div>
  );
};
