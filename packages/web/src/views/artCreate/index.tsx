import React, { useEffect, useState, useCallback } from 'react';
import { Steps, Row, Button, Col } from 'antd';
import { mintNFT } from '../../actions';
import {
  useConnection,
  IMetadataExtension,
  MetadataCategory,
  useConnectionConfig,
  MetaplexOverlay,
  StringPublicKey,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
import useWindowDimensions from '../../utils/layout';
import { InfoStep } from './steps/InfoStep';
import { CategoryStep } from './steps/CategoryStep';
import { UploadStep } from './steps/UploadStep';
import { RoyaltiesStep } from './steps/RoyaltiesStep';
import { LaunchStep } from './steps/LaunchStep';
import { WaitingStep } from './steps/WaitingStep';
import { Congrats } from './steps/Congrats';

const { Step } = Steps;

export const ArtCreateView = () => {
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const wallet = useWallet();
  const [alertMessage, setAlertMessage] = useState<string>();
  const { step_param }: { step_param: string } = useParams();
  const history = useHistory();
  const { width } = useWindowDimensions();
  const [nftCreateProgress, setNFTcreateProgress] = useState<number>(0);

  const [step, setStep] = useState<number>(0);
  const [stepsVisible, setStepsVisible] = useState<boolean>(true);
  const [isMinting, setMinting] = useState<boolean>(false);
  const [nft, setNft] = useState<
    { metadataAccount: StringPublicKey } | undefined
  >(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<IMetadataExtension>({
    name: '',
    symbol: '',
    collection: '',
    description: '',
    external_url: '',
    image: '',
    animation_url: undefined,
    attributes: undefined,
    seller_fee_basis_points: 0,
    creators: [],
    properties: {
      files: [],
      category: MetadataCategory.Image,
    },
  });

  const gotoStep = useCallback(
    (_step: number) => {
      history.push(`/art/create/${_step.toString()}`);
      if (_step === 0) setStepsVisible(true);
    },
    [history],
  );

  useEffect(() => {
    if (step_param) setStep(parseInt(step_param));
    else gotoStep(0);
  }, [step_param, gotoStep]);

  // store files
  const mint = async () => {
    const metadata = {
      name: attributes.name,
      symbol: attributes.symbol,
      collection: attributes.collection,
      creators: attributes.creators,
      description: attributes.description,
      sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      image: attributes.image,
      animation_url: attributes.animation_url,
      attributes: attributes.attributes,
      external_url: attributes.external_url,
      properties: {
        files: attributes.properties.files,
        category: attributes.properties?.category,
      },
    };
    setStepsVisible(false);
    setMinting(true);

    try {
      const _nft = await mintNFT(
        connection,
        wallet,
        endpoint.name,
        files,
        metadata,
        setNFTcreateProgress,
        attributes.properties?.maxSupply,
      );

      if (_nft) setNft(_nft);
      setAlertMessage('');
    } catch (e: any) {
      setAlertMessage(e.message);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="main-area">
      <div className="main-page">
        <Row className="container">
          {stepsVisible && (
            <Col span={24} md={4}>
              <Steps
                progressDot
                direction={width < 768 ? 'horizontal' : 'vertical'}
                current={step}
                responsive={false}
                style={{
                  width: 'fit-content',
                  margin: '0 auto 20px auto',
                  overflowX: 'auto',
                  maxWidth: '100%',
                }}
              >
                <Step title="Category" />
                <Step title="Upload" />
                <Step title="Info" />
                <Step title="Royalties" />
                <Step title="Launch" />
              </Steps>
            </Col>
          )}
          <Col
            span={24}
            {...(stepsVisible ? { md: 20 } : { md: 24 })}
            className="content"
          >
            {step === 0 && (
              <CategoryStep
                confirm={(category: MetadataCategory) => {
                  setAttributes({
                    ...attributes,
                    properties: {
                      ...attributes.properties,
                      category,
                    },
                  });
                  gotoStep(1);
                }}
              />
            )}
            {step === 1 && (
              <UploadStep
                attributes={attributes}
                setAttributes={setAttributes}
                files={files}
                setFiles={setFiles}
                confirm={() => gotoStep(2)}
              />
            )}

            {step === 2 && (
              <InfoStep
                attributes={attributes}
                files={files}
                setAttributes={setAttributes}
                confirm={() => gotoStep(3)}
              />
            )}
            {step === 3 && (
              <RoyaltiesStep
                attributes={attributes}
                confirm={() => gotoStep(4)}
                setAttributes={setAttributes}
              />
            )}
            {step === 4 && (
              <LaunchStep
                attributes={attributes}
                files={files}
                confirm={() => gotoStep(5)}
                connection={connection}
              />
            )}
            {step === 5 && (
              <WaitingStep
                mint={mint}
                minting={isMinting}
                step={nftCreateProgress}
                confirm={() => gotoStep(6)}
              />
            )}
            {0 < step && step < 5 && (
              <div style={{ margin: 'auto', width: 'fit-content' }}>
                <Button onClick={() => gotoStep(step - 1)}>Back</Button>
              </div>
            )}
          </Col>
        </Row>
      </div>
      <MetaplexOverlay visible={step === 6}>
        <Congrats nft={nft} alert={alertMessage} />
      </MetaplexOverlay>
    </div>
  );
};
