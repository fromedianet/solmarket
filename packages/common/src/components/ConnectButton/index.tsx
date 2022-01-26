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
  const { disabled, className, name, ...rest } = props;
  const { wallet, connect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleClick = useCallback(
    () => (wallet ? connect().catch(() => {}) : open()),
    [wallet, connect, open],
  );

  return (
    <Button
      className={className}
      {...rest}
      onClick={e => {
        props.onClick ? props.onClick(e) : null;
        handleClick();
      }}
      disabled={connected && disabled}
    >
      {name || 'Connect'}
    </Button>
  );
};
