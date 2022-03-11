import React from 'react';
import { Dashboard } from './dashboard';
import { Spin } from 'antd';
import { Login } from './login';
import { useDashboard } from '../../contexts/dashboardProvider';

export const DashboardView = () => {
  const { loading, user, isConfigured } = useDashboard();

  if (!isConfigured) {
    return;
  }

  return <>{loading ? <Spin /> : user ? <Dashboard /> : <Login />}</>;
};
