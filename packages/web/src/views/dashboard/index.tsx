import React, { useEffect, useState } from 'react';
import { Dashboard } from './dashboard';
import { Spin } from 'antd';
import { Login } from './login';
import { Magic } from 'magic-sdk';

export const DashboardView = () => {
  const [data, setData] = useState<{ loading?: boolean; user?: any }>({});

  useEffect(() => {
    setData({ loading: true });
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGICLINK_KEY || '');
    magic.user.isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        magic.user.getMetadata().then(userData => {
          setData({ loading: false, user: userData });
        });
      } else {
        setData({ loading: false, user: null });
      }
    });
  }, []);

  return <>{data.loading ? <Spin /> : data.user ? <Dashboard /> : <Login />}</>;
};
