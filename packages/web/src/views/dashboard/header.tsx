import React from 'react';

export const DashboardHeader = () => {
  return (
    <nav className="header container">
      <a href="/" className="logo">
        <img src="/papercity-logo.png" height={50} />
      </a>
      {/* <a href="/api/logout" className="signout">
        Sign out
      </a> */}
    </nav>
  );
};