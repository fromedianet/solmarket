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
    <div className="editor editor-sticky">
      <span className="editor-name">Apply for Listing</span>
      <Menu
        className="editor-menu"
        theme="dark"
        selectedKeys={[step.toString()]}
        items={[
          {
            key: 1,
            label: (
              <div className="menu-item">
                <span>Introduction</span>
                {collection['completed_status'] >= 1 && (
                  <img
                    src="/icons/icon-check.svg"
                    width={24}
                    alt="check icon"
                  />
                )}
              </div>
            ),
            onClick: () => setStep(1),
          },
          {
            key: 2,
            label: (
              <div className="menu-item">
                <span>Collection</span>
                {collection['completed_status'] >= 2 && (
                  <img
                    src="/icons/icon-check.svg"
                    width={24}
                    alt="check icon"
                  />
                )}
              </div>
            ),
            disabled: collection['visited_status'] < 2,
            onClick: () => setStep(2),
          },
          {
            key: 3,
            label: (
              <div className="menu-item">
                <span>Details</span>
                {collection['completed_status'] >= 3 && (
                  <img
                    src="/icons/icon-check.svg"
                    width={24}
                    alt="check icon"
                  />
                )}
              </div>
            ),
            disabled: collection['visited_status'] < 3,
            onClick: () => setStep(3),
          },
          {
            key: 4,
            label: (
              <div className="menu-item">
                <span>Hash List</span>
                {collection['completed_status'] >= 4 && (
                  <img
                    src="/icons/icon-check.svg"
                    width={24}
                    alt="check icon"
                  />
                )}
              </div>
            ),
            disabled: collection['visited_status'] < 4,
            onClick: () => setStep(4),
          },
          {
            key: 5,
            label: (
              <div className="menu-item">
                <span>Collection</span>
                {collection['completed_status'] == 5 && (
                  <img
                    src="/icons/icon-check.svg"
                    width={24}
                    alt="check icon"
                  />
                )}
              </div>
            ),
            disabled: collection['visited_status'] < 5,
            onClick: () => setStep(5),
          },
        ]}
      />
    </div>
  );
};
