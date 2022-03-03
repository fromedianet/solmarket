import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Select, Tag, Input, Card } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyView } from '../../../components/EmptyView';
import { ExNFT } from '../../../models/exCollection';
import { Link } from 'react-router-dom';
import { ArtContent } from '../../../components/ArtContent';

const { Search } = Input;
const DELIMITER = '|&=&|';

export const Items = (props: {
  market: string;
  list: ExNFT[];
  sort: number;
  searchKey: string;
  hasMore: boolean;
  filter: {
    price: {
      symbol: string | undefined;
      min: number | undefined;
      max: number | undefined;
    };
    attributes: {};
  };
  onSearch: (a: string) => void;
  onSortChange: (a: number) => void;
  updateFilters: (p, a) => void;
  fetchMore: () => void;
}) => {
  const searchRef = useRef(null);
  const [priceFilter, setPriceFilter] = useState(props.filter.price);
  const [attributeFilter, setAttributeFilter] = useState(
    props.filter.attributes,
  );
  const [priceTag, setPriceTag] = useState<string | undefined>();

  useEffect(() => {
    if (props.filter.price !== priceFilter) {
      setPriceFilter(props.filter.price);
    }
    if (props.filter.attributes !== attributeFilter) {
      setAttributeFilter(props.filter.attributes);
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

  const onRefresh = () => {
    console.log('refresh');
  };

  const onClosePriceTag = () => {
    props.updateFilters(
      {
        symbol: 'SOL',
        min: undefined,
        max: undefined,
      },
      attributeFilter,
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

    props.updateFilters(priceFilter, newAttributeFilter);
  };

  const onClearAll = () => {
    props.updateFilters(
      {
        symbol: 'SOL',
        min: undefined,
        max: undefined,
      },
      {},
    );
  };

  return (
    <div className="items-container">
      <Row>
        <Col span={24} md={12} className="control-container">
          <div className="refresh-btn" onClick={onRefresh}>
            <img src="/icons/refresh.svg" alt="refresh" />
          </div>
          <Search
            ref={searchRef}
            placeholder="Search"
            className="search-control"
            value={props.searchKey}
            disabled={
              props.market === 'digital_eyes' || props.market === 'alpha_art'
            }
            onChange={event => props.onSearch(event.target.value)}
            allowClear
          />
        </Col>
        <Col span={24} md={12} className="control-container">
          <div className="filter-btn" onClick={onRefresh}>
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
      </Row>
      <div className="tag-container">
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
                <NFTCard item={item} />
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

const NFTCard = (props: { item: ExNFT }) => {
  return (
    <Card hoverable={true} className="art-card" bordered={false}>
      <Link to={`/item-details/${props.item.mintAddress}`}>
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
            <span>{props.item.collection}</span>
            <img src="/icons/check.svg" alt="check" />
          </div>
          <h6>{`${props.item.price ? props.item.price : '--'} SOL`}</h6>
        </div>
      </Link>
    </Card>
  );
};
