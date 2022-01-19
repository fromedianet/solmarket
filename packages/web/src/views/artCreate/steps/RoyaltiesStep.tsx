import React, { useEffect, useState } from 'react';
import { UserSearch, UserValue } from '../../../components/UserSearch';
import { Button, Row, Col, InputNumber, Slider, Typography } from 'antd';
import {
  Creator,
  IMetadataExtension,
  MetaplexModal,
  shortenAddress,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

const { Text } = Typography;

interface Royalty {
  creatorKey: string;
  amount: number;
}
const RoyaltiesSplitter = (props: {
  creators: Array<UserValue>;
  royalties: Array<Royalty>;
  setRoyalties: Function;
  isShowErrors?: boolean;
}) => {
  return (
    <Col>
      <Row gutter={[0, 24]}>
        {props.creators.map((creator, idx) => {
          const royalty = props.royalties.find(
            royalty => royalty.creatorKey === creator.key,
          );
          if (!royalty) return null;

          const amt = royalty.amount;

          const handleChangeShare = (newAmt: number) => {
            props.setRoyalties(
              props.royalties.map(_royalty => {
                return {
                  ..._royalty,
                  amount:
                    _royalty.creatorKey === royalty.creatorKey
                      ? newAmt
                      : _royalty.amount,
                };
              }),
            );
          };

          return (
            <Col span={24} key={idx}>
              <Row
                align="middle"
                gutter={[0, 16]}
                style={{ margin: '5px auto' }}
              >
                <Col span={8} lg={4} style={{ padding: 10 }}>
                  {creator.label}
                </Col>
                <Col span={8} lg={4}>
                  <InputNumber<number>
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    value={amt}
                    parser={value => parseInt(value?.replace('%', '') ?? '0')}
                    onChange={handleChangeShare}
                    className="royalties-input"
                  />
                </Col>
                <Col span={8} lg={4} style={{ paddingLeft: 12 }}>
                  <Slider value={amt} onChange={handleChangeShare} />
                </Col>
                {props.isShowErrors && amt === 0 && (
                  <Col style={{ paddingLeft: 12 }}>
                    <Text type="danger">
                      The split percentage for this creator cannot be 0%.
                    </Text>
                  </Col>
                )}
              </Row>
            </Col>
          );
        })}
      </Row>
    </Col>
  );
};

export const RoyaltiesStep = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  // const file = props.attributes.image;
  const { publicKey, connected } = useWallet();
  const [creators, setCreators] = useState<Array<UserValue>>([]);
  const [fixedCreators, setFixedCreators] = useState<Array<UserValue>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showCreatorsModal, setShowCreatorsModal] = useState<boolean>(false);
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey) {
      const key = publicKey.toBase58();
      setFixedCreators([
        {
          key,
          label: shortenAddress(key),
          value: key,
        },
      ]);
    }
  }, [connected, setCreators]);

  useEffect(() => {
    setRoyalties(
      [...fixedCreators, ...creators].map(creator => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / [...fixedCreators, ...creators].length),
      })),
    );
  }, [creators, fixedCreators]);

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => {
      return totalShares + royalty.amount;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [royalties]);

  return (
    <>
      <Row className="call-to-action" style={{ marginBottom: 20 }}>
        <h2>Set royalties and creator splits</h2>
        <p>
          Royalties ensure that you continue to get compensated for your work
          after its initial sale.
        </p>
      </Row>
      <Row className="content-action" style={{ marginBottom: 20 }}>
        <label className="action-field">
          <span className="field-title">Royalty Percentage</span>
          <p>
            This is how much of each secondary sale will be paid out to the
            creators.
          </p>
          <InputNumber
            autoFocus
            min={0}
            max={100}
            placeholder="Between 0 and 100"
            onChange={(val: number) => {
              props.setAttributes({
                ...props.attributes,
                seller_fee_basis_points: val * 100,
              });
            }}
            className="royalties-input"
          />
        </label>
      </Row>
      {[...fixedCreators, ...creators].length > 0 && (
        <Row>
          <label className="action-field" style={{ width: '100%' }}>
            <span className="field-title">Creators Split</span>
            <p>
              This is how much of the proceeds from the initial sale and any
              royalties will be split out amongst the creators.
            </p>
            <RoyaltiesSplitter
              creators={[...fixedCreators, ...creators]}
              royalties={royalties}
              setRoyalties={setRoyalties}
              isShowErrors={isShowErrors}
            />
          </label>
        </Row>
      )}
      <Row>
        <span
          onClick={() => setShowCreatorsModal(true)}
          style={{ padding: 10, marginBottom: 10 }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 25,
              padding: '0px 8px 3px 8px',
              background: 'rgb(57, 57, 57)',
              borderRadius: '50%',
              marginRight: 5,
              verticalAlign: 'middle',
            }}
          >
            +
          </span>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              verticalAlign: 'middle',
              lineHeight: 1,
            }}
          >
            Add another creator
          </span>
        </span>
        <MetaplexModal
          visible={showCreatorsModal}
          onCancel={() => setShowCreatorsModal(false)}
        >
          <label
            className="action-field"
            style={{ width: '100%', padding: 24 }}
          >
            <span className="field-title">Creators</span>
            <UserSearch setCreators={setCreators} />
          </label>
        </MetaplexModal>
      </Row>
      {isShowErrors && totalRoyaltyShares !== 100 && (
        <Row>
          <Text type="danger" style={{ paddingBottom: 14 }}>
            The split percentages for each creator must add up to 100%. Current
            total split percentage is {totalRoyaltyShares}%.
          </Text>
        </Row>
      )}
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            // Find all royalties that are invalid (0)
            const zeroedRoyalties = royalties.filter(
              royalty => royalty.amount === 0,
            );

            if (zeroedRoyalties.length !== 0 || totalRoyaltyShares !== 100) {
              // Contains a share that is 0 or total shares does not equal 100, show errors.
              setIsShowErrors(true);
              return;
            }

            const creatorStructs: Creator[] = [
              ...fixedCreators,
              ...creators,
            ].map(
              c =>
                new Creator({
                  address: c.value,
                  verified: c.value === publicKey?.toBase58(),
                  share:
                    royalties.find(r => r.creatorKey === c.value)?.amount ||
                    Math.round(100 / royalties.length),
                }),
            );

            const share = creatorStructs.reduce(
              (acc, el) => (acc += el.share),
              0,
            );
            if (share > 100 && creatorStructs.length) {
              creatorStructs[0].share -= share - 100;
            }
            props.setAttributes({
              ...props.attributes,
              creators: creatorStructs,
            });
            props.confirm();
          }}
          className="action-btn"
          style={{ marginTop: 24 }}
        >
          Continue to review
        </Button>
      </Row>
    </>
  );
};
