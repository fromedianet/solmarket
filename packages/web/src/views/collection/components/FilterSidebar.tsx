import React, { useState } from 'react';
import { Layout, Collapse, Form, InputNumber, Space, Select, Button } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MinusOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Panel } = Collapse;
export const FilterSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onFinish = (values) => {
    console.log(values);
  }

  return (
    <Sider
      className="filter-sider"
      width={340}
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={60}
    >
      {collapsed ? (
        <div className="filter-header" onClick={() => setCollapsed(false)}>
          <ArrowRightOutlined className="filter-icon" />
        </div>
      ) : (
        <>
          <div
            className="filter-header tw-border-bottom-1"
            onClick={() => setCollapsed(true)}
          >
            <span>Filters</span>
            <ArrowLeftOutlined className="filter-icon" />
          </div>
          <Collapse
            expandIconPosition="right"
            className="filter-container"
            expandIcon={({ isActive }) =>
              isActive ? (
                <MinusOutlined className="filter-icon" />
              ) : (
                <PlusOutlined className="filter-icon " />
              )
            }
          >
            <Panel
              key="price"
              header="Price filter"
              extra={<UnorderedListOutlined className="filter-icon" />}
            >
              <Form name='price_form' className='price-form' onFinish={onFinish} autoComplete='off'>
                <Form.Item
                  name={['price', 'symbol']}
                >
                  <Select defaultValue='sol' disabled>
                    <Select.Option value='sol'>SOL</Select.Option>
                  </Select>
                </Form.Item>
                <Space style={{ display: 'flex', justifyContent: 'space-between' }} align='baseline'>
                  <Form.Item name={['price', 'min']}>
                    <InputNumber placeholder='Min' style={{ width: '125px'}} controls={false}/>
                  </Form.Item>
                  <span>to</span>
                  <Form.Item name={['price', 'max']}>
                    <InputNumber placeholder='Max' style={{ width: '125px'}} controls={false}/>
                  </Form.Item>
                </Space>
                <Form.Item>
                  <div className='gradient-wrapper'>
                    <Button htmlType='submit' className='apply-btn'>Apply</Button>
                  </div>
                </Form.Item>
              </Form>
            </Panel>
            <Panel
              key="attributes"
              header="Attributes filter"
              extra={<UnorderedListOutlined className="filter-icon" />}
            ></Panel>
          </Collapse>
        </>
      )}
    </Sider>
  );
};
