import React from 'react';
import { useAuthToken } from '../../contexts/authProvider';

export const DashboardHeader = () => {
  const { isAdmin, removeAuthToken } = useAuthToken();
  return (
    <nav className="header container">
      <a href="/" className="logo">
        <img src="/papercity-logo.png" height={50} />
      </a>
      <div>
        <a href="/dashboard" className="header-menu">
          Dashboard
        </a>
        {isAdmin && (
          <a href="/dashboard/admin" className="header-menu">
            Admin
          </a>
        )}
        <a className="header-menu" onClick={removeAuthToken}>
          Log out
        </a>
      </div>
      {/* <a href="/api/logout" className="signout">
        Sign out
      </a> */}
    </nav>
  );
};
