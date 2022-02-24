import React from 'react';
import { Button, Select } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { contexts, useQuerySearch } from '@oyster/common';

const { ENDPOINTS, useConnectionConfig } = contexts.Connection;

export const Settings = () => {
  const { connected, disconnect } = useWallet();
  const { endpoint } = useConnectionConfig();
  const routerSearchParams = useQuerySearch();

  return (
    <>
      <div style={{ display: 'grid' }}>
        Network:{' '}
        <Select
          onSelect={network => {
            routerSearchParams.set('network', network);
            window.location.href = `${
              window.location.origin
            }?${routerSearchParams.toString()}`;
          }}
          value={endpoint.name}
          style={{ marginBottom: 20 }}
        >
          {ENDPOINTS.map(({ name, label }) => (
            <Select.Option value={name} key={name}>
              {label}
            </Select.Option>
          ))}
        </Select>
        {connected && (
          <Button type="primary" onClick={disconnect}>
            Disconnect
          </Button>
        )}
      </div>
    </>
  );
};
