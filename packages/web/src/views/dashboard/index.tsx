import React from 'react';
import { Button, Spin } from 'antd';
import { Login } from './login';
import { useDashboard } from '../../contexts/dashboardProvider';
import Router from 'next/router';
import { DashboardHeader } from './header';

export const DashboardLayout = React.memo(function AppLayoutImpl(props: any) {
  const { user, fetching, isConfigured } = useDashboard();

  if (!isConfigured) {
    return (
      <div className="dashboard-layout">
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
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {fetching ? (
        <div className="load-container">
          <Spin size="large" />
        </div>
      ) : user ? (
        <>
          <DashboardHeader />
          {props.children}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
});
