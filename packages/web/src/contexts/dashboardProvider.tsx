import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';

interface DashboardConfig {
  user: {} | undefined;
  fetching: boolean;
  isConfigured: boolean;
}

export const DashboardContext = createContext<DashboardConfig>(null!);

export const DashboardProvider: FC<{
  magicLinkKey?: string;
}> = ({ children, magicLinkKey }) => {
  const initMagicLinkKey =
    magicLinkKey || process.env.NEXT_PUBLIC_MAGICLINK_KEY;
  const isConfigured = Boolean(initMagicLinkKey);
  const [user, setUser] = useState();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data?.user);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  return (
    <DashboardContext.Provider value={{ user, fetching, isConfigured }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext);
};
