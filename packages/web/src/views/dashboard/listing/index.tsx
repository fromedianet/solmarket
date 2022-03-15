import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Spin } from 'antd';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { DashboardHeader } from '../header';
import { EmptyView } from '../../../components/EmptyView';
import { SideMenu } from './SideMenu';
import { IntroStep } from './steps/IntroStep';
import { notify } from '@oyster/common';
import { CollectionStep } from './steps/CollectionStep';
import { DetailsStep } from './steps/DetailsStep';
import { CandyMachineStep } from './steps/CandyMachineStep';
import { SubmitStep } from './steps/SubmitStep';
import { useHistory } from 'react-router-dom';

export const DashboardListingView = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [step, setStep] = useState<number>(1);
  const {
    getCollectionById,
    collectionStep1,
    collectionStep2,
    collectionStep3,
    collectionStep4,
    collectionSubmit,
  } = useCollectionsAPI();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [collection, setCollection] = useState({});

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
      }
      setLoading(false);
    });
  }, [id]);

  const processStep1 = permission => {
    setSaving(true);
    collectionStep1({ _id: id, permission: permission })
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
          setStep(2);
        } else {
          notify({
            message: 'Step 1 has failed!',
            description: res['message'],
            type: 'error',
          });
        }
        setSaving(false);
      })
      .catch(err => {
        notify({
          message: 'Step 1 has failed!',
          description: err['message'],
          type: 'error',
        });
        setSaving(false);
      });
  };

  const processStep2 = (params: { name: string; symbol: string }) => {
    setSaving(true);
    collectionStep2({ _id: id, ...params })
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
          setStep(3);
        } else {
          notify({
            message: 'Step 2 has failed!',
            description: res['message'],
            type: 'error',
          });
        }
        setSaving(false);
      })
      .catch(err => {
        notify({
          message: 'Step 2 has failed!',
          description: err['message'],
          type: 'error',
        });
        setSaving(false);
      });
  };

  const processStep3 = params => {
    setSaving(true);
    collectionStep3({ _id: id, ...params })
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
          setStep(4);
        } else {
          notify({
            message: 'Step 3 has failed!',
            description: res['message'],
            type: 'error',
          });
        }
        setSaving(false);
      })
      .catch(err => {
        notify({
          message: 'Step 3 has failed!',
          description: err['message'],
          type: 'error',
        });
        setSaving(false);
      });
  };

  const processStep4 = params => {
    setSaving(true);
    collectionStep4({ _id: id, ...params })
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
          setStep(5);
        } else {
          notify({
            message: 'Step 4 has failed!',
            description: res['message'],
            type: 'error',
          });
        }
        setSaving(false);
      })
      .catch(err => {
        notify({
          message: 'Step 4 has failed!',
          description: err['message'],
          type: 'error',
        });
        setSaving(false);
      });
  };

  const processStep5 = extra_info => {
    setSaving(true);
    collectionSubmit({ _id: id, extra_info: extra_info })
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
          notify({
            message: 'Submit has successed!',
            type: 'success',
          });
          history.goBack();
        } else {
          notify({
            message: 'Submit has failed!',
            description: res['message'],
            type: 'error',
          });
        }
        setSaving(false);
      })
      .catch(err => {
        notify({
          message: 'Submit has failed!',
          description: err['message'],
          type: 'error',
        });
        setSaving(false);
      });
  };

  return (
    <div className="listing-page">
      <DashboardHeader />
      {loading ? (
        <div className="load-container">
          <Spin size="large" />
        </div>
      ) : Object.keys(collection).length === 0 ? (
        <EmptyView />
      ) : (
        <div className="listing-container container">
          <Row>
            <Col span={24} md={6} lg={4}>
              <SideMenu step={step} setStep={setStep} collection={collection} />
            </Col>
            <Col span={24} md={18} lg={20}>
              {step === 1 && (
                <IntroStep
                  collection={collection}
                  handleAction={processStep1}
                  saving={saving}
                />
              )}
              {step === 2 && (
                <CollectionStep
                  collection={collection}
                  handleAction={processStep2}
                  saving={saving}
                />
              )}
              {step === 3 && (
                <DetailsStep
                  collection={collection}
                  handleAction={processStep3}
                  saving={saving}
                />
              )}
              {step === 4 && (
                <CandyMachineStep
                  collection={collection}
                  saving={saving}
                  handleAction={processStep4}
                />
              )}
              {step === 5 && (
                <SubmitStep
                  collection={collection}
                  saving={saving}
                  handleAction={processStep5}
                />
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
