import React from "react";
import { Collapse, Table } from "antd";
import { Transaction } from "../../models/exCollection";
import TimeAgo from "javascript-time-ago";
import { HorizontalGrid } from "../../components/HorizontalGrid";
import en from "javascript-time-ago/locale/en.json";
import { Offer } from "../../models/offer";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnectionConfig } from "../../contexts";
import { shortenAddress } from "../../utils/utils";
import { CopySpan } from "../../components/CopySpan";
import { NFTCard } from "../../components/NFTCard";

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const { Panel } = Collapse;

export const BottomSection = (props: {
  transactions: Transaction[];
  nft: any;
  nftList: any[];
  offers: Offer[];
  setMyOffer: (a) => void;
  onCancelVisible: () => void;
}) => {
  const endpoint = useConnectionConfig();
  const network = endpoint.endpoint.name;
  const wallet = useWallet();

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

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (uri) => <img src={uri} width={40} alt="image" />,
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
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
      render: (type) => <span style={{ color: getColor(type) }}>{type}</span>,
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

  const offerColumns = [
    {
      title: "Price",
      dataIndex: "bidPrice",
      key: "bidPrice",
      render: (bidPrice) => <span>{`${bidPrice} SOL`}</span>,
    },
    {
      title: "From",
      dataIndex: "buyer",
      key: "buyer",
      render: (buyer) => <span>{buyer}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) =>
        record.buyer === wallet.publicKey?.toBase58() ? (
          <button
            className="cancel-button"
            onClick={() => {
              props.setMyOffer(record);
              props.onCancelVisible();
            }}
          >
            Cancel
          </button>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <Collapse
      expandIconPosition="end"
      className="art-info bottom-section"
      defaultActiveKey={["activities", "more"]}
    >
      <Panel
        header={`Offers ${
          props.offers.length > 0 ? ` (${props.offers.length})` : ""
        }`}
        key="offers"
        className="bg-secondary no-padding"
        extra={<img src="/icons/zap.svg" width={24} alt="offers" />}
      >
        {props.offers.length > 0 && (
          <Table
            columns={offerColumns}
            dataSource={props.offers}
            style={{ overflowX: "auto" }}
            pagination={{ position: ["bottomLeft"], pageSize: 10 }}
          />
        )}
      </Panel>
      <Panel
        header="Activities"
        key="activities"
        className="bg-secondary no-padding"
        extra={<img src="/icons/price.svg" width={24} alt="activites" />}
      >
        {props.transactions.length > 0 && (
          <Table
            columns={columns}
            dataSource={props.transactions}
            style={{ overflowX: "auto" }}
            pagination={{ position: ["bottomLeft"], pageSize: 10 }}
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
                collection={item.collection}
                className="w-250"
              />
            ))}
          />
        )}
      </Panel>
    </Collapse>
  );
};
