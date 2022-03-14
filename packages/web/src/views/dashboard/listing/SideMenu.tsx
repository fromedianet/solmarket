import React from 'react';
import { Menu } from 'antd';

export const SideMenu = ({
  step,
  collection,
  setStep,
}: {
  step: number;
  collection: {};
  setStep: (val) => void;
}) => {
  return (
    <div className="editor">
      <h6>Apply for Listing</h6>
      <Menu
        className="editor-menu"
        theme="dark"
        selectedKeys={[step.toString()]}
      >
        <Menu.Item key="1" onClick={() => setStep(1)}>
          <div className="menu-item">
            <span>Introduction</span>
            {collection['completed_status'] >= 1 && (
              <img src="/icons/icon-check.svg" width={24} />
            )}
          </div>
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => setStep(2)}
          disabled={collection['visited_status'] < 2}
        >
          <div className="menu-item">
            <span>Collection</span>
            {collection['completed_status'] >= 2 && (
              <img src="/icons/icon-check.svg" width={24} />
            )}
          </div>
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => setStep(3)}
          disabled={collection['visited_status'] < 3}
        >
          <div className="menu-item">
            <span>Details</span>
            {collection['completed_status'] >= 3 && (
              <img src="/icons/icon-check.svg" width={24} />
            )}
          </div>
        </Menu.Item>
        <Menu.Item
          key="4"
          onClick={() => setStep(4)}
          disabled={collection['visited_status'] < 4}
        >
          <div className="menu-item">
            <span>Hash List</span>
            {collection['completed_status'] >= 4 && (
              <img src="/icons/icon-check.svg" width={24} />
            )}
          </div>
        </Menu.Item>
        <Menu.Item
          key="5"
          onClick={() => setStep(5)}
          disabled={collection['visited_status'] < 5}
        >
          <div className="menu-item">
            <span>Submit</span>
            {collection['completed_status'] == 5 && (
              <img src="/icons/icon-check.svg" width={24} />
            )}
          </div>
        </Menu.Item>
      </Menu>
    </div>
  );
};
