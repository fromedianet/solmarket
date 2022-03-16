import React, {
  createContext,
  FC,
  useContext,
} from 'react';
import useSWR from 'swr';

interface DashboardConfig {
  user?: {};
  isConfigured: boolean;
}

export const DashboardContext = createContext<DashboardConfig>(null!);

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null }
    })

export const DashboardProvider: FC<{
  magicLinkKey?: string;
}> = ({ children, magicLinkKey }) => {
  const initMagicLinkKey =
    magicLinkKey || process.env.NEXT_PUBLIC_MAGICLINK_KEY;
  const isConfigured = Boolean(initMagicLinkKey);

  const { data } = useSWR('/api/user', fetcher);
  const user = data?.user || null;

  return (
    <DashboardContext.Provider value={{ user, isConfigured }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext);
};
