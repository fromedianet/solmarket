import React from 'react';
import { CopySpan, ENDPOINT_NAME, shortenAddress } from '@oyster/common';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

export const ActivityColumns = (network: ENDPOINT_NAME) => {
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

  return [
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
};

export const OffersMadeColumns = (props: {
  balance: number;
  onCancel: (p) => void;
  onDeposit: () => void;
}) => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={record.image} width={40} alt="image" />
          <Link
            to={`/item-details/${record.mint}`}
            style={{ cursor: 'pointer', marginLeft: 16 }}
          >
            {record.name}
          </Link>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'bidPrice',
      key: 'status',
      render: price =>
        price > props.balance ? (
          <CloseCircleFilled style={{ color: '#eb2f96', fontSize: 24 }} />
        ) : (
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: 24 }} />
        ),
    },
    {
      title: 'Your offer price',
      dataIndex: 'bidPrice',
      key: 'bidPrice',
      render: price => `${price} SOL`,
    },
    {
      title: 'Current price',
      dataIndex: 'listingPrice',
      key: 'listingPrice',
      render: price => `${price} SOL`,
    },
    {
      title: 'Action',
      dataIndex: 'mint',
      key: 'action',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button onClick={() => props.onCancel(record)}>Cancel</Button>
          {record.bidPrice > props.balance && (
            <Button
              style={{ marginLeft: 8, background: '#009999' }}
              onClick={() => props.onDeposit()}
            >
              Deposit
            </Button>
          )}
        </div>
      ),
    },
  ];
};

export const OffersReceivedColumns = (props: { onAccept: (p) => void }) => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={record.image} width={40} alt="image" />
          <Link
            to={`/item-details/${record.mint}`}
            style={{ cursor: 'pointer', marginLeft: 16 }}
          >
            {record.name}
          </Link>
        </div>
      ),
    },
    {
      title: 'Bidder',
      dataIndex: 'buyer',
      key: 'buyer',
      render: buyer => (
        <CopySpan value={shortenAddress(buyer)} copyText={buyer} />
      ),
    },
    {
      title: 'Offer price',
      dataIndex: 'bidPrice',
      key: 'bidPrice',
      render: price => `${price} SOL`,
    },
    {
      title: 'Current price',
      dataIndex: 'listingPrice',
      key: 'listingPrice',
      render: price => `${price} SOL`,
    },
    {
      title: 'Time',
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: timestamp => timeAgo.format(timestamp * 1000),
    },
    {
      title: 'Action',
      dataIndex: 'mint',
      key: 'action',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            style={{ marginLeft: 8, background: '#009999' }}
            onClick={() => props.onAccept(record)}
          >
            Accept offer
          </Button>
        </div>
      ),
    },
  ];
};
