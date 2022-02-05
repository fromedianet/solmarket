import React, { useEffect, useState } from 'react';
import {
  Layout,
  Collapse,
  Form,
  InputNumber,
  Space,
  Select,
  Button,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MinusOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import dummy from '../dummy.json';

const { Sider } = Layout;
const { Panel } = Collapse;

type Details = {
  value: string;
  floor: string;
};

type Attribute = {
  trait_type: string;
  data: Details[];
};

function prepareAttributes() {
  const data: Attribute[] = [];
  let traitType = '';
  let attrs: Attribute = {
    trait_type: '',
    data: [],
  };
  dummy.availableAttributes.forEach(item => {
    if (traitType === '') {
      attrs['trait_type'] = item.attribute.trait_type;
    } else if (item.attribute.trait_type !== traitType) {
      data.push(attrs);
      attrs = {
        trait_type: item.attribute.trait_type,
        data: [],
      };
    }
    attrs['data'].push({
      value: `${item.attribute.value} (${item.count})`,
      floor: `floor: ${item.floor / Math.pow(10, 9)}`,
    });
    traitType = item.attribute.trait_type;
  });
  data.push(attrs);

  return data;
}

export const FilterSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    setAttributes(prepareAttributes());
  }, []);

  const onFinish = values => {
    console.log(values);
  };

  const onChange = (trait, values) => {
    console.log('onChange', values);
    console.log('trait', trait);
  };

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
              <Form
                name="price_form"
                className="price-form"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item name={['price', 'symbol']}>
                  <Select defaultValue="sol" disabled>
                    <Select.Option value="sol">SOL</Select.Option>
                  </Select>
                </Form.Item>
                <Space
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  align="baseline"
                >
                  <Form.Item name={['price', 'min']}>
                    <InputNumber
                      placeholder="Min"
                      style={{ width: '125px' }}
                      controls={false}
                    />
                  </Form.Item>
                  <span>to</span>
                  <Form.Item name={['price', 'max']}>
                    <InputNumber
                      placeholder="Max"
                      style={{ width: '125px' }}
                      controls={false}
                    />
                  </Form.Item>
                </Space>
                <Form.Item>
                  <div className="gradient-wrapper">
                    <Button htmlType="submit" className="apply-btn">
                      Apply
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Panel>
            <Panel
              key="attributes"
              header="Attributes filter"
              extra={<UnorderedListOutlined className="filter-icon" />}
            >
              <div className="attr-container">
                {attributes.map((attr, index) => (
                  <Select
                    key={index}
                    mode="multiple"
                    placeholder={attr.trait_type}
                    allowClear={true}
                    showArrow={true}
                    onChange={value => onChange(attr.trait_type, value)}
                    optionLabelProp="value"
                  >
                    {attr.data.map((item, idx) => (
                      <Select.Option key={idx} value={item.value}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingRight: '16px',
                          }}
                        >
                          <span>{item.value}</span>
                          <span>{item.floor}</span>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                ))}
              </div>
            </Panel>
          </Collapse>
        </>
      )}
    </Sider>
  );
};
