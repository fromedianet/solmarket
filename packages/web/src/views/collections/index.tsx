import React from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'antd';
import { CollectionCard } from './components/CollectionCard';

const dummyData = [
  'C11Rotyyu7VFEiHLsMt6KQQaBronzjqCQLwyscxhJ4y1',
  '7WP7RJWd7jptPGWTpXw5n6wnWXQU33g4nPjf1C3XoF5g',
  '7PHKnLg4gRXWvAmz19EwntwMBnNuphu89AtgM78tE8ME',
  'FEd6kXA6FS8hzE29sc8pWJmnv9ZX6GNkxueibcEvzSaD',
];

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const CollectionsView = () => {
  const query = useQuery();
  const type = query.get('type');
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
          {dummyData.map((pubkey, index) => (
            <Col key={index} span={12} md={8} lg={8} xl={6} xxl={4}>
              <CollectionCard pubkey={pubkey} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
