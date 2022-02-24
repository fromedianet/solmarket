import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../contexts';

export interface ConnectButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLElement> {
  allowWalletChange?: boolean;
  className?: string;
  name?: string;
}

export const ConnectButton = (props: ConnectButtonProps) => {
  const { disabled, className, ...rest } = props;
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  return (
    <Button
      className={className}
      {...rest}
      onClick={e => {
        props.onClick ? props.onClick(e) : null;
        open();
      }}
      disabled={connected && disabled}
    >
      Connect
    </Button>
  );
};
