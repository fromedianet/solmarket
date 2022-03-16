import React from 'react';
import { Spin, Button } from 'antd';
import { Login } from './login';
import { useDashboard } from '../../contexts/dashboardProvider';
import Router from 'next/router';
import { DashboardHeader } from './header';

export const DashboardLayout = React.memo(function AppLayoutImpl(props: any) {
  const { loading, user, isConfigured } = useDashboard();

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
      {loading ? (
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
