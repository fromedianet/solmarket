import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col, Spin } from 'antd';
import { useCollectionsAPI } from '../../../hooks/useCollectionsAPI';
import { DashboardHeader } from '../header';
import { EmptyView } from '../../../components/EmptyView';
import { SideMenu } from './SideMenu';
import { IntroStep } from './steps/IntroStep';

export const DashboardListingView = () => {
  const history = useHistory();
  const { id, step_param }: { id: string; step_param: string } = useParams();
  const [step, setStep] = useState<number>(0);
  const { getCollectionById } = useCollectionsAPI();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState({});

  useEffect(() => {
    setLoading(true);
    getCollectionById(id).then(res => {
      console.log('getCollectionById', res);
      if (res.data) {
        setCollection(res.data);
      }
      setLoading(false);
    });
  }, [id]);

  const gotoStep = useCallback(
    (_step: number) => {
      history.push(`/dashboard/listing/${id}/${_step.toString()}`);
    },
    [history],
  );

  useEffect(() => {
    if (step_param) setStep(parseInt(step_param));
    else gotoStep(0);
  }, [step_param, gotoStep]);

  const processStep1 = permission => {
    console.log('processStep1', permission);
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
        <div className="listing-container">
          <Row>
            <Col span={24} md={6} lg={4}>
              <SideMenu step={step} collection={collection} />
            </Col>
            <Col span={24} md={18} lg={20}>
              {step === 0 && (
                <IntroStep
                  collection={collection}
                  handleAction={processStep1}
                />
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
