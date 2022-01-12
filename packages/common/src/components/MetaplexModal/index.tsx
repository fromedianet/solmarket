import React from 'react';
import { Modal } from 'antd';

export const MetaplexModal = (props: any) => {
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
};
