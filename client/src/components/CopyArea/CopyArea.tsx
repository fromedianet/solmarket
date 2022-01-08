import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FiCopy } from "react-icons/fi";
import "./index.css";

export default function CopyArea({ value }: any) {
  const [tooltip, setTooltip] = useState("Copy to clipboard");
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setTooltip("Copied");
  };

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
      <div
        className="copy-img"
        onClick={handleCopy}
        onPointerLeave={() => setTooltip("Copy to clipboard")}
      >
        <FiCopy />
      </div>
    </OverlayTrigger>
  );
}
