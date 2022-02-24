import React, { useState } from 'react';
import { Row, Modal, ButtonProps, Col } from 'antd';
import { Metadata, ParsedAccount } from '@oyster/common';
import { useUserCollections } from '../../hooks/useUserCollections';
import { CollectionCard } from '../../components/CollectionCard';

export interface CollectionSelectorProps extends ButtonProps {
  selected: ParsedAccount<Metadata> | undefined;
  setSelected: (selected: ParsedAccount<Metadata> | undefined) => void;
}

export const CollectionSelector = (props: CollectionSelectorProps) => {
  const { selected, setSelected } = props;
  const items = useUserCollections();

  const [visible, setVisible] = useState(false);

  const open = () => {
    clear();
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  const clear = () => {
    setSelected(undefined);
  };

  const confirm = () => {
    close();
  };

  return (
    <>
      <div className="artwork-grid">
        {!selected ? (
          <div
            className="ant-card ant-card-bordered ant-card-hoverable art-card"
            style={{ width: 200, height: 300, display: 'flex' }}
            onClick={open}
          >
            <span className="text-center">Add a collection</span>
          </div>
        ) : (
          <CollectionCard
            pubkey={selected.pubkey}
            preview={false}
            noEvent={true}
            onClick={open}
            onClose={() => {
              clear();
              close();
            }}
          />
        )}
      </div>

      <Modal
        visible={visible}
        onCancel={close}
        width={1000}
        footer={null}
        className={'modalp-40 big-modal'}
      >
        <Row className="call-to-action" style={{ marginBottom: 0 }}>
          <h2>Select the collection</h2>
          <p style={{ fontSize: '1.2rem' }}>
            Select the collection that you want to choose for NFT.
          </p>
        </Row>
        <Row
          className="content-action"
          style={{ overflowY: 'auto', height: '50vh' }}
          gutter={[16, 16]}
        >
          {items.map(m => {
            const onSelect = () => {
              setSelected(m);
              confirm();
            };

            return (
              <Col key={m.pubkey} span={24} md={12} lg={8} xl={6}>
                <CollectionCard
                  pubkey={m.pubkey}
                  preview={false}
                  noEvent={true}
                  onClick={onSelect}
                />
              </Col>
            );
          })}
        </Row>
      </Modal>
    </>
  );
};
