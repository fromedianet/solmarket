import React, { useEffect } from 'react';
import { Row, Col, Form, Input, Button, Spin } from 'antd';

const { TextArea } = Input;

export const SubmitStep = ({
  collection,
  saving,
  handleAction,
}: {
  collection: {};
  saving: boolean;
  handleAction: (extra_info) => void;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      extra_info: collection['extra_info'] || '',
    });
  }, [collection]);

  const onFinish = values => {
    handleAction(values.extra_info);
  };

  return (
    <div className="step-page">
      <p className="step">The last step</p>
      <h1>Review & Submit</h1>
      <p className="label">
        You are ready to submit your listing application. Please review the
        details below and confirm it is correct. Click submit then you are ready
        to submit.
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
        <Row style={{ marginBottom: 24 }}>
          <Col span={10} className="review-label">
            <span>website:</span>
          </Col>
          <Col span={14} className="review-content">
            {collection['website']}
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
            {collection['launch_time']}
          </Col>
        </Row>
      </div>
      <Form
        form={form}
        className="review-form"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item label="Anything else we should know?" name="extra_info">
          <TextArea className="step-textarea" rows={4} maxLength={1000} />
        </Form.Item>
        <Form.Item>
          <Button className="step-btn" htmlType="submit">
            {saving ? <Spin /> : <span>Submit</span>}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
