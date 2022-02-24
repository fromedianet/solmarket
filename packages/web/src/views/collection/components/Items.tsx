import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Tag, Input } from 'antd';
import { Metadata, ParsedAccount } from '@oyster/common';
import { ArtCard } from '../../../components/ArtCard';
import { EmptyView } from '../../../components/EmptyView';

const { Search } = Input;
const DELIMITER = '|&=&|';

export const Items = (props: {
  list: ParsedAccount<Metadata>[];
  filter: {
    price: {
      symbol: string | undefined;
      min: number | undefined;
      max: number | undefined;
    };
    attributes: {};
  };
  updateFilters: (p, a) => void;
}) => {
  const [priceFilter, setPriceFilter] = useState(props.filter.price);
  const [attributeFilter, setAttributeFilter] = useState(
    props.filter.attributes,
  );
  const [priceTag, setPriceTag] = useState<string | undefined>();
  const [filterList, setFilterList] = useState(props.list);

  useEffect(() => {
    if (props.list.length > 0) {
      setFilterList(props.list);
    }
  }, [props.list]);

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

  const onSearch = value => {
    // TODO: attribute filters, sort by options
    const filters = props.list.filter(
      item =>
        item.info.data.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setFilterList(filters);
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
            placeholder="Search"
            className="search-control"
            onSearch={onSearch}
            allowClear
          />
        </Col>
        <Col span={24} md={12} className="control-container">
          <div className="filter-btn" onClick={onRefresh}>
            <img src="/icons/filter.svg" alt="filter" />
          </div>
          <Select className="select-container" defaultValue="recently">
            <Select.Option value="recently">Recently Listed</Select.Option>
            <Select.Option value="low-high">Price: Low to high</Select.Option>
            <Select.Option value="high-low">Price: High to low</Select.Option>
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
      <Row gutter={[16, 16]} style={{ padding: '8px 16px' }}>
        {filterList.length > 0 ? (
          filterList.map((item, index) => (
            <Col key={index} span={12} md={8} lg={8} xl={6} xxl={4}>
              <ArtCard
                pubkey={item.pubkey}
                preview={false}
                artview={true}
              />
            </Col>
          ))
        ) : (
          <EmptyView />
        )}
      </Row>
    </div>
  );
};
