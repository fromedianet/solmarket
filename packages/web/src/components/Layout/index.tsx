/* eslint-disable react/display-name */
import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
// import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';

const { Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <div className="main page">
      <header id="header">
        <AppBar />
      </header>
      <Sidebar />
      <Layout id={'width-layout'}>
        <Content className="my-layout-content">{props.children}</Content>
      </Layout>
      {/*<Footer />*/}
    </div>
  );
});
