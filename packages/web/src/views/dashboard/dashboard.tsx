import React from 'react';
import { Tabs, Button } from 'antd';
import { DashboardHeader } from './header';
import { BadgeText } from '../../components/BadgeText';
import Router from 'next/router';

const { TabPane } = Tabs;

export const Dashboard = () => {
  const handleCreate = () => {
    Router.push('/dashboard/listing/');
  };

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <div className="dashboard-container">
        <div className="container">
          <Tabs
            tabBarExtraContent={
              <Button onClick={handleCreate}>Create New Collection</Button>
            }
          >
            <TabPane tab={<BadgeText count={5}>Drafts</BadgeText>} key={1}>
              <span className="note">
                These are your unsubmitted applications - only you can see
                these. You can return and update these at any time.
              </span>
            </TabPane>
            <TabPane
              tab={<BadgeText count={500}>Submissions</BadgeText>}
              key={2}
            >
              <span className="note">
                These applications have been submitted for review. Please be
                patient, as during busy periods it can take up to 48 hours for
                applications to be reviewed. You can update your submissions for
                review at any time.
              </span>
            </TabPane>
            <TabPane tab={<BadgeText count={5}>Reviewed</BadgeText>} key={3}>
              <span className="note">
                These applications have been reviewed and are awaiting final
                action from you to go live. You can update the information in
                reviewed applications at any time. These updates will still be
                subject to review. Adding your final hash list indicates that
                you are ready to be listed now and once approved, your
                collection will be live on the marketplace.
              </span>
            </TabPane>
            <TabPane tab={<BadgeText count={5}>Listed</BadgeText>} key={4}>
              <span className="note">
                These applications are live. You can update these at any time.
                Please note: updates still need to be reviewed and accepted
                before they will be reflected live.
              </span>
            </TabPane>
            <TabPane tab={<BadgeText count={5}>Rejected</BadgeText>} key={5}>
              <span className="note">
                These applications have been reviewed and rejected. Please refer
                to our content guidelines. You can edit your application and
                resubmit at any time.
              </span>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
