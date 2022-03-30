import React from 'react';
import { Statistic } from 'antd';
import { formatAmount } from '@oyster/common';
import { TokenCircle } from '../Custom';
import { TokenInfo } from '@solana/spl-token-registry';

interface IAmountLabel {
  amount: number | string;
  displayUSD?: boolean;
  displaySymbol?: string;
  title?: string;
  style?: object;
  containerStyle?: object;
  iconSize?: number;
  customPrefix?: JSX.Element;
  ended?: boolean;
  tokenInfo?: TokenInfo;
}

export const AmountLabel = (props: IAmountLabel) => {
  const {
    amount: _amount,
    displaySymbol = '',
    title = '',
    style = {},
    containerStyle = {},
    iconSize = 38,
    customPrefix,
  } = props;
  // Add formattedAmount to be able to parse USD value and retain abbreviation of value
  const amount = typeof _amount === 'string' ? parseFloat(_amount) : _amount;
  let formattedAmount = `${amount}`;
  if (amount >= 1) {
    formattedAmount = formatAmount(amount);
  }
  const PriceNaN = isNaN(amount);

  return (
    <div style={{ display: 'flex', ...containerStyle }}>
      {PriceNaN === false && (
        <Statistic
          style={style}
          className="create-statistic"
          title={title || ''}
          value={`${formattedAmount} ${displaySymbol || ''}`}
          prefix={
            customPrefix || (
              <TokenCircle iconSize={iconSize} iconFile="/icons/sol.png" />
            )
          }
        />
      )}
    </div>
  );
};
