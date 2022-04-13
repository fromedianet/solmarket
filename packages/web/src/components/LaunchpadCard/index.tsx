import React from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { ArtContent } from '../ArtContent';
import { useCountdown } from '../../hooks/useCountdown';

export const LaunchpadCard = ({
  item,
  showCountdown = false,
}: {
  item: {};
  showCountdown?: boolean;
}) => {
  const { isEnded, state } = useCountdown(item['launch_time'], showCountdown);

  return (
    <Card className="launchpad-card" hoverable={true} bordered={false}>
      <Link to={`/launchpad/${item['symbol']}`}>
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
          <h6>{item['name']}</h6>
          {showCountdown ? (
            <div className="countdown">
              {isEnded ? (
                <span style={{ color: '#009999' }}>LIVE</span>
              ) : (
                <span>{`${state.days}d ${state.hours}h ${state.minutes}m`}</span>
              )}
            </div>
          ) : (
            <span className="countdown">SOLD OUT</span>
          )}
          <Row style={{ width: '100%', marginTop: 8 }} gutter={8}>
            <Col span={10}>
              <span className="mint-item">
                ITEMS{' '}
                <span style={{ fontWeight: 500, marginLeft: 2 }}>
                  {item['mint_supply']}
                </span>
              </span>
            </Col>
            <Col span={14}>
              <span className="mint-item">
                PRICE{' '}
                <span
                  style={{ fontWeight: 500, marginLeft: 2 }}
                >{`${item['mint_price']} SOL`}</span>
              </span>
            </Col>
          </Row>
        </div>
      </Link>
    </Card>
  );
};
