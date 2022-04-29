import React from 'react';
import { CopySpan, ENDPOINT_NAME, shortenAddress } from '@oyster/common';
import { Link } from 'react-router-dom';
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
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
      render: uri => (
        <img
          src={uri}
          style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }}
          alt="image"
        />
      ),
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a
          href={
            record.market
              ? `/exnft/${record.mint}?market=${record.market}`
              : `/item-details/${record.mint}`
          }
          style={{ cursor: 'pointer' }}
        >
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
      render: (text, record) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: getColor(record.txType) }}>
            {record.txType}
          </span>
          {record.market && <span style={{ color: '#e93a88' }}>(ME)</span>}
        </div>
      ),
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
      title: 'MINT ADDRESS',
      dataIndex: 'mint',
      key: 'mint',
      render: mint => <CopySpan value={shortenAddress(mint)} copyText={mint} />,
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
  exBalance: number;
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
          <img
            src={record.image}
            style={{
              width: 32,
              height: 32,
              objectFit: 'cover',
              borderRadius: 4,
            }}
            alt="image"
          />
          <Link
            to={
              record.market
                ? `/item-details/${record.mint}?market=${record.market}`
                : `/item-details/${record.mint}`
            }
            style={{ cursor: 'pointer', marginLeft: 16 }}
          >
            {record.name}
          </Link>
          {record.market && (
            <span style={{ color: '#e93a88', marginLeft: 8 }}>(ME)</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'bidPrice',
      key: 'bidPrice',
      render: price =>
        price <= props.balance ? (
          <span>
            <CheckCircleFilled
              style={{ color: '#52c41a', fontSize: 20, marginRight: 8 }}
            />
            Pending
          </span>
        ) : (
          <span>
            <ExclamationCircleFilled
              style={{ color: '#ffaa00', fontSize: 20, marginRight: 8 }}
            />
            Insufficiant funds
          </span>
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
      key: 'mint',
      render: (text, record) =>
        record.bidPrice <= props.balance ? (
          <button
            className="offer-button"
            onClick={() => props.onCancel(record)}
          >
            Cancel
          </button>
        ) : (
          <>
            <button
              className="offer-button"
              onClick={() => props.onCancel(record)}
            >
              Cancel
            </button>
            <button className="offer-button" onClick={() => props.onDeposit()}>
              Fund
            </button>
          </>
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
          <img
            src={record.image}
            style={{
              width: 32,
              height: 32,
              objectFit: 'cover',
              borderRadius: 4,
            }}
            alt="image"
          />
          <Link
            to={`/item-details/${record.mint}`}
            style={{ cursor: 'pointer', marginLeft: 16 }}
          >
            {record.name}
          </Link>
          {record.market && (
            <span style={{ color: '#e93a88', marginLeft: 8 }}>(ME)</span>
          )}
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
      key: 'mint',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            className="offer-button"
            onClick={() => props.onAccept(record)}
          >
            Accept offer
          </button>
        </div>
      ),
    },
  ];
};
