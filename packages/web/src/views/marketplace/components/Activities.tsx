import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { CopySpan, shortenAddress, useConnectionConfig } from '@oyster/common';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { Transaction } from '../../../models/exCollection';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

export const Activities = (props: { transactions: Transaction[] }) => {
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;

  const getColor = txType => {
    if (txType === 'SALE' || txType === 'Auction Settled') {
      return '#2fc27d';
    } else if (txType === 'PLACE BID' || txType === 'Auction Place Bid') {
      return '#6d79c9';
    } else if (txType === 'LISTING' || txType === 'Auction Created') {
      return '#f8f7f8';
    } else {
      return '#9c93a5';
    }
  };

  const columns = [
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
        <Link
          to={`/item-details/${record.market}/${record.collection}/${record.mint}`}
        >
          {record.name}
        </Link>
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
  return (
    <Table
      columns={columns}
      dataSource={props.transactions}
      style={{ overflowX: 'auto' }}
      pagination={{ position: ['bottomLeft'], pageSize: 10 }}
    />
  );
};
