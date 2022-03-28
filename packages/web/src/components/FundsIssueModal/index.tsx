import React from 'react';
import { MetaplexModal } from '@oyster/common';
import { AmountLabel } from '../AmountLabel';
import { Button } from 'antd';

export const FundsIssueModal = (props: {
  message: string;
  isModalVisible: boolean;
  minimumFunds: any;
  currentFunds: any;
  onClose: () => void;
}) => {
  const { currentFunds: balance, minimumFunds, message } = props;
  return (
    <MetaplexModal
      title={'Transaction Alert'}
      visible={props.isModalVisible}
      footer={null}
      onCancel={props.onClose}
      className={'fundsissue'}
      closeIcon={<img src={'/modals/close.svg'} />}
    >
      <b className={'issue-title'}>Insufficient funds</b>
      <div className="card-bid-info">
        <AmountLabel
          containerStyle={{ flexDirection: 'row' }}
          title={'Your Balance'}
          displaySymbol="SOL"
          amount={balance}
          iconSize={24}
        />
      </div>
      <hr />
      <div className="card-bid-info">
        <AmountLabel
          containerStyle={{ flexDirection: 'row' }}
          title={message}
          displaySymbol="SOL"
          amount={minimumFunds}
          iconSize={24}
        />
      </div>
      <hr />
      <span className={'issue-desc'}>
        Deposit the minimum amount of SOL and try again.
      </span>
      <Button className={'secondary-btn width-100'} onClick={props.onClose}>
        Dismiss
      </Button>
    </MetaplexModal>
  );
};
