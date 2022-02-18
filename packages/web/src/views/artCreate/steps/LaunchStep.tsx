import {
  getAssetCostToStore,
  IMetadataExtension,
  LAMPORT_MULTIPLIER,
  MAX_METADATA_LEN,
} from '@oyster/common';
import { MintLayout } from '@solana/spl-token';
import { Connection } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import { ArtCard } from '../../../components/ArtCard';
import { useArtworkFiles } from '../useArtworkFiles';
import { Row, Col, Statistic, Spin, Button } from 'antd';

export const LaunchStep = (props: {
  confirm: () => void;
  attributes: IMetadataExtension;
  files: File[];
  connection: Connection;
}) => {
  const [cost, setCost] = useState(0);
  const { image } = useArtworkFiles(props.files, props.attributes);
  const files = props.files;
  const metadata = props.attributes;
  useEffect(() => {
    const rentCall = Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    if (files.length)
      getAssetCostToStore([
        ...files,
        new File([JSON.stringify(metadata)], 'metadata.json'),
      ]).then(async lamports => {
        const sol = lamports / LAMPORT_MULTIPLIER;

        // TODO: cache this and batch in one call
        const [mintRent, metadataRent] = await rentCall;

        // const uriStr = 'x';
        // let uriBuilder = '';
        // for (let i = 0; i < MAX_URI_LENGTH; i++) {
        //   uriBuilder += uriStr;
        // }

        const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

        // TODO: add fees based on number of transactions and signers
        setCost(sol + additionalSol);
      });
  }, [files, metadata, setCost]);

  return (
    <>
      <Row className="call-to-action">
        <h2>Launch your creation</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          {props.attributes.image && (
            <ArtCard
              image={image}
              animationURL={props.attributes.animation_url}
              category={props.attributes.properties?.category}
              name={props.attributes.name}
              symbol={props.attributes.symbol}
              noEvent={true}
              preview={true}
              artview={props.files[1]?.type === 'unknown'}
              className="art-create-card"
            />
          )}
        </Col>
        <Col span={24} md={12}>
          <Statistic
            className="create-statistic"
            title="Royalty Percentage"
            value={props.attributes.seller_fee_basis_points / 100}
            precision={2}
            suffix="%"
          />
          {cost ? (
            <Statistic
              className="create-statistic"
              title="Royalty Percentage"
              value={cost.toFixed(5)}
              suffix="◎"
            />
            // <AmountLabel
            //   title="Cost to Create"
            //   amount={cost.toFixed(5)}
            //   tokenInfo={useTokenList().tokenMap.get(
            //     WRAPPED_SOL_MINT.toString(),
            //   )}
            // />
          ) : (
            <Spin />
          )}
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Pay with SOL
        </Button>
      </Row>
    </>
  );
};
