import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Spin, Form } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { MetaplexModal, notify, useQuerySearch } from '@oyster/common';
import moment from 'moment';
import { useCollectionsAPI } from '../../../../hooks/useCollectionsAPI';

export const DashboardAdminDetails = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useQuerySearch();
  const type = searchParams.get('type') || '';
  const [form] = Form.useForm();
  const history = useHistory();
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { getCollectionById, updateCollectionStatus } = useCollectionsAPI();

  useEffect(() => {
    setLoading(true);
    // @ts-ignore
    getCollectionById(id).then((res: {}) => {
      if (res['data']) {
        setCollection(res['data']);
      } else {
        notify({
          message: res['message'],
          type: 'error',
        });
        history.goBack();
      }
      setLoading(false);
    });
  }, [id]);

  const handleApprove = () => {
    const status = type === 'submission' ? 'reviewed' : 'listed';
    updateCollectionStatus({
      _id: id,
      status: status,
    }) // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          history.goBack();
        } else {
          notify({
            description: res['message'],
            type: 'error',
          });
        }
      })
      .catch(err => {
        notify({
          message: err.message,
          type: 'error',
        });
      });
  };

  const handleReject = (values) => {
    updateCollectionStatus({
      _id: id,
      status: "rejected",
      extra_info: values.reject_info
    }) // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          history.goBack();
        } else {
          notify({
            description: res['message'],
            type: 'error',
          });
        }
      })
      .catch(err => {
        notify({
          message: err.message,
          type: 'error',
        });
      });

    setShowRejectModal(false);
  };

  return (
    <div className="listing-page">
      {loading ? (
        <div className="load-container">
          <Spin size="large" />
        </div>
      ) : (
        Object.keys(collection).length > 0 && (
          <div className="listing-container container">
            <div className="step-page" style={{ maxWidth: 1024 }}>
              <h1>Review</h1>
              <p className="label">
                You are ready to submit your listing application. Please review
                the details below and confirm it is correct. Click submit then
                you are ready to submit.
              </p>
              <div className="review-container">
                <Row style={{ marginBottom: 24 }}>
                  <Col span={10} className="review-label">
                    legal permission:
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['permission']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>name:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['name']}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 24 }}>
                  <Col span={10} className="review-label">
                    <span>symbol:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['symbol']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>total supply:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['mint_supply']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>description:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['description']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>category primary:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['primary_category']}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 24 }}>
                  <Col span={10} className="review-label">
                    <span>category secondary:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['secondary_category']}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 24 }}>
                  <Col span={10} className="review-label">
                    <span>collection pfp:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    <img
                      src={collection['image']}
                      alt="profile photo"
                      width={200}
                      height={200}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>twitter:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['twitter']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>discord:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['discord']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>website:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['website']}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 24 }}>
                  <Col span={10} className="review-label">
                    <span>email:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['email']}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="review-label">
                    <span>candymachine ids:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {collection['candymachine_ids'].toString()}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 24 }}>
                  <Col span={10} className="review-label">
                    <span>mint date:</span>
                  </Col>
                  <Col span={14} className="review-content">
                    {moment
                      .utc(collection['launch_time'])
                      .local()
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </Col>
                </Row>
              </div>
              {(type === 'submission' || type === 'reviewed') && (
                <div className="btn-container">
                  <Button className="approve-btn" onClick={handleApprove}>
                    {type === 'submission' ? 'Approve' : 'List Now'}
                  </Button>
                  <Button className="reject-btn" onClick={() => setShowRejectModal(true)}>
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      )}
      <MetaplexModal
        visible={showRejectModal}
        onCancel={() => setShowRejectModal(false)}
        centered={true}
        title="Reject collection"
      >
        <Form form={form} layout="vertical" onFinish={handleReject}>
          <Form.Item
            label="Reject reason"
            name="reject_info"
            rules={[{ required: true, message: "Reject reason is required" }]}
          >
            <Input.TextArea
              autoFocus
              rows={4}
              maxLength={1000}
              className="step-textarea"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: '8px' }}>
            <Button
              style={{ width: '100%', height: '40px', background: '#ff4d4f', border: 'none' }}
              htmlType="submit"
            >
              Reject
            </Button>
          </Form.Item>
        </Form>
      </MetaplexModal>
    </div>
  );
};
