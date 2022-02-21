import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';

function Arrow(props: {
  children: ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        right: '1%',
        opacity: props.disabled ? '0' : '1',
        userSelect: 'none'
      }}
    >
      {props.children}
    </button>
  );
}

export function LeftArrow() {
  const { isFirstItemVisible, scrollPrev, visibleItemsWithoutSeparators, initComplete } = useContext(VisibilityContext);
  const [disabled, setDisabled] = useState(!initComplete || (initComplete && isFirstItemVisible));
  
  useEffect(() => {
    if (visibleItemsWithoutSeparators.length > 0) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

  return (
    <Arrow disabled={disabled} onClick={scrollPrev}>Left</Arrow>
  )
}

export function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleItemsWithoutSeparators } = useContext(VisibilityContext);
  const [disabled, setDisabled] = useState(!visibleItemsWithoutSeparators.length && isLastItemVisible);

  useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators]);

  return (
    <Arrow disabled={disabled} onClick={scrollNext}>Right</Arrow>
  );
}
