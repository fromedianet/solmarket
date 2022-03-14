import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const CollectionStep = ({
  collection,
  handleAction,
}: {
  collection: {};
  handleAction: (permission: string) => void;
}) => {
  const [form] = Form.useForm();
  const [symbol, setSymbol] = useState<string>(collection['symbol'] || '');

  const onFinish = value => {};

  return (
    <div className="step-page">
      <p className="step">Step 2 of 5</p>
      <h1>Collection Info</h1>
      <p className="label">Tell us about the collection you’re minting!</p>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Collection Name"
          name="name"
          rules={[{ required: true, message: 'Collection name is required.' }]}
        >
          <Input
            autoFocus
            placeholder="Super NFT Collection"
            maxLength={50}
            value={collection['name']}
          />
        </Form.Item>
        <Form.Item
          label="Collection Symbol"
          name="symbol"
          rules={[
            { required: true, message: 'Collection symbol is required.' },
          ]}
        >
          <span>{`https://papercity.io/marketplace/${symbol}`}</span>
          <Input
            placeholder="super_nft_collection"
            maxLength={20}
            value={symbol}
            onChange={event => setSymbol(event.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button className="step-btn" htmlType="submit">
            Save & Proceed <ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
