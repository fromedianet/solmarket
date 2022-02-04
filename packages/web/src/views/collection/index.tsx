import React, { useEffect } from 'react';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';

export const CollectionView = () => {
  const { width } = useWindowDimensions();
  const { handleToggle } = useSetSidebarState();

  function useComponentWillUnmount(cleanupCallback = () => {}) {
    const callbackRef = React.useRef(cleanupCallback)
    callbackRef.current = cleanupCallback // always up to date
    React.useEffect(() => {
      return () => callbackRef.current()
    }, [])
  }

  useEffect(() => {
    if (width > 768) {
      handleToggle(true);
    }
  });

  useComponentWillUnmount(() => {
    if (width > 768) {
      handleToggle(false);
    }
  });

  return (
    <div className='collection-page'>
      <div></div>
      <div></div>
    </div>
  );
}
