import React from 'react';
import {
  Row,
  Button,
  Col,
  Input,
  InputNumber,
  Form,
  Space,
  Upload,
} from 'antd';
import { IMetadataExtension } from '@oyster/common';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useArtworkFiles } from '../useArtworkFiles';
import { ArtContent } from '../../../components/ArtContent';

const { Dragger } = Upload;

export const InfoStep = (props: {
  attributes: IMetadataExtension;
  files: File[];
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const [form] = Form.useForm();

  return (
    <>
      <Row className="call-to-action">
        <h2>Describe your item</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
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
          <Row
            className="content-action"
            style={{ marginBottom: 5, marginTop: 30 }}
          >
            <p>Add your config file to fill the input fields.</p>
            <Dragger
              accept=".json"
              style={{ padding: 20, background: 'rgba(255, 255, 255, 0.08)' }}
              multiple={false}
              maxCount={1}
              onChange={async info => {
                const file = info.file.originFileObj;
                const fileReader = new FileReader();
                fileReader.onload = function (e) {
                  const content = e.target?.result;
                  const intern = JSON.parse(content);
                  props.setAttributes({
                    ...intern,
                  });
                  form.setFieldsValue({ attributes: intern.attributes });
                };
                fileReader.readAsText(file);
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: '#6d6d6d' }} />
              </p>
              <p
                className="ant-upload-text"
                style={{ color: '#f8f7f8', fontSize: 18, fontWeight: 600 }}
              >
                Add your config file(JSON)
              </p>
              <p className="ant-upload-text" style={{ color: '#6d6d6d' }}>
                Drag and drop, or click to browse
              </p>
            </Dragger>
          </Row>
        </Col>
        <Col span={24} lg={12}>
          <label className="action-field">
            <span className="field-title">Title</span>
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
          </label>
          <label className="action-field">
            <span className="field-title">Symbol</span>
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
          </label>

          <label className="action-field">
            <span className="field-title">Description</span>
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
          </label>
          <label className="action-field">
            <span className="field-title">Maximum Supply</span>
            <InputNumber
              placeholder="Quantity"
              controls={false}
              onChange={(val: number) => {
                props.setAttributes({
                  ...props.attributes,
                  properties: {
                    ...props.attributes.properties,
                    maxSupply: val,
                  },
                });
              }}
              className="royalties-input"
            />
          </label>
          <label className="action-field">
            <span className="field-title">Attributes</span>
          </label>
          <Form name="dynamic_attributes" form={form} autoComplete="off">
            <Form.List name="attributes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Space key={key} align="baseline">
                      <Form.Item name={[name, 'trait_type']} hasFeedback>
                        <Input placeholder="trait_type (Optional)" />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                        hasFeedback
                      >
                        <Input placeholder="value" />
                      </Form.Item>
                      {/* <Form.Item name={[name, 'display_type']} hasFeedback>
                        <Input placeholder="display_type (Optional)" />
                      </Form.Item> */}
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add attribute
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Col>
      </Row>

      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            form.validateFields().then(values => {
              const nftAttributes = values.attributes;
              // value is number if possible
              for (const nftAttribute of nftAttributes || []) {
                const newValue = Number(nftAttribute.value);
                if (!isNaN(newValue)) {
                  nftAttribute.value = newValue;
                }
              }
              console.log('Adding NFT attributes:', nftAttributes);
              props.setAttributes({
                ...props.attributes,
                attributes: nftAttributes,
              });

              props.confirm();
            });
          }}
          className="action-btn"
        >
          Continue to royalties
        </Button>
      </Row>
    </>
  );
};
