import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useWindowDimensions from '../utils/layout';

interface Props {
  children: ReactNode;
}

type SidebarState = {
  isShown: boolean;
};

interface Handler {
  handleToggle: () => void;
}

export const getContext = createContext<SidebarState>({
  isShown: true
});
export const setContext = createContext<Handler>({
  handleToggle: () => {}
});

export default function SidebarProvider(props: Props) {
  const [isShown, setShown] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < 768) {
      setShown(false);
    } else {
      setShown(true);
    }
  }, [width]);

  async function handleToggle() {
    setShown((prevState) => !prevState);
  }

  return (
    <getContext.Provider value={{ isShown }}>
      <setContext.Provider value={{ handleToggle }}>
        {props.children}
      </setContext.Provider>
    </getContext.Provider>
  )
}

export const useSetSidebarState = () => useContext(setContext);
export const useGetSidebarState = () => useContext(getContext);