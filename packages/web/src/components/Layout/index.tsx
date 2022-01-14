import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
import { Footer } from '../Footer';

const { Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <div className="main page">
      <header id='header'>
        <AppBar />
      </header>
      <Layout id={'width-layout'}>
        <Content
          style={{
            overflow: 'scroll',
            padding: '30px 48px ',
          }}
        >
          {props.children}
        </Content>
      </Layout>
      {/*<Footer />*/}
    </div>
  );
});
