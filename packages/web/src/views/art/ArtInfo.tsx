import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { IMetadataExtension } from '@oyster/common';
import { Art } from '../../types';
import { useArt } from '../../hooks';

const menu = (
  <Menu>
    <Menu.Item key="facebook">
      <Link to={'/'} className="social-menu-item">
        <img width={24} src={'/icons/facebook2.png'} />
        <span>Share on Facebook</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="twitter">
      <Link to={'/'} className="social-menu-item">
        <img width={24} src={'/icons/twitter2.png'} />
        <span>Share on Twitter</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="telegram">
      <Link to={'/'} className="social-menu-item">
        <img width={24} src={'/icons/telegram2.png'} />
        <span>Share on Telegram</span>
      </Link>
    </Menu.Item>
  </Menu>
);

export const ArtInfo = (props: {
  pubkey: string;
  art: Art;
  data: IMetadataExtension | undefined;
}) => {
  const collection = useArt(props.art.collection || '');
  return (
    <div className="collection-container">
      <Link
        to={`/collection/${props.art.collection}`}
        className="collection-name"
      >
        <img width={20} src={'/icons/check.svg'} />
        <span>{collection.title}</span>
      </Link>
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="social-share" onClick={e => e.preventDefault()}>
          <img width={20} src={'/icons/share.svg'} />
          <span>Share</span>
        </a>
      </Dropdown>
      <div onClick={() => {}}>
        <img width={20} src={'/icons/refresh.svg'} />
      </div>
    </div>
  );
};
