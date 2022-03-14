import React, { useEffect, useState } from 'react';
import { Tabs, Button, Card, Row, Col } from 'antd';
import { DashboardHeader } from './header';
import { BadgeText } from '../../components/BadgeText';
import uuid from 'react-uuid';
import Router from 'next/router';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { Link } from 'react-router-dom';
import { ArtContent } from '../../components/ArtContent';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { notify } from '@oyster/common';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const { TabPane } = Tabs;

export const Dashboard = ({ user }: { user: any }) => {
  const { createCollection, getCollectionsByEmail } = useCollectionsAPI();
  const [lists, setLists] = useState({
    drafts: [],
    submissions: [],
    reviewed: [],
    listed: [],
    rejected: [],
  });

  useEffect(() => {
    // @ts-ignore
    getCollectionsByEmail(user.email).then((res: {}) => {
      if (res['data']) {
        setLists({
          drafts: res['data'].filter(item => item.status === 'draft'),
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

  const handleCreate = async () => {
    const _id = uuid();

    createCollection({
      _id: _id,
      email: user['email'],
      // @ts-ignore
    }).then((res: {}) => {
      if (res['message']) {
        notify({
          message: 'Create collection has failed!',
          description: res['message'],
          type: 'error',
        });
      } else {
        Router.push(`/dashboard/listing/${_id}`);
      }
    });
  };

  const CardItem = ({ item }: { item: {} }) => {
    console.log(item);
    return (
      <Card className={`collection-card`} hoverable={true} bordered={false}>
        <Link
          to={`/dashboard/listing/${item['_id']}/${item[
            'completed_status'
          ].toString()}`}
        >
          <div className="image-over image-container">
            <ArtContent
              className="image no-event"
              uri={item['image'] || ''}
              preview={false}
              artview={true}
              allowMeshRender={false}
            />
          </div>
          <div className="card-caption">
            <h6>{item['name'] || 'Untitled'}</h6>
            <span>{`Edited: ${timeAgo.format(
              Date.parse(item['updated_at']),
            )}`}</span>
          </div>
        </Link>
      </Card>
    );
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
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {lists['drafts'].map((item, index) => (
                  <Col key={index} span={24} md={12} lg={8} xl={6}>
                    <CardItem item={item} />
                  </Col>
                ))}
              </Row>
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
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {lists['submissions'].map((item, index) => (
                  <Col key={index} span={24} md={12} lg={8} xl={6}>
                    <CardItem item={item} />
                  </Col>
                ))}
              </Row>
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
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {lists['reviewed'].map((item, index) => (
                  <Col key={index} span={24} md={12} lg={8} xl={6}>
                    <CardItem item={item} />
                  </Col>
                ))}
              </Row>
            </TabPane>
            <TabPane tab={<BadgeText count={5}>Listed</BadgeText>} key={4}>
              <span className="note">
                These applications are live. You can update these at any time.
                Please note: updates still need to be reviewed and accepted
                before they will be reflected live.
              </span>
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {lists['listed'].map((item, index) => (
                  <Col key={index} span={24} md={12} lg={8} xl={6}>
                    <CardItem item={item} />
                  </Col>
                ))}
              </Row>
            </TabPane>
            <TabPane tab={<BadgeText count={5}>Rejected</BadgeText>} key={5}>
              <span className="note">
                These applications have been reviewed and rejected. Please refer
                to our content guidelines. You can edit your application and
                resubmit at any time.
              </span>
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {lists['rejected'].map((item, index) => (
                  <Col key={index} span={24} md={12} lg={8} xl={6}>
                    <CardItem item={item} />
                  </Col>
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
