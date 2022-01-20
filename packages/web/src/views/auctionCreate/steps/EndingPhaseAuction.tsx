import React from 'react';
import { AuctionState } from '../index';
import { Row, Col, Input, Select, Button } from 'antd';

const { Option } = Select;
export const EndingPhaseAuction = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row className="call-to-action">
        <h2>Ending Phase</h2>
        <p>Set the terms for your auction.</p>
      </Row>
      <Row className="content-action">
        <Col className="section" xl={24}>
          <div className="action-field">
            <span className="field-title">Auction Duration</span>
            <span className="field-info">
              This is how long the auction will last for.
            </span>
            <Input
              addonAfter={
                <Select
                  defaultValue={props.attributes.auctionDurationType}
                  onChange={value =>
                    props.setAttributes({
                      ...props.attributes,
                      auctionDurationType: value,
                    })
                  }
                >
                  <Option value="minutes">Minutes</Option>
                  <Option value="hours">Hours</Option>
                  <Option value="days">Days</Option>
                </Select>
              }
              autoFocus
              type="number"
              className="input"
              placeholder="Set the auction duration"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  auctionDuration: parseInt(info.target.value),
                })
              }
            />
          </div>

          <div className="action-field">
            <span className="field-title">Gap Time</span>
            <span className="field-info">
              The final phase of the auction will begin when there is this much
              time left on the countdown. Any bids placed during the final phase
              will extend the end time by this same duration.
            </span>
            <Input
              addonAfter={
                <Select
                  defaultValue={props.attributes.gapTimeType}
                  onChange={value =>
                    props.setAttributes({
                      ...props.attributes,
                      gapTimeType: value,
                    })
                  }
                >
                  <Option value="minutes">Minutes</Option>
                  <Option value="hours">Hours</Option>
                  <Option value="days">Days</Option>
                </Select>
              }
              type="number"
              className="input"
              placeholder="Set the gap time"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  gapTime: parseInt(info.target.value),
                })
              }
            />
          </div>

          <label className="action-field">
            <span className="field-title">Tick Size for Ending Phase</span>
            <span className="field-info">
              In order for winners to move up in the auction, they must place a
              bid that’s at least this percentage higher than the next highest
              bid.
            </span>
            <Input
              type="number"
              className="input"
              placeholder="Percentage"
              suffix="%"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  tickSizeEndingPhase: parseInt(info.target.value),
                })
              }
            />
          </label>
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Continue
        </Button>
      </Row>
    </>
  );
};
