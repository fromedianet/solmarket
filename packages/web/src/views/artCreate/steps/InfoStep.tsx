import React, { useEffect, useState } from 'react';
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
import { IMetadataExtension, Metadata, ParsedAccount } from '@oyster/common';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useArtworkFiles } from '../../../hooks/useArtworkFiles';
import { ArtContent } from '../../../components/ArtContent';
import { CollectionSelector } from '../collectionSelector';

const { Dragger } = Upload;

export const InfoStep = (props: {
  attributes: IMetadataExtension;
  files: File[];
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  const [selectedCollection, setSelectedCollection] = useState<ParsedAccount<Metadata>>();
  const [showCollectionError, setShowCollectionError] = useState(false);

  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      title: props.attributes.name,
      symbol: props.attributes.symbol,
      description: props.attributes.description,
      min_supply: props.attributes.properties.maxSupply,
      attributes: props.attributes.attributes
    });
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      setShowCollectionError(false);
    }
  }, [selectedCollection]);

  const onFinish = (values) => {
    const nftAttributes = values.attributes;
    // value is number if possible
    for (const nftAttribute of nftAttributes || []) {
      const newValue = Number(nftAttribute.value);
      if (!isNaN(newValue)) {
        nftAttribute.value = newValue;
      }
    }
    props.setAttributes({
      ...props.attributes,
      attributes: nftAttributes,
    });

    if (selectedCollection) {
      props.setAttributes({
        ...props.attributes,
        collection: selectedCollection.pubkey,
      })
      props.confirm();
    } else {
      setShowCollectionError(true);
    }
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
        autoComplete="off"
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
                    if (typeof content === 'string') {
                      const intern = JSON.parse(content);
                      props.setAttributes({
                        ...props.attributes,
                        ...intern,
                      });
                      form.setFieldsValue({
                        title: intern.name,
                        symbol: intern.symbol,
                        description: intern.description,
                        attributes: intern.attributes
                      });
                    }
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
            <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required." }]}>
              <Input
                autoFocus
                className="input"
                placeholder="Max 50 characters"
                maxLength={50}
                allowClear
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    name: info.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Symbol" name="symbol" rules={[{required: true, message: "Symbol is required"}]}>
              <Input
                className="input"
                placeholder="Max 10 characters"
                maxLength={10}
                allowClear
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
                onChange={info =>
                  props.setAttributes({
                    ...props.attributes,
                    description: info.target.value,
                  })
                }
                allowClear
              />
            </Form.Item>
            <Form.Item label="Minimum Supply" name="min_supply">
              <InputNumber
                placeholder="Quantity"
                controls={false}
                defaultValue={1}
                onChange={(val: number) => {
                  props.setAttributes({
                    ...props.attributes,
                    properties: {
                      ...props.attributes.properties,
                      maxSupply: val,
                    },
                  });
                }}
                className="input"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <label className='action-field'>
              <div className="field-title form-field"><span className='required-mark'>*</span>Collection</div>
              <CollectionSelector
                selected={selectedCollection}
                setSelected={setSelectedCollection}
              />
              {showCollectionError && <span style={{ color: '#ff4d4f'}}>Collection is required.</span>}
            </label>
            <label className="action-field">
              <span className="field-title form-field">Attributes</span>
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
            </label>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType='submit'
            className="action-btn"
          >
            Continue to royalties
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
