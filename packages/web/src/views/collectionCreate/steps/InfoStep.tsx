import React, { useEffect } from 'react';
import {
  Row,
  Button,
  Col,
  Input,
  Form,
} from 'antd';
import { Creator, IMetadataExtension } from '@oyster/common';
import { useArtworkFiles } from '../../../hooks/useArtworkFiles';
import { ArtContent } from '../../../components/ArtContent';
import { useWallet } from '@solana/wallet-adapter-react';

export const InfoStep = (props: {
  attributes: IMetadataExtension;
  files: File[];
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  const [form] = Form.useForm();
  const { publicKey, connected } = useWallet();
  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );

  useEffect(() => {
    form.setFieldsValue({
      title: props.attributes.name,
      symbol: props.attributes.symbol,
      description: props.attributes.description
    });
  }, []);

  useEffect(() => {
    if (publicKey) {
      props.setAttributes({
        ...props.attributes,
        creators: [new Creator({
          address: publicKey.toBase58(),
          verified: true,
          share: 100
        })]
      });
    }
  }, [connected]);

  const onFinish = () => {
    props.confirm();
  }

  return (
    <>
      <Row className="call-to-action">
        <h2>Describe your item</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
      <Form
        form={form}
        layout='vertical'
        requiredMark={true}
        onFinish={onFinish}
      >
        <Row className="content-action" justify="center">
          <Col span={24} lg={12} style={{ paddingRight: 24 }}>
            {props.attributes.image && (
              <div className="thumb-container">
                <div className="thumb-content">
                  <ArtContent
                    uri={image}
                    animationURL={animation_url}
                    category={props.attributes.properties?.category}
                    artview={!(props.files.length > 1)}
                  />
                </div>
              </div>
            )}
          </Col>
          <Col span={24} lg={12}>
            <Form.Item label="Title" name="title" rules={[{required: true, message: "Title is required."}]}>
              <Input
                autoFocus
                className="input"
                placeholder="Max 50 characters"
                maxLength={50}
                allowClear
                value={props.attributes.name}
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    name: info.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Symbol" name="symbol" rules={[{required: true, message: "Symbol is required."}]}>
              <Input
                className="input"
                placeholder="Max 10 characters"
                maxLength={10}
                allowClear
                value={props.attributes.symbol}
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    symbol: info.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea
                className="input textarea"
                placeholder="Max 500 characters"
                maxLength={500}
                value={props.attributes.description}
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    description: info.target.value,
                  })
                }
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType='submit'
            className="action-btn"
          >
            Continue to review
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
