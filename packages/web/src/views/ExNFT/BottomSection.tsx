import React from 'react';
import { Collapse, Table } from 'antd';
import { CopySpan, shortenAddress } from '@oyster/common';
import { Transaction } from '../../models/exCollection';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { Link } from 'react-router-dom';

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const { Panel } = Collapse;

export const BottomSection = (props: {
  transactions: Transaction[];
  market: string;
  price: string;
  mint: string;
}) => {
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
      render: text => (
        <Link to={`/exnft/${props.mint}?market=${props.market}`}>{text}</Link>
      ),
    },
    {
      title: 'TRANSACTION ID',
      dataIndex: 'transaction',
      key: 'transaction',
      render: txId => (
        <a
          href={`https://explorer.solana.com/tx/${txId}?cluster=mainnet-beta`}
          target="_blank"
          rel="noreferrer"
          style={{ cursor: 'pointer' }}
        >
          {shortenAddress(txId)}
        </a>
      ),
    },
    { title: 'TRANSACTION TYPE', dataIndex: 'txType', key: 'txType' },
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
      render: price => `${price / LAMPORTS_PER_SOL} SOL`,
    },
    {
      title: 'BUYER',
      dataIndex: 'buyer',
      key: 'buyer',
      render: text =>
        text ? (
          <CopySpan value={shortenAddress(text)} copyText={text} />
        ) : (
          '...'
        ),
    },
    {
      title: 'SELLER',
      dataIndex: 'seller',
      key: 'seller',
      render: text =>
        text ? (
          <CopySpan value={shortenAddress(text)} copyText={text} />
        ) : (
          '...'
        ),
    },
  ];

  return (
    <Collapse
      expandIconPosition="right"
      className="art-info bottom-section"
      defaultActiveKey={['activities', 'more']}
    >
      <Panel
        header="Activities"
        key="activities"
        className="bg-secondary"
        extra={<img src="/icons/price.svg" width={24} alt="activites" />}
      >
        <Table
          columns={columns}
          dataSource={props.transactions}
          style={{ overflowX: 'auto' }}
          pagination={{ position: ['bottomLeft'] }}
        />
      </Panel>
      <Panel
        header="More from this collection"
        key="more"
        className="bg-secondary"
        extra={
          <img src="/icons/compass.svg" width={24} alt="more collection" />
        }
      ></Panel>
    </Collapse>
  );
};
