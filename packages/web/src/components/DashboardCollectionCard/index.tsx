import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { ArtContent } from '../ArtContent';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

export const DashboardCollectionCard = ({
  item,
  link,
}: {
  item: {};
  link: string;
}) => {
  return (
    <Card className={`collection-card`} hoverable={true} bordered={false}>
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
          <span className="card-name">{item['name'] || 'Untitled'}</span>
          <span>{`Edited: ${timeAgo.format(
            Date.parse(item['updatedAt']),
          )}`}</span>
        </div>
      </Link>
    </Card>
  );
};
