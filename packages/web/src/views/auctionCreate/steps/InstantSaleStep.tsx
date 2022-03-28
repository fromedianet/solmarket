import React, { useCallback, useMemo } from 'react';
import { Row, Col, Input, Select, Button } from 'antd';
import { AuctionState, InstantSaleType } from '../index';
import { Creator } from '@oyster/common';
import { SafetyDepositDraft } from '../../../actions/createAuctionManager';
import { ArtSelector } from '../artSelector';

const { Option } = Select;
export const InstantSaleStep = ({
  attributes,
  setAttributes,
  confirm,
}: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  //console.log("OBJ MINT", mint.toBase58())
  const isMasterEdition = !!attributes?.items?.[0]?.masterEdition;

  const copiesEnabled = useMemo(() => {
    const maxSupply = attributes?.items?.[0]?.masterEdition?.info?.maxSupply;
    return !!maxSupply && maxSupply.toNumber() > 0;
  }, [attributes?.items?.[0]]);
  const artistFilter = useCallback(
    (i: SafetyDepositDraft) =>
      !(i.metadata.info.data.creators || []).some((c: Creator) => !c.verified),
    [],
  );

  const isLimitedEdition =
    attributes.instantSaleType === InstantSaleType.Limited;
  const shouldRenderSelect = attributes.items.length > 0;

  return (
    <>
      <Row className="call-to-action" style={{ marginBottom: 0 }}>
        <h2>Select which item to sell:</h2>
      </Row>

      <Row className="content-action" gutter={16}>
        <Col span={24} lg={12}>
          <ArtSelector
            filter={artistFilter}
            selected={attributes.items}
            setSelected={items => {
              setAttributes({ ...attributes, items });
            }}
            allowMultiple={false}
          >
            Select NFT
          </ArtSelector>
        </Col>
        <Col span={24} lg={12}>
          {shouldRenderSelect && (
            <label className="action-field">
              <Select
                defaultValue={
                  attributes.instantSaleType || InstantSaleType.Single
                }
                onChange={value =>
                  setAttributes({
                    ...attributes,
                    instantSaleType: value,
                  })
                }
                bordered={false}
              >
                <Option value={InstantSaleType.Single}>
                  Sell unique token
                </Option>
                {copiesEnabled && (
                  <Option value={InstantSaleType.Limited}>
                    Sell limited number of copies
                  </Option>
                )}
                {!copiesEnabled && isMasterEdition && (
                  <Option value={InstantSaleType.Open}>
                    Sell unlimited number of copies
                  </Option>
                )}
              </Select>
              {isLimitedEdition && (
                <>
                  <span className="field-info">
                    Each copy will be given unique edition number e.g. 1 of 30
                  </span>
                  <Input
                    autoFocus
                    className="input"
                    placeholder="Enter number of copies sold"
                    allowClear
                    onChange={info =>
                      setAttributes({
                        ...attributes,
                        editions: parseInt(info.target.value),
                      })
                    }
                  />
                </>
              )}
            </label>
          )}
          <label className="action-field">
            <span className="field-title">Price</span>
            <span className="field-info">
              This is the instant sale price for your item.
            </span>
            <Input
              type="number"
              min={0}
              autoFocus
              className="input"
              placeholder="Price"
              prefix="◎"
              onChange={info =>
                setAttributes({
                  ...attributes,
                  priceFloor: parseFloat(info.target.value),
                  instantSalePrice: parseFloat(info.target.value),
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
          onClick={() => {
            confirm();
          }}
          className="action-btn"
        >
          Continue
        </Button>
      </Row>
    </>
  );
};
