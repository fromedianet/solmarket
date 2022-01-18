import { CopyOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React from 'react';
import { useCallback, useRef } from 'react';

interface Variables {
  storeAddress?: string;
  storeOwnerAddress?: string;
}

export const SetupVariables: React.FC<Variables> = ({
  storeAddress,
  storeOwnerAddress,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const copySettings = useCallback(() => {
    const text = ref.current?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
    }
  }, []);

  if (!storeAddress && !storeOwnerAddress) {
    return null;
  }

  return (
    <Card
      title="Store configuration"
      extra={
        <Button
          type="dashed"
          onClick={copySettings}
          icon={<CopyOutlined />}
        ></Button>
      }
    >
      <div ref={ref}>
        {storeOwnerAddress && (
          <p>REACT_APP_STORE_OWNER_ADDRESS_ADDRESS={storeOwnerAddress}</p>
        )}
      </div>
    </Card>
  );
};
