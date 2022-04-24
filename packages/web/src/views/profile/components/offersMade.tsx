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

export const OffersMade = ({
  offers,
  balance,
  exBalance,
  loadingBalance,
  callShowEscrow,
  onCancelBid,
  onCancelBidAndWithdraw,
  onDeposit,
  onWithdraw,
}: {
  offers: Offer[];
  balance: number;
  exBalance: number;
  loadingBalance: boolean;
  callShowEscrow: () => void;
  onCancelBid: (a) => void;
  onCancelBidAndWithdraw: (a) => void;
  onDeposit: (a) => void;
  onWithdraw: (a) => void;
}) => {
  const [form] = Form.useForm();
  const { account } = useNativeAccount();
  const mainBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const [cancelVisible, setCancelVisible] = useState(false);
  const [depositVisible, setDepositVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
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
      onDeposit: () => setDepositVisible(true),
    });
    setOffersColumns(columns);
  }, [balance, exBalance, loadingBalance]);

  const menu = (
    <Menu
      items={[
        {
          label: 'Deposit from main wallet',
          key: '0',
          disabled: mainBalance === 0,
          onClick: () => setDepositVisible(true),
        },
        {
          label: 'Withdraw all to main wallet',
          key: '1',
          disabled: balance === 0,
          onClick: () => onWithdraw(balance),
        },
      ]}
    />
  );

  const onFinish = values => {
    const val = values.price.number;
    setDepositVisible(false);
    onDeposit(val);
  };

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
              <MoreOutlined style={{ color: 'white', fontSize: 32 }} />
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
          <span className="header-text">Deposit</span>
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
                    <Button className="button" htmlType="submit">
                      Deposit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label">Main wallet balance</span>
              <span className="wallet-label">{`${mainBalance.toFixed(
                5,
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Bidding wallet balance</span>
              <span className="wallet-label">{`${balance.toFixed(
                5,
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
              <span className="wallet-label">{`${(
                mainBalance - depositValue
              ).toFixed(5)} SOL`}</span>
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
              <span className="wallet-label">{`${(
                balance + depositValue
              ).toFixed(5)} SOL`}</span>
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
    </div>
  );
};
