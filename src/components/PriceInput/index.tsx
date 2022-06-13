import React, { useState } from "react";
import { InputNumber } from "antd";
interface PriceValue {
  number?: number;
}
interface PriceInputProps {
  value?: PriceValue;
  className?: string;
  placeholder?: string;
  addonAfter?: string;
  onChange?: (value: PriceValue) => void;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value = {},
  className,
  placeholder,
  addonAfter,
  onChange,
}) => {
  const [number, setNumber] = useState(0);
  const triggerChange = (changedValue: { number?: number }) => {
    onChange?.({ number, ...value, ...changedValue });
  };
  const onNumberChange = (info?: number) => {
    const newNumber = parseFloat(info?.toString() || "0");
    if (Number.isNaN(number)) {
      return;
    }
    setNumber(newNumber);
    triggerChange({ number: newNumber });
  };

  return (
    <InputNumber
      autoFocus
      className={`price-input ${className && className}`}
      placeholder={placeholder}
      controls={false}
      addonAfter={addonAfter}
      bordered={false}
      value={value.number || number}
      onChange={onNumberChange}
    />
  );
};
