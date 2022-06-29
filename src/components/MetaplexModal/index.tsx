import React from "react";
import { Modal } from "antd";

export default function MetaplexModal(props: any) {
  const { children, bodyStyle, className, ...rest } = props;

  return (
    <Modal
      bodyStyle={{
        ...bodyStyle,
      }}
      className={`meta-modal ${className}`}
      centered
      closable
      footer={null}
      {...rest}
    >
      {children}
    </Modal>
  );
}
