import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { CardLoader } from '../../components/MyLoader';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { LaunchpadCard } from '../../components/LaunchpadCard';

export const LaunchPadView = () => {
  const [loading, setLoading] = useState(false);
  const { getLaunchpadCollections } = useCollectionsAPI();
  const [collections, setCollections] = useState({
    live: [],
    upcoming: [],
    end: [],
  });

  useEffect(() => {
    setLoading(true);
    getLaunchpadCollections()
      // @ts-ignore
      .then((res: []) => {
        if (res.length > 0) {
          parseData(res);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function parseData(data: []) {
    const lives = [];
    const upcomings = [];
    const ends = [];

    const now = moment().unix();
    data.forEach(item => {
      if (item['mint_ended']) {
        ends.push(item);
      } else {
        const launchTime = moment.utc(item['launch_time']).unix();
        if (launchTime < now) {
          lives.push(item);
        } else {
          upcomings.push(item);
        }
      }
    });

    setCollections({
      live: lives,
      upcoming: upcomings,
      end: ends,
    });
  }

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container">
          {loading ? (
            [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
          ) : (
            <div>
              {collections.live.length > 0 && (
                <div className="home-section">
                  <div className="section-header">
                    <span className="section-title">Live</span>
                  </div>
                  <Row gutter={[16, 16]}>
                    {collections.live.map((item, index) => (
                      <Col key={index} span={24} md={12} lg={6}>
                        <LaunchpadCard item={item} showCountdown={true} />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              {collections.upcoming.length > 0 && (
                <div className="home-section">
                  <div className="section-header">
                    <span className="section-title">Upcoming</span>
                  </div>
                  <Row gutter={[16, 16]}>
                    {collections.upcoming.map((item, index) => (
                      <Col key={index} span={24} md={12} lg={6}>
                        <LaunchpadCard item={item} showCountdown={true} />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              {collections.end.length > 0 && (
                <div className="home-section">
                  <div className="section-header">
                    <span className="section-title">Ended</span>
                  </div>
                  <Row gutter={[16, 16]}>
                    {collections.end.map((item, index) => (
                      <Col key={index} span={24} md={12} lg={6}>
                        <LaunchpadCard item={item} />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
