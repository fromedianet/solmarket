import React from 'react';
import { Collapse, Table } from 'antd';
import { CopySpan } from '../../components/CopySpan';
import { shortenAddress } from '@oyster/common';

const { Panel } = Collapse;

const columns = [
  {
    title: '',
    dataIndex: 'img',
    key: 'img',
    render: uri => <img src={uri} width={40} alt="img" />,
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'TRANSACTION ID',
    dataIndex: 'transaction_id',
    key: 'transaction_id',
    render: txId => (
      <a
        href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
        target="_blank"
        rel="noreferrer"
      >
        {shortenAddress(txId)}
      </a>
    ),
  },
  { title: 'TRANSACTION TYPE', dataIndex: 'txType', key: 'txType' },
  { title: 'TIME', dataIndex: 'time', key: 'time' },
  { title: 'TOTAL AMOUNT', dataIndex: 'amount', key: 'amount' },
  {
    title: 'BUYER',
    dataIndex: 'buyer',
    key: 'buyer',
    render: text => (
      <CopySpan value={shortenAddress(text)} copyText={text} className="" />
    ),
  },
  {
    title: 'SELLER',
    dataIndex: 'seller',
    key: 'seller',
    render: text => (
      <CopySpan value={shortenAddress(text)} copyText={text} className="" />
    ),
  },
];

const data = [
  {
    key: 1,
    img: 'https://www.arweave.net/0LGLLlB_4e3IMFhoz2aBW78re1rZ7z1g3_0jjHY0EwE?ext=png',
    name: 'Eye #1',
    transaction_id:
      '3ZY1ivcuo4XjzjtVxNqERCYTAMQAjiccB3rHqhztssZYSoWsnNtrrjt8r3CfnQbQovghNRzymRjX9HkfVR2bsBzb',
    txType: 'Listing',
    time: 'about 1 hour ago',
    amount: '5.5 SOL',
    buyer: '',
    seller: '8BSfryfQ9Qs1MWFWAg58MmB2QAwnLom8LcxtKb4ohT6q',
  },
  {
    key: 2,
    img: 'https://www.arweave.net/0LGLLlB_4e3IMFhoz2aBW78re1rZ7z1g3_0jjHY0EwE?ext=png',
    name: 'Eye #1',
    transaction_id:
      'ANpT42gnLQT6916ouUWmHhxm6CCaom28vMXf5LPmyv1Tta1LrnFYT39hLEt8evjjzc2iDDpVGos1osFa2tbkLgE',
    txType: 'Cancel Listing',
    time: 'about 2 hours ago',
    amount: '',
    buyer: '',
    seller: '8BSfryfQ9Qs1MWFWAg58MmB2QAwnLom8LcxtKb4ohT6q',
  },
  {
    key: 3,
    img: 'https://www.arweave.net/0LGLLlB_4e3IMFhoz2aBW78re1rZ7z1g3_0jjHY0EwE?ext=png',
    name: 'Eye #1',
    transaction_id:
      '32YF4RuEavzLBtVRTwSGxJu5AeSQEMVVxftUxw63DbgPtT3TFRGFidqZWW86qXShxnqBNbYjMTdKqLuqwsmnds7o',
    txType: 'Listing',
    time: 'about 2 days ago',
    amount: '5 SOL',
    buyer: '',
    seller: '8BSfryfQ9Qs1MWFWAg58MmB2QAwnLom8LcxtKb4ohT6q',
  },
  {
    key: 4,
    img: 'https://www.arweave.net/0LGLLlB_4e3IMFhoz2aBW78re1rZ7z1g3_0jjHY0EwE?ext=png',
    name: 'Eye #1',
    transaction_id:
      '3gZED9GjfWWfeFrVnmFcVknpkJmwEauAHNkomyuHmWuDohkVGX74vcqq9jNig7hxNZE6o7i7nHbp9wQemGL3DiCa',
    txType: 'Sale',
    time: 'about 3 days ago',
    amount: '4.5 SOL',
    buyer: '8BSfryfQ9Qs1MWFWAg58MmB2QAwnLom8LcxtKb4ohT6q',
    seller: 'DkTY6fbA3vonUEw4CcoTdTFaBgBDiMXG6BHmBdwhn8xe',
  },
];

export const BottomSection = (props: { offers: [] }) => {
  return (
    <Collapse
      expandIconPosition="right"
      className="art-info bottom-section"
      defaultActiveKey={['activities', 'more']}
    >
      <Panel
        header={props.offers.length > 0 ? 'Offers' : 'No offers yet'}
        key="offers"
        className="bg-secondary"
        extra={<img src="/icons/zap.svg" width={24} alt="offers" />}
      >
        {props.offers.length > 0 && <div>Offers</div>}
      </Panel>
      <Panel
        header="Activities"
        key="activities"
        className="bg-secondary"
        extra={<img src="/icons/price.svg" width={24} alt="activites" />}
      >
        <Table
          columns={columns}
          dataSource={data}
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
