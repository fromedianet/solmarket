import { CopySpan, shortenAddress } from '@oyster/common';
import React from 'react';
import { Table } from 'antd';
import { Transaction } from '../../../models/exCollection';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

export const Activities = (props: {
  market: string;
  id: string;
  transactions: Transaction[];
}) => {
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
    },
    {
      title: 'TRANSACTION ID',
      dataIndex: 'transaction',
      key: 'transaction',
      render: txId =>
        txId && txId !== '' ? (
          <a
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
            style={{ cursor: 'pointer' }}
          >
            {shortenAddress(txId)}
          </a>
        ) : (
          '...'
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
      render: price => price && price > 0 && `${price / LAMPORTS_PER_SOL} SOL`,
    },
    {
      title: 'MINT ADDRESS',
      dataIndex: 'mint',
      key: 'mint',
      render: text =>
        text ? (
          <CopySpan value={shortenAddress(text)} copyText={text} />
        ) : (
          '...'
        ),
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
