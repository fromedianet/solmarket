import React from 'react';
import { Collapse, Table } from 'antd';
import { CopySpan, shortenAddress, useConnectionConfig } from '@oyster/common';
import { NFT, Transaction } from '../../models/exCollection';
import TimeAgo from 'javascript-time-ago';
import { HorizontalGrid } from '../../components/HorizontalGrid';
import en from 'javascript-time-ago/locale/en.json';
import { NFTCard } from '../marketplace/components/Items';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const { Panel } = Collapse;

export const BottomSection = (props: {
  transactions: Transaction[];
  nft: NFT;
  nftList: NFT[];
}) => {
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;

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
        {props.transactions.length > 0 && (
          <Table
            columns={columns}
            dataSource={props.transactions}
            style={{ overflowX: 'auto' }}
            pagination={{ position: ['bottomLeft'], pageSize: 10 }}
          />
        )}
      </Panel>
      <Panel
        header="More from this collection"
        key="more"
        className="bg-secondary"
        extra={
          <img src="/icons/compass.svg" width={24} alt="more collection" />
        }
      >
        {props.nftList.length > 0 && (
          <HorizontalGrid
            childrens={props.nftList.map((item, index) => (
              <NFTCard
                key={index}
                itemId={`${index}`}
                item={item}
                market={item.market}
                collection={props.nft.collectionName}
                className="w-250"
              />
            ))}
          />
        )}
      </Panel>
    </Collapse>
  );
};
