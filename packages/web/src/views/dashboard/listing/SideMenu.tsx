import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export const SideMenu = ({
  step,
  collection,
}: {
  step: number;
  collection: {};
}) => {
  return (
    <Menu className="editor-menu" theme="dark" selectedKeys={[step.toString()]}>
      <h6>Apply for Listing</h6>
      <Menu.Item key={0}>
        <Link
          to={`/dashboard/listing/${collection['_id']}/1`}
          className="menu-item"
        >
          <span>Introduction</span>
          {collection['completed_status'] >= 0 &&
            collection['visited_status'] > 0 && (
              <img src="/icons/icon-check.svg" width={24} />
            )}
        </Link>
      </Menu.Item>
      <Menu.Item key={1} disabled={collection['visited_status'] < 1}>
        <Link
          to={`/dashboard/listing/${collection['_id']}/2`}
          className="menu-item"
        >
          <span>Collection</span>
          {collection['completed_status'] >= 1 && (
            <img src="/icons/icon-check.svg" width={24} />
          )}
        </Link>
      </Menu.Item>
      <Menu.Item key={2} disabled={collection['visited_status'] < 2}>
        <Link
          to={`/dashboard/listing/${collection['_id']}/3`}
          className="menu-item"
        >
          <span>Details</span>
          {collection['completed_status'] >= 2 && (
            <img src="/icons/icon-check.svg" width={24} />
          )}
        </Link>
      </Menu.Item>
      <Menu.Item key={3} disabled={collection['visited_status'] < 3}>
        <Link
          to={`/dashboard/listing/${collection['_id']}/4`}
          className="menu-item"
        >
          <span>Hash List</span>
          {collection['completed_status'] >= 3 && (
            <img src="/icons/icon-check.svg" width={24} />
          )}
        </Link>
      </Menu.Item>
      <Menu.Item key={4} disabled={collection['visited_status'] < 4}>
        <div className="menu-item">
          <span>Submit</span>
          {collection['completed_status'] >= 4 && (
            <img src="/icons/icon-check.svg" width={24} />
          )}
        </div>
      </Menu.Item>
    </Menu>
  );
};
