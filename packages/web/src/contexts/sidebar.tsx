import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import useWindowDimensions from '../utils/layout';

interface Props {
  children: ReactNode;
}

type SidebarState = {
  collapsed: boolean;
};

interface Handler {
  handleToggle: (status?: boolean) => void;
}

export const getContext = createContext<SidebarState>({
  collapsed: false,
});
export const setContext = createContext<Handler>({
  handleToggle: () => {},
});

export default function SidebarProvider(props: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [width]);

  async function handleToggle(status?: boolean) {
    if (status !== undefined) {
      setCollapsed(status);
    } else {
      setCollapsed(prevState => !prevState);
    }
  }

  return (
    <getContext.Provider value={{ collapsed }}>
      <setContext.Provider value={{ handleToggle }}>
        {props.children}
      </setContext.Provider>
    </getContext.Provider>
  );
}

export const useSetSidebarState = () => useContext(setContext);
export const useGetSidebarState = () => useContext(getContext);
