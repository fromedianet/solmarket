import React, { useEffect } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const CollectionStep = ({
  collection,
  handleAction,
  saving,
}: {
  collection: {};
  handleAction: ({ name, symbol }) => void;
  saving: boolean;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('collection step', collection);
    form.setFieldsValue({
      name: collection['name'] || '',
      symbol: collection['symbol'] || '',
    });
  }, [collection]);

  return (
    <div className="step-page">
      <p className="step">Step 2 of 5</p>
      <h1>Collection Info</h1>
      <p className="label">Tell us about the collection you’re minting!</p>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={values => handleAction(values)}
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
            className="step-input"
          />
        </Form.Item>
        <Form.Item
          label="Collection Symbol"
          name="symbol"
          rules={[
            { required: true, message: 'Collection symbol is required.' },
            { pattern: new RegExp("^[a-zA-Z0-9_]+$"), message: 'Format is wrong'}
          ]}
          extra='A-Z, a-z, 0-9, "_" is only available'
        >
          <Input
            placeholder="super_nft_collection"
            maxLength={20}
            className="step-input"
          />
        </Form.Item>
        <Form.Item>
          <Button className="step-btn" htmlType="submit" disabled={saving}>
            {saving ? (
              <Spin />
            ) : (
              <>
                Save & Proceed <ArrowRightOutlined />
              </>
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
