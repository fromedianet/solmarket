import React from 'react';

export const DashboardHeader = () => {
  return (
    <nav className="header container">
      <a href="/" className="logo">
        <img src="/papercity-logo.png" height={50} />
      </a>
      <div>
        <a href="/dashboard/dashboard" className="header-menu">
          Dashboard
        </a>
        <a href="/dashboard/review" className="header-menu">
          Review
        </a>
      </div>
      {/* <a href="/api/logout" className="signout">
        Sign out
      </a> */}
    </nav>
  );
};
