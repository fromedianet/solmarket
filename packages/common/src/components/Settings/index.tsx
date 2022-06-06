import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { shortenAddress } from '../../utils';
import { CopySpan } from '../CopySpan';

export const Settings = ({
  additionalSettings,
}: {
  additionalSettings?: JSX.Element;
}) => {
  const { publicKey } = useWallet();

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '15px 0',
        }}
      >
        <img
          src={`https://avatars.dicebear.com/api/jdenticon/${publicKey?.toBase58()}.svg`}
          style={{
            width: 48,
            borderRadius: 24,
            border: '1px solid white',
            marginBottom: 4,
          }}
          alt="publicKey"
        />
        {publicKey && (
          <CopySpan
            value={shortenAddress(publicKey.toBase58())}
            copyText={publicKey.toBase58()}
          />
        )}
        <br />
        <span
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            width: 'calc(100% + 32px)',
            marginBottom: 10,
          }}
        ></span>
        {additionalSettings}
      </div>
    </>
  );
};
