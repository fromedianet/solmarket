import React from 'react';
import { notification } from 'antd';
import { toast } from 'react-toastify';
// import Link from '../components/Link';

export function notify1({
  message = '',
  description = undefined as any,
  txid = '',
  type = 'info',
  placement = 'bottomLeft',
}) {
  if (txid) {
    //   <Link
    //     external
    //     to={'https://explorer.solana.com/tx/' + txid}
    //     style={{ color: '#0000ff' }}
    //   >
    //     View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
    //   </Link>

    description = <></>;
  }
  (notification as any)[type]({
    message: <span style={{ color: 'black' }}>{message}</span>,
    description: (
      <span style={{ color: 'black', opacity: 0.5 }}>{description}</span>
    ),
    placement,
    style: {
      backgroundColor: 'white',
    },
  });
}

export function notify({
  message = '',
  description = undefined as any,
  txid = '',
  type = 'info' as 'info' | 'warning' | 'success' | 'error',
}) {
  if (txid) {
    //   <Link
    //     external
    //     to={'https://explorer.solana.com/tx/' + txid}
    //     style={{ color: '#0000ff' }}
    //   >
    //     View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
    //   </Link>

    description = <></>;
  }
  const content = <div style={{display: 'flex', flexDirection: 'column'}}><span>{message}</span><span style={{opacity: 0.7}}>{description}</span></div>
  toast(content, {
    position: 'top-center',
    theme: 'dark',
    autoClose: 6000,
    hideProgressBar: false,
    pauseOnFocusLoss: false,
    type: type
  });
}
