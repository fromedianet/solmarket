import React, { useEffect, useState } from 'react';

export const CopySpan = ({
  value,
  copyText,
  className,
}: {
  value: string,
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
    <div className={className} onClick={onClick} title={'Copied'}>
      <span>{value}</span>
    </div>
  );
};
