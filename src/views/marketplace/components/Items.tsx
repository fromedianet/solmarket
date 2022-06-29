import React, { lazy, useEffect, useRef, useState } from "react";
import { Row, Col, Select, Tag, Input, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { ExCollection } from "../../../models/exCollection";
import { MarketType } from "../../../constants";

const NFTCard = lazy(() => import("../../../components/NFTCard"));
const EmptyView = lazy(() => import("../../../components/EmptyView"));

const { Search } = Input;
const DELIMITER = "|&=&|";

export default function Items(props: {
  collection: ExCollection | undefined;
  list: any[];
  loading: boolean;
  sort: number;
  type: MarketType;
  searchKey: string;
  hasMore: boolean;
  filter: {
    price: {
      symbol: string | undefined;
      min: number | undefined;
      max: number | undefined;
    };
    attributes: {};
    status: boolean;
  };
  onSearch: (a: string) => void;
  onSortChange: (a: number) => void;
  onTypeChange: (a: MarketType) => void;
  updateFilters: (p, a, s) => void;
  fetchMore: () => void;
  onRefresh: () => void;
}) {
  const searchRef = useRef(null);
  const [priceFilter, setPriceFilter] = useState(props.filter.price);
  const [attributeFilter, setAttributeFilter] = useState(
    props.filter.attributes
  );
  const [status, setStatus] = useState(props.filter.status);
  const [priceTag, setPriceTag] = useState<string | undefined>();

  useEffect(() => {
    if (props.filter.price !== priceFilter) {
      setPriceFilter(props.filter.price);
    }
    if (props.filter.attributes !== attributeFilter) {
      setAttributeFilter(props.filter.attributes);
    }
    if (props.filter.status !== status) {
      setStatus(props.filter.status);
    }
  }, [props.filter]);

  useEffect(() => {
    let newPriceTag: string | undefined;
    if (priceFilter.min && priceFilter.max) {
      newPriceTag = `${priceFilter.symbol}: ${priceFilter.min} - ${priceFilter.max}`;
    } else if (priceFilter.min) {
      newPriceTag = `${priceFilter.symbol}:> ${priceFilter.min}`;
    } else if (priceFilter.max) {
      newPriceTag = `${priceFilter.symbol}:< ${priceFilter.max}`;
    }
    setPriceTag(newPriceTag);
  }, [priceFilter]);

  const existsAttributes = () => {
    const values = Object.values(attributeFilter);
    return values.length > 0;
  };

  const onCloseStatusTag = () => {
    props.updateFilters(priceFilter, attributeFilter, false);
  };

  const onClosePriceTag = () => {
    setStatus(false);
    props.updateFilters(
      {
        symbol: "SOL",
        min: undefined,
        max: undefined,
      },
      attributeFilter,
      status
    );
  };

  const onCloseAttributeTag = (key: string) => {
    const splitKey = key.split(DELIMITER);
    const newAttributeFilter = { ...attributeFilter };
    const index = newAttributeFilter[splitKey[0]].indexOf(splitKey[1]);
    if (index !== -1) {
      newAttributeFilter[splitKey[0]].splice(index, 1);
    }
    if (newAttributeFilter[splitKey[0]].length === 0) {
      delete newAttributeFilter[splitKey[0]];
    }

    props.updateFilters(priceFilter, newAttributeFilter, status);
  };

  const onClearAll = () => {
    props.updateFilters(
      {
        symbol: "SOL",
        min: undefined,
        max: undefined,
      },
      {},
      false
    );
  };

  return (
    <div className="items-container">
      <Row>
        <Col span={24} md={8} className="control-container">
          <div className="refresh-btn" onClick={props.onRefresh}>
            {props.loading ? (
              <Spin />
            ) : (
              <img
                src="/icons/refresh.svg"
                alt="refresh"
                style={{ width: "24px", height: "24px" }}
              />
            )}
          </div>
          <Search
            ref={searchRef}
            placeholder="Search"
            className="search-control"
            value={props.searchKey}
            onChange={(event) => props.onSearch(event.target.value)}
            allowClear
          />
        </Col>
        <Col span={24} md={8} className="control-container">
          <div className="filter-btn" onClick={props.onRefresh}>
            <img src="/icons/filter.svg" alt="filter" />
          </div>
          <Select
            className="select-container"
            value={props.sort}
            onSelect={(val) => props.onSortChange(val)}
            aria-label="sort nft"
            aria-labelledby="sort nft"
            aria-expanded="false"
            aria-autocomplete="none"
            aria-readonly="true"
          >
            <Select.Option value={1} role="option">
              Recently Listed
            </Select.Option>
            <Select.Option value={2} role="option">
              Price: Low to high
            </Select.Option>
            <Select.Option value={3} role="option">
              Price: High to low
            </Select.Option>
          </Select>
        </Col>
        <Col span={24} md={8} className="control-container">
          <Select
            className="select-container"
            value={props.type}
            onSelect={(val) => props.onTypeChange(val)}
            aria-label="select market"
            aria-labelledby="select market"
            aria-expanded="false"
            aria-autocomplete="none"
            aria-readonly="true"
          >
            <Select.Option value={MarketType.All} role="option">
              All
            </Select.Option>
            <Select.Option value={MarketType.PaperCity} role="option">
              PaperCity
            </Select.Option>
            <Select.Option value={MarketType.MagicEden} role="option">
              MagicEden
            </Select.Option>
            <Select.Option value={MarketType.Solanart} role="option">
              Solanart
            </Select.Option>
            <Select.Option value={MarketType.DigitalEyes} role="option">
              DigitalEyes
            </Select.Option>
            <Select.Option value={MarketType.AlphaArt} role="option">
              AlphaArt
            </Select.Option>
          </Select>
        </Col>
      </Row>
      <div className="tag-container">
        {status && (
          <Tag key="status-tag" closable onClose={onCloseStatusTag}>
            All items
          </Tag>
        )}
        {priceTag && (
          <Tag key="price-tag" closable onClose={onClosePriceTag}>
            {priceTag}
          </Tag>
        )}
        {existsAttributes() && (
          <div className="attributes">
            {Object.keys(attributeFilter).map((key) =>
              attributeFilter[key].map((val) => (
                <Tag
                  key={`${key}${DELIMITER}${val}`}
                  closable
                  onClose={() =>
                    onCloseAttributeTag(`${key}${DELIMITER}${val}`)
                  }
                >
                  {val}
                </Tag>
              ))
            )}
          </div>
        )}
        {(priceTag || existsAttributes()) && (
          <div className="clear-all" onClick={onClearAll}>
            Clear All
          </div>
        )}
      </div>
      {
        // @ts-ignore
        <InfiniteScroll
          dataLength={props.list.length}
          className="ant-row"
          next={props.fetchMore}
          hasMore={props.hasMore}
          style={{ justifyContent: "center" }}
        >
          {props.list.length > 0 ? (
            props.list.map((item) => (
              <NFTCard
                key={item.mint}
                item={item}
                collection={props.collection?.name || item.symbol}
              />
            ))
          ) : (
            <EmptyView />
          )}
        </InfiniteScroll>
      }
    </div>
  );
}
