import React from 'react';
import { Dashboard } from './dashboard';
import { useUser } from './lib/hooks';
import { Login } from './login';

export const DashboardView = () => {
  const user = useUser({ redirectTo: '/dashboard', redirectIfFound: true });
  console.log('user', user);
  return <>{user ? <Dashboard /> : <Login />}</>;
};
