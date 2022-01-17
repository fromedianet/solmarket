import React, { useEffect, useState } from 'react';
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";

export const ClickToCopy = ({
  copyText,
  className,
  tooltip,
}: {
  copyText: string;
  className: string;
  tooltip: string;
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
    <div className={className} onClick={onClick} title={tooltip}>
      {clicked ? <CheckOutlined style={{ color: "#00ffbd" }} /> : <CopyOutlined />}
    </div>
  );
};
