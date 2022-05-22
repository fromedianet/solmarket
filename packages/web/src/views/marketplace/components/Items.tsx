import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Select, Tag, Input, Card, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyView } from '../../../components/EmptyView';
import { Link } from 'react-router-dom';
import { ArtContent } from '../../../components/ArtContent';
import { ExCollection } from '../../../models/exCollection';
import { MarketType } from '../../../constants';

const { Search } = Input;
const DELIMITER = '|&=&|';

export const Items = (props: {
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
}) => {
  const searchRef = useRef(null);
  const [priceFilter, setPriceFilter] = useState(props.filter.price);
  const [attributeFilter, setAttributeFilter] = useState(
    props.filter.attributes,
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
        symbol: 'SOL',
        min: undefined,
        max: undefined,
      },
      attributeFilter,
      status,
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
        symbol: 'SOL',
        min: undefined,
        max: undefined,
      },
      {},
      false,
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
              <img src="/icons/refresh.svg" alt="refresh" />
            )}
          </div>
          <Search
            ref={searchRef}
            placeholder="Search"
            className="search-control"
            value={props.searchKey}
            onChange={event => props.onSearch(event.target.value)}
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
            onSelect={val => props.onSortChange(val)}
          >
            <Select.Option value={1}>Recently Listed</Select.Option>
            <Select.Option value={2}>Price: Low to high</Select.Option>
            <Select.Option value={3}>Price: High to low</Select.Option>
          </Select>
        </Col>
        <Col span={24} md={8} className="control-container">
          <Select
            className="select-container"
            value={props.type}
            onSelect={val => props.onTypeChange(val)}
          >
            <Select.Option value={MarketType.All}>All</Select.Option>
            <Select.Option value={MarketType.PaperCity}>
              PaperCity
            </Select.Option>
            <Select.Option value={MarketType.MagicEden}>
              MagicEden
            </Select.Option>
            <Select.Option value={MarketType.Solanart}>Solanart</Select.Option>
            <Select.Option value={MarketType.DigitalEyes}>
              DigitalEyes
            </Select.Option>
            <Select.Option value={MarketType.AlphaArt}>AlphaArt</Select.Option>
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
            {Object.keys(attributeFilter).map(key =>
              attributeFilter[key].map(val => (
                <Tag
                  key={`${key}${DELIMITER}${val}`}
                  closable
                  onClose={() =>
                    onCloseAttributeTag(`${key}${DELIMITER}${val}`)
                  }
                >
                  {val}
                </Tag>
              )),
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
        >
          {props.list.length > 0 ? (
            props.list.map((item, index) => (
              <Col
                key={index}
                span={12}
                md={8}
                lg={8}
                xl={6}
                xxl={4}
                style={{ padding: 8 }}
              >
                <NFTCard
                  item={item}
                  collection={props.collection?.name || item.symbol}
                />
              </Col>
            ))
          ) : (
            <EmptyView />
          )}
        </InfiniteScroll>
      }
    </div>
  );
};

export const NFTCard = (props: {
  item: any;
  collection: string;
  itemId?: string;
  className?: string;
}) => {
  const url = `/item-details/${props.item.mint}`;
  return (
    <Card
      hoverable={true}
      className={`art-card ${props.className}`}
      style={{ maxWidth: 250 }}
      bordered={false}
    >
      <Link to={url}>
        <div className="image-over art-image-container">
          <ArtContent
            className="art-image no-event"
            uri={props.item.image}
            preview={false}
            artview={true}
            allowMeshRender={false}
          />
        </div>
        <div className="card-caption">
          <h6>{props.item.name}</h6>
          <div className="card-collection-name">
            <span>{props.collection}</span>
            <img src="/icons/check.svg" alt="check" />
          </div>
          {props.item.price > 0 && <h6>{`${props.item.price} SOL`}</h6>}
        </div>
      </Link>
    </Card>
  );
};
