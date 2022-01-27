import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';

export const CopySpan = ({
  value,
  copyText,
  className,
}: {
  value: string;
  copyText: string;
  className: string;
}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClicked(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [clicked]);

  const onClick = () => {
    navigator.clipboard.writeText(copyText);
    setClicked(true);
  };

  return (
    <Tooltip title={clicked ? 'Copied' : 'Click to copy'}>
      <span
        className={className}
        style={{ cursor: 'pointer' }}
        onClick={onClick}
      >
        {value}
      </span>
    </Tooltip>
  );
};
