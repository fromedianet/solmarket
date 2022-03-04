import React from 'react';
import { Row, Col } from 'antd';
import { useCollection } from '../../hooks/useCollection';
import { CollectionCard } from '../../components/CollectionCard';
import { useQuerySearch } from '@oyster/common';

export const CollectionsView = () => {
  const searchParams = useQuerySearch();
  const type = searchParams.get('type');
  const collections = useCollection();
  let caption = 'All Collections';
  if (type === 'popular') {
    caption = 'Popular Collections';
  } else if (type === 'new') {
    caption = 'New Collections';
  }
  return (
    <div className="main-area">
      <div className="collections-page">
        <h1>{caption}</h1>
        <Row gutter={[16, 16]}>
          {collections.map((item, index) => (
            <Col key={index} span={12} md={8} lg={8} xl={6} xxl={4}>
              <CollectionCard pubkey={item.pubkey} preview={false} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
