import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { CollectionCard } from '../../components/CollectionCard';
import { useQuerySearch } from '@oyster/common';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';

export const CollectionsView = () => {
  const searchParams = useQuerySearch();
  const type = searchParams.get('type');
  const { getAllCollections, getNewCollections } = useCollectionsAPI();
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    if (type === 'new') {
      getNewCollections()
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setCollections(res['data']);
          }
        });
    } else {
      getAllCollections()
        // @ts-ignore
        .then((res: {}) => {
          if (res['data']) {
            setCollections(res['data']);
          }
        });
    }
  }, [type]);

  return (
    <div className="main-area">
      <div className="collections-page">
        <h1>{type === 'new' ? 'New Collections' : 'All Collections'}</h1>
        <Row gutter={[16, 16]}>
          {collections.map((item, index) => (
            <Col key={index} span={24} md={12} lg={8} xl={6}>
              <CollectionCard collection={item} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
