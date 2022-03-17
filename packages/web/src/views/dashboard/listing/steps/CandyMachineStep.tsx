import React, { useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

export const CandyMachineStep = ({
  collection,
  saving,
  handleAction,
}: {
  collection: {};
  saving: boolean;
  handleAction: (params) => void;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      mint_supply: collection['mint_supply'] && collection['mint_supply'],
      candymachine_ids:
        collection['candymachine_ids'].length > 0
          ? collection['candymachine_ids'][0]
          : '',
      // UTC to Local time
      datepicker:
        collection['launch_time'] &&
        moment.utc(collection['launch_time']).local(),
    });
  }, [collection]);

  const onFinish = values => {
    const params = {
      // Local time to UTC
      launch_time: values.datepicker.utc().format(),
      mint_supply: values.mint_supply,
      candymachine_ids: values.candymachine_ids,
    };
    handleAction(params);
  };

  return (
    <div className="step-page">
      <p className="step">Step 4 of 5</p>
      <h1>Candy Machine ID</h1>
      <p className="label">
        Please input your candymachine Id for your NFTs. Refer{' '}
        <a
          href="https://docs.metaplex.com/candy-machine-v2/introduction"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#009999' }}
        >
          this guide
        </a>{' '}
        to create the candy machine.
      </p>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Date When Your Mint Started"
          name="datepicker"
          rules={[{ required: true, message: 'Launch time is required!' }]}
        >
          <DatePicker
            placeholder="Pick a date and time"
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            className="step-picker"
            inputReadOnly
          />
        </Form.Item>
        <Form.Item
          label="Total Supply"
          name="mint_supply"
          rules={[{ required: true, message: 'Total Supply is required!' }]}
          extra="Number of total items in the collection existing of expected"
        >
          <InputNumber
            placeholder="Total supply"
            className="step-input-number"
            controls={false}
          />
        </Form.Item>
        <Form.Item
          label="Candy Machine ID"
          name="candymachine_ids"
          rules={[
            { required: true, message: 'Candy machine id is required!' },
            {
              pattern: new RegExp('^[a-zA-Z0-9]{44}$'),
              message: 'Format is wrong',
            },
          ]}
        >
          <Input
            placeholder="Candy machine id"
            className="step-input"
            maxLength={44}
          />
        </Form.Item>
        <Form.Item>
          <Button className="step-btn" htmlType="submit">
            {saving ? (
              <Spin />
            ) : (
              <span>
                Review <ArrowRightOutlined />
              </span>
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
