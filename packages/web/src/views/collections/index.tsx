import React from 'react';
import { useLocation } from 'react-router-dom';

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
      <div className="main-page">
        <div className="container">
          <div className='collections-page'>
            <h1>{caption}</h1>
            <span>Comming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
