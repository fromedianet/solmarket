import React from 'react';
import { Dashboard } from './dashboard';
import { Spin, Button } from 'antd';
import { Login } from './login';
import { useDashboard } from '../../contexts/dashboardProvider';
import Router from 'next/router';

export const DashboardView = () => {
  const { loading, user, isConfigured } = useDashboard();

  if (!isConfigured) {
    return (
      <div className="not-configured">
        <span>Magic Link publishableKey required</span>
        <Button
          onClick={() => {
            Router.push('/');
            Router.reload();
          }}
        >
          Return
        </Button>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="load-container">
          <Spin size="large" />
        </div>
      ) : user ? (
        <Dashboard user={user} />
      ) : (
        <Login />
      )}
    </>
  );
};
