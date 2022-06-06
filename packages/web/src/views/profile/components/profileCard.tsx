import React from 'react';
import { Card, Row, Col } from 'antd';
import { ArtContent } from '../../../components/ArtContent';
import { formatAmount } from '@oyster/common';

export const ProfileCard = ({
  item,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemId,
  onSelect,
}: {
  item: {};
  itemId: string;
  onSelect: (a: string) => void;
}) => {
  return (
    <Card
      className="profile-card"
      hoverable={true}
      bordered={false}
      onClick={() => onSelect(item['symbol'])}
    >
      <div className="image-over image-container">
        <ArtContent
          className="image no-event"
          uri={item['image'] || ''}
          preview={false}
          artview={true}
          allowMeshRender={false}
        />
      </div>
      <div className="card-caption">
        <span className="card-name">{item['name']}</span>
        <Row style={{ width: '100%', marginTop: 8 }} gutter={8}>
          {item['volume'] > 0 && (
            <Col span={12}>
              <span className="mint-item">
                <span style={{ fontWeight: 500 }}>{`${formatAmount(
                  item['volume'],
                  2,
                  true,
                )} SOL`}</span>
              </span>
            </Col>
          )}
          <Col span={item['volume'] > 0 ? 12 : 24}>
            <span className="mint-item">
              Items:{' '}
              <span style={{ fontWeight: 500, marginLeft: 4 }}>
                {formatAmount(item['items'], 0, true)}
              </span>
            </span>
          </Col>
        </Row>
      </div>
    </Card>
  );
};
