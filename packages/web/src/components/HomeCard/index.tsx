import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { ArtContent } from '../ArtContent';
import { useCountdown } from '../../hooks/useCountdown';

export const HomeCard = ({
  item,
  link,
  showCountdown = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemId,
}: {
  item: {};
  link: string;
  showCountdown?: boolean;
  itemId: string;
}) => {
  const { isEnded, state } = useCountdown(item['publishedAt'], showCountdown);

  return (
    <Card className={`home-card`} hoverable={true} bordered={false}>
      <Link to={link}>
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
          <div className="note">
            <span className="symbol">{item['name']}</span>
            <img src="/icons/check-circle.svg" alt="check-circle" />
          </div>
          {showCountdown && (
            <div className="countdown-container">
              {isEnded ? (
                <span style={{ color: '#009999' }}>Live</span>
              ) : (
                <span>{`${state.days}d ${state.hours}h ${state.minutes}m`}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};
