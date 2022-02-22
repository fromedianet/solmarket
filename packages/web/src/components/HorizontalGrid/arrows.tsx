import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

function Arrow(props: {
  children: ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
  className: string;
}) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={`arrow ${props.disabled ? 'tw-opacity-0' : 'tw-opacity-1'} ${
        props.className
      }`}
    >
      {props.children}
    </button>
  );
}

export function LeftArrow() {
  const {
    isFirstItemVisible,
    scrollPrev,
    visibleItemsWithoutSeparators,
    initComplete,
  } = useContext(VisibilityContext);
  const [disabled, setDisabled] = useState(
    !initComplete || (initComplete && isFirstItemVisible),
  );

  useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

  return (
    <Arrow
      disabled={disabled}
      onClick={() => scrollPrev()}
      className="left-arrow"
    >
      <LeftOutlined />
    </Arrow>
  );
}

export function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleItemsWithoutSeparators } =
    useContext(VisibilityContext);
  const [disabled, setDisabled] = useState(
    !visibleItemsWithoutSeparators.length && isLastItemVisible,
  );

  useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators]);

  return (
    <Arrow
      disabled={disabled}
      onClick={() => scrollNext()}
      className="right-arrow"
    >
      <RightOutlined />
    </Arrow>
  );
}
