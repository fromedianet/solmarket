import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Select, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { notify } from '@oyster/common';

const { TextArea } = Input;
const categories = [
  '-',
  'pfps',
  'games',
  'art',
  'virtual_worlds',
  'music',
  'photograpy',
  'sports',
];
const MAX_FILE_SIZE = 5120 * 1024; // 5MB

export const DetailsStep = ({
  collection,
  handleAction,
  saving,
}: {
  collection: {};
  handleAction: (params) => void;
  saving: boolean;
}) => {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(collection['image']);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState(collection['banner']);
  const [isDerivative, setDerivative] = useState(collection['is_derivative']);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (selectedBanner) {
      setBannerUrl(URL.createObjectURL(selectedBanner));
    }
  }, [selectedBanner]);

  useEffect(() => {
    form.setFieldsValue({
      description: collection['description'] || '',
      original_derivative_link: collection['original_derivative_link'] || '',
      original_derivative_name: collection['original_derivative_name'] || '',
      primary_category: collection['primary_category'] || '-',
      secondary_category: collection['secondary_category'] || '-',
      twitter: collection['twitter'] || '',
      discord: collection['discord'] || '',
      website: collection['website'] || '',
    });
    if (collection['image']) {
      setImageUrl(collection['image']);
    }
    if (collection['banner']) {
      setBannerUrl(collection['banner']);
    }
    setDerivative(collection['is_derivative'] === 1);
  }, [collection]);

  const onFinish = values => {
    console.log(values);
    if (selectedImage || collection['image']) {
      const formData = {
        description: values.description,
        image: selectedImage,
        banner: selectedBanner,
        is_derivative: isDerivative ? 1 : 0,
        original_derivative_link: isDerivative
          ? values.original_derivative_link
          : null,
        original_derivative_name: isDerivative
          ? values.original_derivative_name
          : null,
        primary_category:
          values.primary_category === '-' ? null : values.primary_category,
        secondary_category:
          values.secondary_category === '-' ? null : values.secondary_category,
        twitter: values.twitter,
        discord: values.discord,
        website: values.website,
      };
      handleAction(formData);
    } else {
      notify({
        message: 'Profile image is missing',
        type: 'error',
      });
    }
  };

  return (
    <div className="step-page">
      <p className="step">Step 3 of 5</p>
      <h1>Listing details</h1>
      <p className="label">
        Enter in the details on your collection that will be used for your
        marketplace page on magiceden.io
      </p>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item label="Collection Description" name="description">
          <TextArea
            rows={2}
            placeholder="2000 unique NFTs governed by DAO"
            minLength={10}
            maxLength={1000}
            className="step-textarea"
          />
        </Form.Item>
        <>
          <div className="form-container profile">
            <p className="label">Profile Image (500x500px)</p>
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="preview-image" />
            )}
            <input
              accept="image/*"
              id="select-image"
              type="file"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  console.log('file size', file.size);
                  if (file.size > MAX_FILE_SIZE) {
                    notify({
                      message: 'Image size error',
                      description: 'Image size cannot exceed more then 5MB.',
                      type: 'error',
                    });
                  } else {
                    setSelectedImage(file);
                  }
                }
              }}
            />
            <label htmlFor="select-image" className="upload-btn">
              {imageUrl ? 'Modify Image' : 'Upload Image'}
            </label>
            <p className="description">
              Max file size 5MB. This is the image that will show on your
              collection profile page
            </p>
          </div>
          <div className="form-container banner">
            <p className="label">Banner Image (Optional)</p>
            {bannerUrl && (
              <img src={bannerUrl} alt="preview" className="preview-banner" />
            )}
            <input
              accept="image/*"
              id="select-banner"
              type="file"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  if (file.size > MAX_FILE_SIZE) {
                    notify({
                      message: 'Image size error',
                      description: 'Image size cannot exceed more then 5M.',
                      type: 'error',
                    });
                  } else {
                    setSelectedBanner(file);
                  }
                }
              }}
            />
            <label htmlFor="select-banner" className="upload-btn">
              {bannerUrl ? 'Modify Banner' : 'Upload Banner'}
            </label>
            <p className="description">
              Max file size 5MB. This is the image that will show on your
              collection profile page background
            </p>
          </div>
        </>
        <>
          <p className="caption">Derivative</p>
          <div className="form-container">
            <Switch
              className="my-switch"
              checked={isDerivative}
              onChange={checked => setDerivative(checked)}
            />
            <p className="description">
              Is your artwork a derivative of other artwork on ANY blockchain?
            </p>
          </div>
          {isDerivative && (
            <>
              <Form.Item
                label="Link To The Original Artwork"
                name="original_derivative_link"
                style={{ marginTop: 16 }}
              >
                <Input placeholder="https://" className="step-input" />
              </Form.Item>
              <Form.Item label="Original Name" name="original_derivative_name">
                <Input placeholder="Collection name" className="step-input" />
              </Form.Item>
            </>
          )}
        </>
        <>
          <p className="caption">Categories</p>
          <Form.Item
            label="Primary Category"
            name="primary_category"
            extra="Select the primary category that you would like for this collection to be listed under"
          >
            <Select className="category-select">
              {categories.map((val, index) => (
                <Select.Option key={index} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Secondary Category"
            name="secondary_category"
            extra="Select the secondary category for this collection to be listed under"
          >
            <Select className="category-select">
              {categories.map((val, index) => (
                <Select.Option key={index} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
        <>
          <p className="caption">Social & Web Links</p>
          <p className="label">
            Input your social and website links for your collection. These links
            will be displayed on your collection page
          </p>
          <Form.Item
            label="Twitter account"
            name="twitter"
            rules={[
              { required: true, message: 'Twitter account is required!' },
              {
                type: 'url',
                message: 'This field must be a valid url.',
              },
            ]}
          >
            <Input
              placeholder="https://twitter.com/xxxxx"
              className="step-input"
            />
          </Form.Item>
          <Form.Item
            label="Discord Invite Link"
            name="discord"
            rules={[
              { required: true, message: 'Discord link is required!' },
              {
                type: 'url',
                message: 'This field must be a valid url.',
              },
            ]}
          >
            <Input
              placeholder="https://discord.gg/xxxxx"
              className="step-input"
            />
          </Form.Item>
          <Form.Item
            label="Website Url (Optional)"
            name="website"
            rules={[
              {
                type: 'url',
                message: 'This field must be a valid url.',
              },
            ]}
          >
            <Input placeholder="https://" className="step-input" />
          </Form.Item>
        </>
        <Form.Item>
          <Button className="step-btn" htmlType="submit" disabled={saving}>
            {saving ? (
              <Spin />
            ) : (
              <>
                Sav & Proceed <ArrowRightOutlined />
              </>
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
