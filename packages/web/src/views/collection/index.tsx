import React, { useEffect } from 'react';
import { useSetSidebarState } from '../../contexts';
import useWindowDimensions from '../../utils/layout';
import { CollectionInfo } from './components/CollectionInfo';

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
      <div className='collection-info'>
        <CollectionInfo />
      </div>
      <div></div>
    </div>
  );
}
