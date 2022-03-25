import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Spin } from 'antd';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
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
    processStep1,
    processStep2,
    processStep3,
    processStep4,
    processStep5,
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

  const cProcessStep1 = async (permission) => {
    setSaving(true);
    const result = await processStep1({ _id: id, permission: permission });
    // @ts-ignore
    if (result && result['data']) {
      // @ts-ignore
      setCollection(result['data']);
      setStep(2);
    }
    setSaving(false);
  };

  const cProcessStep2 = async (params: { name: string; symbol: string, email: string }) => {
    setSaving(true);
    const result = await processStep2({ _id: id, ...params });
    // @ts-ignore
    if (result && result['data']) {
      // @ts-ignore
      setCollection(result['data']);
      setStep(3);
    }
    setSaving(false);
  };

  const cProcessStep3 = async (params) => {
    setSaving(true);
    const result = await processStep3({ _id: id, ...params });
    // @ts-ignore
    if (result && result['data']) {
      // @ts-ignore
      setCollection(result['data']);
      setStep(4);
    }
    setSaving(false);
  };

  const cProcessStep4 = async (params) => {
    setSaving(true);
    const result = await processStep4({ _id: id, ...params });
    // @ts-ignore
    if (result && result['data']) {
      // @ts-ignore
      setCollection(result['data']);
        setStep(5);
    }
    setSaving(false);
  };

  const cProcessStep5 = async (params) => {
    setSaving(true);
    const result = await processStep5({
      _id: id,
      status: 'submitted',
      ...params,
    });
    // @ts-ignore
    if (result && result['data']) {
      // @ts-ignore
      setCollection(result['data']);
      notify({
        message: 'Submit has successed!',
        type: 'success',
      });
      history.goBack();
    }
    setSaving(false);
  };

  return (
    <div className="listing-page">
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
                  handleAction={cProcessStep1}
                  saving={saving}
                />
              )}
              {step === 2 && (
                <CollectionStep
                  collection={collection}
                  handleAction={cProcessStep2}
                  saving={saving}
                />
              )}
              {step === 3 && (
                <DetailsStep
                  collection={collection}
                  handleAction={cProcessStep3}
                  saving={saving}
                />
              )}
              {step === 4 && (
                <CandyMachineStep
                  collection={collection}
                  saving={saving}
                  handleAction={cProcessStep4}
                />
              )}
              {step === 5 && (
                <SubmitStep
                  collection={collection}
                  saving={saving}
                  handleAction={cProcessStep5}
                />
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
