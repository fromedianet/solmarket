import React, { useState } from "react";

export default function ReadMore(props: {
  children: string;
  maxLength: number;
}) {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <div className="read-more">
      {isReadMore ? props.children.slice(0, props.maxLength) : props.children}
      {props.children.length > props.maxLength && (
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...read more" : " show less"}
        </span>
      )}
    </div>
  );
}
