import React from 'react';
import { Button } from 'antd';
import { useArt } from '../../hooks';
import { useConnectionConfig } from '@oyster/common';

export const ViewOn = ({ id }: { id: string }) => {
  const { endpoint } = useConnectionConfig();
  const art = useArt(id);

  return (
    <div className="info-view">
      <span className="info-title">View on:</span>
      <Button
        className="tag"
        onClick={() => window.open(art.uri || '', '_blank')}
      >
        Arweave
      </Button>
      <Button
        className="tag"
        onClick={() => {
          const cluster = endpoint.name;
          const explorerURL = new URL(
            `account/${art?.mint || ''}`,
            'https://explorer.solana.com',
          );
          if (!cluster.includes('mainnet')) {
            explorerURL.searchParams.set('cluster', cluster);
          }
          window.open(explorerURL.href, '_blank');
        }}
      >
        Solana
      </Button>
    </div>
  );
};
