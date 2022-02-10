/* eslint-disable react/display-name */
import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
// import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowDimensions from '../../utils/layout';
import { useGetSidebarState, useSetSidebarState } from '../../contexts';

export const AppLayout = React.memo(function AppLayoutImpl(props: any) {
  const { width } = useWindowDimensions();
  const { collapsed } = useGetSidebarState();
  const { handleToggle } = useSetSidebarState();
  const overSidebarClick = () => {
    if (width < 992) {
      handleToggle(true);
    }
  };
  return (
    <div className="main page">
      <header id="header">
        <AppBar />
      </header>
      <Layout id={'width-layout'} hasSider>
        <Sidebar />
        <div
          className={`my-layout-content ${collapsed && 'collapsed-sidebar'}`}
          onClick={overSidebarClick}
        >
          {props.children}
        </div>
      </Layout>
      {/*<Footer />*/}
      <ToastContainer />
    </div>
  );
});
