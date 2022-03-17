import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { ArtContent } from '../ArtContent';
import { useCountdown } from '../../hooks/useCountdown';

export const HomeCard = ({
  item,
  link,
  showCountdown = false,
}: {
  item: {};
  link: string;
  showCountdown?: boolean
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
          <h6>{item['name']}</h6>
          <div className="note">
            <span className='symbol'>{item['name']}</span>
            <img src="/icons/check-circle.svg" alt="check-circle" />
          </div>
          {showCountdown && (
            <div className='countdown-container'>
              {isEnded ? <span style={{ color: '#009999' }}>Live</span> : (
                <span>{`${state.days}d ${state.hours}h ${state.minutes}m`}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};