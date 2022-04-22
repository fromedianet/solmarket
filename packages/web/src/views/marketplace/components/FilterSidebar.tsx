import React, { useEffect, useState } from 'react';
import {
  Layout,
  Collapse,
  Form,
  InputNumber,
  Space,
  Select,
  Button,
  Checkbox,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MinusOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ExAttribute } from '../../../models/exCollection';

const { Sider } = Layout;
const { Panel } = Collapse;

export const FilterSidebar = (props: {
  attributes: ExAttribute[];
  filter: {
    price: {
      symbol: string | undefined;
      min: number | undefined;
      max: number | undefined;
    };
    attributes: {};
    status: boolean;
  };
  updateFilters: (p, a, s) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [attributeFilter, setAttributeFilter] = useState(
    props.filter.attributes,
  );
  const [status, setStatus] = useState(props.filter.status);
  const [form] = Form.useForm();

  useEffect(() => {
    onFillForm(props.filter.price);
    setAttributeFilter(props.filter.attributes);
    setStatus(props.filter.status);
  }, [props.filter]);

  const onStatusChange = e => {
    setStatus(e.target.checked);
    props.updateFilters(
      form.getFieldsValue(),
      attributeFilter,
      e.target.checked,
    );
  };

  const onFinish = values => {
    if (values.min && values.max) {
      if (values.max >= values.min) {
        props.updateFilters(values, attributeFilter, status);
      }
    } else {
      props.updateFilters(values, attributeFilter, status);
    }
  };

  const onFillForm = price => {
    form.setFieldsValue({
      min: price.min,
      max: price.max,
    });
  };

  const onChange = async (trait, values) => {
    const newAttributeFilter = { ...attributeFilter };
    if (values.length > 0) {
      newAttributeFilter[trait] = values;
    } else {
      delete newAttributeFilter[trait];
    }
    props.updateFilters(form.getFieldsValue(), newAttributeFilter, status);
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
            defaultActiveKey={['status', 'price', 'attributes']}
            expandIcon={({ isActive }) =>
              isActive ? (
                <MinusOutlined className="filter-icon" />
              ) : (
                <PlusOutlined className="filter-icon " />
              )
            }
          >
            <Panel
              key="status"
              header="Status"
              extra={<UnorderedListOutlined className="filter-icon" />}
            >
              <div className="status-container">
                <Checkbox onChange={onStatusChange} checked={status}>
                  All items
                </Checkbox>
              </div>
            </Panel>
            <Panel
              key="price"
              header="Price filter"
              extra={<UnorderedListOutlined className="filter-icon" />}
            >
              <Form
                form={form}
                name="price_form"
                className="price-form"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item initialValue="SOL" name="symbol">
                  <Select disabled>
                    <Select.Option value="SOL">SOL</Select.Option>
                  </Select>
                </Form.Item>
                <Space
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  align="baseline"
                >
                  <Form.Item name="min">
                    <InputNumber
                      placeholder="Min"
                      style={{ width: '125px' }}
                      controls={false}
                    />
                  </Form.Item>
                  <span style={{ color: 'white' }}>to</span>
                  <Form.Item name="max">
                    <InputNumber
                      placeholder="Max"
                      style={{ width: '125px' }}
                      controls={false}
                    />
                  </Form.Item>
                </Space>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{ height: '40px', width: '100%' }}
                  >
                    Apply
                  </Button>
                </Form.Item>
              </Form>
            </Panel>
            <Panel
              key="attributes"
              header="Attributes filter"
              extra={<UnorderedListOutlined className="filter-icon" />}
            >
              <div className="attr-container">
                {props.attributes.map((attr, index) => (
                  <Select
                    key={index}
                    mode="multiple"
                    placeholder={attr.key}
                    allowClear={true}
                    showArrow={true}
                    onChange={value => onChange(attr.key, value)}
                    optionLabelProp="label"
                    value={attributeFilter[attr.key]}
                    style={{ marginTop: 4, marginBottom: 4 }}
                  >
                    {attr.numbers.map((value, idx) => (
                      <Select.Option key={idx} value={value.value}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingRight: '16px',
                          }}
                        >
                          <span>
                            {value.value}
                            {value.amount && ` (${value.amount})`}
                          </span>
                          {value.floor && (
                            <span>{`floor: ${value.floor.toFixed(2)}`}</span>
                          )}
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
