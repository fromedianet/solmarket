import React from 'react';
import { Row, Col, Select } from 'antd';
import { SearchBar } from '../../../components/SearchBar';
import { Metadata, ParsedAccount } from '@oyster/common';
import { ArtCard } from '../../../components/ArtCard';
import { EmptyView } from '../../../components/EmptyView';

export const Items = (props: { list: ParsedAccount<Metadata>[] }) => {
  const onRefresh = () => {
    console.log('refresh');
  };

  return (
    <div className="items-container">
      <Row>
        <Col span={24} md={12} className="control-container">
          <div className="refresh-btn" onClick={onRefresh}>
            <img src="/icons/refresh.svg" alt="refresh" />
          </div>
          <SearchBar placeholder="Search" controlClass="search-control" />
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
      <Row gutter={[16, 16]} style={{ padding: '0 16px' }}>
        {props.list && props.list.length > 0 ? (
          props.list.map((item, index) => (
            <Col key={index} span={12} md={8} lg={8} xl={6} xxl={4}>
              <ArtCard pubkey={item.pubkey} preview={false} artview={true} />
            </Col>
          ))
        ) : (
          <EmptyView />
        )}
      </Row>
    </div>
  );
};
