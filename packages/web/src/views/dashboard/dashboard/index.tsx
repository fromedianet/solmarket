import React, { useEffect, useState } from 'react';
import { Tabs, Button, Row, Col } from 'antd';
import { BadgeText } from '../../../components/BadgeText';
import uuid from 'react-uuid';
import { useNavigate } from 'react-router-dom';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { DashboardCollectionCard } from '../../../components/DashboardCollectionCard';

const { TabPane } = Tabs;

export const DashboardView = () => {
  const navigate = useNavigate();
  const { createCollection, getMyCollections } = useCollectionsAPI();
  const [lists, setLists] = useState({
    drafts: [],
    submissions: [],
    // reviewed: [],
    listed: [],
    rejected: [],
  });

  useEffect(() => {
    // @ts-ignore
    getMyCollections().then((res: {}) => {
      if (res) {
        setLists({
          drafts: res['data'].filter(item => item.status === 'draft'),
          submissions: res['data'].filter(item => item.status === 'submitted'),
          // reviewed: res['data'].filter(item => item.status === 'reviewed'),
          listed: res['data'].filter(item => item.status === 'listed'),
          rejected: res['data'].filter(item => item.status === 'rejected'),
        });
      }
    });
  }, []);

  const handleCreate = async () => {
    const _id = uuid();

    try {
      await createCollection({ _id });
      navigate(`/dashboard/listing/${_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <Tabs
          tabBarExtraContent={
            <Button onClick={handleCreate}>Create New Collection</Button>
          }
        >
          <TabPane
            tab={<BadgeText count={lists['drafts'].length}>Drafts</BadgeText>}
            key={1}
          >
            <span className="note">
              These are your unsubmitted applications - only you can see these.
              You can return and update these at any time.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['drafts'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/listing/${item['_id']}`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane
            tab={
              <BadgeText count={lists['submissions'].length}>
                Submissions
              </BadgeText>
            }
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
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/listing/${item['_id']}`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
          {/* <TabPane
            tab={
              <BadgeText count={lists['reviewed'].length}>Reviewed</BadgeText>
            }
            key={3}
          >
            <span className="note">
              These applications have been reviewed and are awaiting final
              action from you to go live. You can update the information in
              reviewed applications at any time. These updates will still be
              subject to review. Adding your final hash list indicates that you
              are ready to be listed now and once approved, your collection will
              be live on the marketplace.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['reviewed'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/listing/${item['_id']}`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane> */}
          <TabPane
            tab={<BadgeText count={lists['listed'].length}>Listed</BadgeText>}
            key={4}
          >
            <span className="note">
              These applications are live. You can update these at any time.
              Please note: updates still need to be reviewed and accepted before
              they will be reflected live.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['listed'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/listing/${item['_id']}`}
                  />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane
            tab={
              <BadgeText count={lists['rejected'].length}>Rejected</BadgeText>
            }
            key={5}
          >
            <span className="note">
              These applications have been reviewed and rejected. Please refer
              to our content guidelines. You can edit your application and
              resubmit at any time.
            </span>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              {lists['rejected'].map((item, index) => (
                <Col key={index} span={24} md={12} lg={8} xl={6}>
                  <DashboardCollectionCard
                    item={item}
                    link={`/dashboard/listing/${item['_id']}`}
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
