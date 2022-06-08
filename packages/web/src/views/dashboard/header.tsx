import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthToken } from '../../contexts/authProvider';

export const DashboardHeader = () => {
  const { user, removeAuthToken } = useAuthToken();
  return (
    <nav className="header container">
      <Link to="/" className="logo">
        <img src="/papercity-logo.png" width={160} height={50} alt="app-logo" />
      </Link>
      <div>
        <Link to="/dashboard" className="header-menu">
          Dashboard
        </Link>
        {user?.isAdmin && (
          <Link to="/dashboard/admin" className="header-menu">
            Admin
          </Link>
        )}
        <span className="header-menu" onClick={removeAuthToken}>
          Log out
        </span>
      </div>
    </nav>
  );
};
