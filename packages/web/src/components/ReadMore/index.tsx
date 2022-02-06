import React, { useState } from 'react';

export default function ReadMore({ children, maxLength }: any) {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <div className="read-more">
      {isReadMore ? text.slice(0, maxLength) : text}
      <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? '...read more' : ' show less'}
      </span>
    </div>
  );
}
