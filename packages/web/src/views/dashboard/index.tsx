import React from 'react';
import { Button, Spin } from 'antd';
import { Login } from './login';
import { useDashboard } from '../../contexts/dashboardProvider';
import { useHistory } from 'react-router-dom';
import { DashboardHeader } from './header';

export const DashboardLayout = React.memo(function AppLayoutImpl(props: any) {
  const { user, fetching, isConfigured } = useDashboard();
  const history = useHistory();

  if (!isConfigured) {
    return (
      <div className="dashboard-layout">
        <div className="not-configured">
          <span>Magic Link publishableKey required</span>
          <Button
            onClick={() => {
              history.push('/');
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
