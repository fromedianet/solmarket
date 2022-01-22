import { Creator, MetadataKey, WinningConfigType } from '@oyster/common';
import React from 'react';
import { Row, Col, Checkbox, Button, Card, Select, Input } from 'antd';
import { SafetyDepositDraft } from '../../../actions/createAuctionManager';
import { ArtSelector } from '../artSelector';
import { PlusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
export interface TieredAuctionState {
  items: SafetyDepositDraft[];
  tiers: Tier[];
  participationNFT?: SafetyDepositDraft;
}

export interface Tier {
  items: (TierDummyEntry | {})[];
  winningSpots: number[];
}

export interface TierDummyEntry {
  safetyDepositBoxIndex: number;
  amount: number;
  winningConfigType: WinningConfigType;
}

export const TierTableStep = (props: {
  attributes: TieredAuctionState;
  setAttributes: (attr: TieredAuctionState) => void;
  maxWinners: number;
  confirm: () => void;
}) => {
  const newImmutableTiers = (tiers: Tier[]) => {
    return tiers.map(wc => ({
      items: [...wc.items.map(it => ({ ...it }))],
      winningSpots: [...wc.winningSpots],
    }));
  };
  const artistFilter = (i: SafetyDepositDraft) =>
    !(i.metadata.info.data.creators || []).find((c: Creator) => !c.verified);
  const options: { label: string; value: number }[] = [];
  for (let i = 0; i < props.maxWinners; i++) {
    options.push({ label: `Winner ${i + 1}`, value: i });
  }
  return (
    <>
      <Row className="call-to-action">
        <h2>Add Winning Tiers and Their Prizes</h2>
        <p>
          Each row represents a tier. You can choose which winning spots get
          which tiers.
        </p>
      </Row>
      {props.attributes.tiers.map((wcg, configIndex) => (
        <Row className="content-action" key={configIndex}>
          <Col xl={24}>
            <h3>Tier #{configIndex + 1} Basket</h3>
          </Col>

          <Checkbox.Group
            options={options}
            onChange={value => {
              const newTiers = newImmutableTiers(props.attributes.tiers);
              const myNewTier = newTiers[configIndex];
              myNewTier.winningSpots = value.map(i => i.valueOf() as number);

              props.setAttributes({
                ...props.attributes,
                tiers: newTiers,
              });
            }}
          />

          {wcg.items.map((i, itemIndex) => (
            <Col className="section" xl={8} key={itemIndex}>
              <Card>
                <ArtSelector
                  filter={artistFilter}
                  selected={
                    (i as TierDummyEntry).safetyDepositBoxIndex !== undefined
                      ? [
                          props.attributes.items[
                            (i as TierDummyEntry).safetyDepositBoxIndex
                          ],
                        ]
                      : []
                  }
                  setSelected={items => {
                    const newItems = [
                      ...props.attributes.items.map(it => ({ ...it })),
                    ];

                    const newTiers = newImmutableTiers(props.attributes.tiers);
                    if (items[0]) {
                      const existing = props.attributes.items.find(
                        it => it.metadata.pubkey === items[0].metadata.pubkey,
                      );
                      if (!existing) newItems.push(items[0]);
                      const index = newItems.findIndex(
                        it => it.metadata.pubkey === items[0].metadata.pubkey,
                      );

                      const myNewTier = newTiers[configIndex].items[itemIndex];
                      myNewTier.safetyDepositBoxIndex = index;
                      if (
                        items[0].masterEdition &&
                        items[0].masterEdition.info.key ==
                          MetadataKey.MasterEditionV1
                      ) {
                        myNewTier.winningConfigType =
                          WinningConfigType.PrintingV1;
                      } else if (
                        items[0].masterEdition &&
                        items[0].masterEdition.info.key ==
                          MetadataKey.MasterEditionV2
                      ) {
                        myNewTier.winningConfigType =
                          WinningConfigType.PrintingV2;
                      } else {
                        myNewTier.winningConfigType =
                          WinningConfigType.TokenOnlyTransfer;
                      }
                      myNewTier.amount = 1;
                    } else if (
                      (i as TierDummyEntry).safetyDepositBoxIndex !== undefined
                    ) {
                      const myNewTier = newTiers[configIndex];
                      myNewTier.items.splice(itemIndex, 1);
                      if (myNewTier.items.length === 0)
                        newTiers.splice(configIndex, 1);
                      const othersWithSameItem = newTiers.find(c =>
                        c.items.find(
                          it =>
                            it.safetyDepositBoxIndex ===
                            (i as TierDummyEntry).safetyDepositBoxIndex,
                        ),
                      );

                      if (!othersWithSameItem) {
                        for (
                          let j =
                            (i as TierDummyEntry).safetyDepositBoxIndex + 1;
                          j < props.attributes.items.length;
                          j++
                        ) {
                          newTiers.forEach(c =>
                            c.items.forEach(it => {
                              if (it.safetyDepositBoxIndex === j)
                                it.safetyDepositBoxIndex--;
                            }),
                          );
                        }
                        newItems.splice(
                          (i as TierDummyEntry).safetyDepositBoxIndex,
                          1,
                        );
                      }
                    }

                    props.setAttributes({
                      ...props.attributes,
                      items: newItems,
                      tiers: newTiers,
                    });
                  }}
                  allowMultiple={false}
                >
                  Select item
                </ArtSelector>

                {(i as TierDummyEntry).winningConfigType !== undefined && (
                  <>
                    <Select
                      defaultValue={(i as TierDummyEntry).winningConfigType}
                      style={{ width: 120 }}
                      onChange={value => {
                        const newTiers = newImmutableTiers(
                          props.attributes.tiers,
                        );

                        const myNewTier =
                          newTiers[configIndex].items[itemIndex];

                        // Legacy hack...
                        if (
                          value == WinningConfigType.PrintingV2 &&
                          myNewTier.safetyDepositBoxIndex &&
                          props.attributes.items[
                            myNewTier.safetyDepositBoxIndex
                          ].masterEdition?.info.key ==
                            MetadataKey.MasterEditionV1
                        ) {
                          value = WinningConfigType.PrintingV1;
                        }
                        myNewTier.winningConfigType = value;
                        props.setAttributes({
                          ...props.attributes,
                          tiers: newTiers,
                        });
                      }}
                    >
                      <Option value={WinningConfigType.FullRightsTransfer}>
                        Full Rights Transfer
                      </Option>
                      <Option value={WinningConfigType.TokenOnlyTransfer}>
                        Token Only Transfer
                      </Option>
                      <Option value={WinningConfigType.PrintingV2}>
                        Printing V2
                      </Option>

                      <Option value={WinningConfigType.PrintingV1}>
                        Printing V1
                      </Option>
                    </Select>

                    {((i as TierDummyEntry).winningConfigType ===
                      WinningConfigType.PrintingV1 ||
                      (i as TierDummyEntry).winningConfigType ===
                        WinningConfigType.PrintingV2) && (
                      <label className="action-field">
                        <span className="field-title">
                          How many copies do you want to create for each winner?
                          If you put 2, then each winner will get 2 copies.
                        </span>
                        <span className="field-info">
                          Each copy will be given unique edition number e.g. 1
                          of 30
                        </span>
                        <Input
                          autoFocus
                          className="input"
                          placeholder="Enter number of copies sold"
                          allowClear
                          onChange={info => {
                            const newTiers = newImmutableTiers(
                              props.attributes.tiers,
                            );

                            const myNewTier =
                              newTiers[configIndex].items[itemIndex];
                            myNewTier.amount = parseInt(info.target.value);
                            props.setAttributes({
                              ...props.attributes,
                              tiers: newTiers,
                            });
                          }}
                        />
                      </label>
                    )}
                  </>
                )}
              </Card>
            </Col>
          ))}
          <Col xl={4}>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                const newTiers = newImmutableTiers(props.attributes.tiers);
                const myNewTier = newTiers[configIndex];
                myNewTier.items.push({});
                props.setAttributes({
                  ...props.attributes,
                  tiers: newTiers,
                });
              }}
              className="action-btn"
            >
              <PlusCircleOutlined />
            </Button>
          </Col>
        </Row>
      ))}
      <Row>
        <Col xl={24}>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              const newTiers = newImmutableTiers(props.attributes.tiers);
              newTiers.push({ items: [], winningSpots: [] });
              props.setAttributes({
                ...props.attributes,
                tiers: newTiers,
              });
            }}
            className="action-btn"
          >
            <PlusCircleOutlined />
          </Button>
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Continue to Review
        </Button>
      </Row>
    </>
  );
};
