import React from "react";
import Link from "next/link";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { ENDPOINT_NAME } from "../../contexts";
import { shortenAddress } from "../../utils/utils";
import { CopySpan } from "../../components/CopySpan";

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export const ActivityColumns = (network: ENDPOINT_NAME) => {
  const getColor = (txType) => {
    if (txType === "SALE" || txType === "Auction Settled") {
      return "#2fc27d";
    } else if (txType === "PLACE BID" || txType === "Auction Place Bid") {
      return "#6d79c9";
    } else if (txType === "LISTING" || txType === "Auction Created") {
      return "#f8f7f8";
    } else {
      return "#9c93a5";
    }
  };

  return [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img
          src={record.image}
          className="placeholder"
          style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
          alt={record.name}
          loading="lazy"
        />
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link
          href={`/item-details/${record.market}/${record.symbol}/${record.mint}`}
        >
          <a>{record.name}</a>
        </Link>
      ),
    },
    {
      title: "TRANSACTION ID",
      dataIndex: "transaction",
      key: "transaction",
      render: (txId) => (
        <a
          href={`https://explorer.solana.com/tx/${txId}${
            network === "mainnet-beta" ? "" : `?cluster=${network}`
          }`}
          target="_blank"
          rel="noreferrer"
          style={{ cursor: "pointer" }}
        >
          {shortenAddress(txId)}
        </a>
      ),
    },
    {
      title: "TRANSACTION TYPE",
      dataIndex: "txType",
      key: "txType",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: getColor(record.txType) }}>
            {record.txType}
          </span>
        </div>
      ),
    },
    {
      title: "TIME",
      dataIndex: "blockTime",
      key: "blockTime",
      render: (timestamp) => timeAgo.format(timestamp * 1000),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "price",
      key: "price",
      render: (price) => price > 0 && `${price} SOL`,
    },
    {
      title: "MINT ADDRESS",
      dataIndex: "mint",
      key: "mint",
      render: (mint) => (
        <CopySpan value={shortenAddress(mint)} copyText={mint} />
      ),
    },
    {
      title: "BUYER",
      dataIndex: "buyer",
      key: "buyer",
      render: (text) =>
        text ? <CopySpan value={shortenAddress(text)} copyText={text} /> : "",
    },
    {
      title: "SELLER",
      dataIndex: "seller",
      key: "seller",
      render: (text) =>
        text ? <CopySpan value={shortenAddress(text)} copyText={text} /> : "",
    },
  ];
};

export const OffersMadeColumns = (props: {
  balance: number;
  onCancel: (p) => void;
  onDeposit: (b) => void;
}) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.image}
            style={{
              width: 32,
              height: 32,
              objectFit: "cover",
              borderRadius: 4,
            }}
            className="placeholder"
            alt={record.name}
          />
          <Link
            href={`/item-details/${record.market}/${record.symbol}/${record.mint}`}
          >
            <a style={{ cursor: "pointer", marginLeft: 16 }}>{record.name}</a>
          </Link>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "bidPrice",
      key: "bidPrice",
      render: (text, record) =>
        record.bidPrice <= props.balance ? (
          <span>
            <CheckCircleFilled
              style={{ color: "#52c41a", fontSize: 20, marginRight: 8 }}
            />
            Pending
          </span>
        ) : (
          <span>
            <ExclamationCircleFilled
              style={{ color: "#ffaa00", fontSize: 20, marginRight: 8 }}
            />
            Insufficiant funds
          </span>
        ),
    },
    {
      title: "Your offer price",
      dataIndex: "bidPrice",
      key: "bidPrice",
      render: (text, record) =>
        record.bidPrice <= props.balance ? (
          <span>{`${record.bidPrice} SOL`}</span>
        ) : (
          <>
            <span style={{ color: "#ffffff", fontSize: 14 }}>
              {`${record.bidPrice} SOL`}
            </span>
            <span style={{ color: "#ffaa00", fontSize: 12, marginLeft: 8 }}>
              {`- ${record.bidPrice - props.balance} SOL`}
            </span>
          </>
        ),
    },
    {
      title: "Current price",
      dataIndex: "listingPrice",
      key: "listingPrice",
      render: (price) => `${price} SOL`,
    },
    {
      title: "Action",
      dataIndex: "mint",
      key: "mint",
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
            <button
              className="offer-button"
              onClick={() => props.onDeposit(record)}
            >
              Deposit
            </button>
          </>
        ),
    },
  ];
};

export const OffersReceivedColumns = (props: { onAccept: (p) => void }) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.image}
            style={{
              width: 32,
              height: 32,
              objectFit: "cover",
              borderRadius: 4,
            }}
            className="placeholder"
            alt={record.name}
          />
          <Link
            href={`/item-details/${record.market}/${record.symbol}/${record.mint}`}
          >
            <a style={{ cursor: "pointer", marginLeft: 16 }}>{record.name}</a>
          </Link>
        </div>
      ),
    },
    {
      title: "Bidder",
      dataIndex: "buyer",
      key: "buyer",
      render: (buyer) => (
        <CopySpan value={shortenAddress(buyer)} copyText={buyer} />
      ),
    },
    {
      title: "Offer price",
      dataIndex: "bidPrice",
      key: "bidPrice",
      render: (price) => `${price} SOL`,
    },
    {
      title: "Current price",
      dataIndex: "listingPrice",
      key: "listingPrice",
      render: (price) => `${price} SOL`,
    },
    {
      title: "Time",
      dataIndex: "blockTime",
      key: "blockTime",
      render: (timestamp) => timeAgo.format(timestamp * 1000),
    },
    {
      title: "Action",
      dataIndex: "mint",
      key: "mint",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
