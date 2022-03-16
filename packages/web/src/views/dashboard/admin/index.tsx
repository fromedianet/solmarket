import { notify } from '@oyster/common';
import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs } from 'antd';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { BadgeText } from '../../../components/BadgeText';
import { DashboardCollectionCard } from '../../../components/DashboardCollectionCard';

const { TabPane } = Tabs;

export const DashboardAdmin = () => {
  const { getAllCollections } = useCollectionsAPI();
  const [lists, setLists] = useState({
    submissions: [],
    reviewed: [],
    listed: [],
    rejected: [],
  });

  useEffect(() => {
    // @ts-ignore
    getAllCollections().then((res: {}) => {
      if (res['data']) {
        setLists({
          submissions: res['data'].filter(item => item.status === 'submitted'),
          reviewed: res['data'].filter(item => item.status === 'reviewed'),
          listed: res['data'].filter(item => item.status === 'listed'),
          rejected: res['data'].filter(item => item.status === 'rejected'),
        });
      } else {
        notify({
          message: res['message'],
          type: 'error',
        });
      }
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="container">
        <Tabs>
          <TabPane
            tab={
              <BadgeText count={lists['submissions'].length}>
                Submissions
              </BadgeText>
            }
            key={1}
          >
            <span className="note">
              These applications have been submitted for review.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['submissions'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/admin/${item['_id']}?type=submission`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane
            tab={
              <BadgeText count={lists['reviewed'].length}>Reviewed</BadgeText>
            }
            key={2}
          >
            <span className="note">
              These applications have been reviewed and are awaiting final
              action to go live.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['reviewed'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/admin/${item['_id']}?type=reviewed`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane
            tab={<BadgeText count={lists['listed'].length}>Listed</BadgeText>}
            key={3}
          >
            <span className="note">These applications are live.</span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['listed'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/admin/${item['_id']}?type=listed`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane
            tab={
              <BadgeText count={lists['rejected'].length}>Rejected</BadgeText>
            }
            key={4}
          >
            <span className="note">
              These applications have been reviewed and rejected.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['rejected'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/admin/${item['_id']}?type=rejected`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
