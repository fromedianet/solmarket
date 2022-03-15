import React, { useState } from 'react';
import { Radio, Button, Space, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const IntroStep = ({
  collection,
  handleAction,
  saving,
}: {
  collection: {};
  handleAction: (permission: string) => void;
  saving: boolean;
}) => {
  const [permission, setPermission] = useState(
    collection['permission'] || 'author',
  );

  return (
    <div className="step-page">
      <p className="step">Step 1 of 5</p>
      <h1>Let&apos;s list your collection!</h1>
      <p className="label">
        Is the artwork in your collection, profile picture, and banner either
        your original artwork or artwork you have legal permission to use,
        distribute, and sell?
      </p>
      <Radio.Group
        onChange={e => setPermission(e.target.value)}
        defaultValue={permission}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio value="author" className="radio-btn">
            Yes, I am the author
          </Radio>
          <Radio value="license" className="radio-btn">
            Yes, I have the license to use the art
          </Radio>
          <Radio value="no" className="radio-btn">
            No
          </Radio>
        </Space>
      </Radio.Group>
      <Button
        className="step-btn"
        disabled={permission === 'no' || saving}
        onClick={() => handleAction(permission)}
      >
        {saving ? (
          <Spin />
        ) : (
          <>
            Let&apos; Go <ArrowRightOutlined />
          </>
        )}
      </Button>
    </div>
  );
};
