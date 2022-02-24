import {
  getAssetCostToStore,
  IMetadataExtension,
  LAMPORT_MULTIPLIER,
  MAX_METADATA_LEN,
} from '@oyster/common';
import { MintLayout } from '@solana/spl-token';
import { Connection } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import { useArtworkFiles } from '../../../hooks/useArtworkFiles';
import { Row, Col, Statistic, Spin, Button } from 'antd';
import { CollectionCard } from '../../../components/CollectionCard';

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
            <CollectionCard
              image={image}
              animationURL={props.attributes.animation_url}
              category={props.attributes.properties?.category}
              preview={true}
              noEvent={true}
              name={props.attributes.name}
              symbol={props.attributes.symbol}
              description={props.attributes.description}
            />
          )}
        </Col>
        <Col span={24} md={12}>
          {cost ? (
            <Statistic
              className="create-statistic"
              title="Cost to Create"
              value={cost.toFixed(5)}
              suffix="◎"
            />
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
