import React, { ReactNode } from 'react';

export const BadgeText = (props: {
  count: number;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <span className={`badge-text ${props.className && props.className}`}>
      {props.children}
      {props.count > 0 && (
        <span className="badge-count">
          {props.count > 100 ? '99+' : props.count}
        </span>
      )}
    </span>
  );
};
