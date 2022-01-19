import { StringPublicKey } from '@oyster/common';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { Confetti } from '../../../components/Confetti';

export const Congrats = (props: {
  nft?: {
    metadataAccount: StringPublicKey;
  };
  alert?: string;
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I've created a new NFT artwork on Metaplex, check it out!",
      url: `${
        window.location.origin
      }/#/art/${props.nft?.metadataAccount.toString()}`,
      hashtags: 'NFT,Crypto,Metaplex',
      // via: "Metaplex",
      related: 'Metaplex,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  if (props.alert) {
    // TODO  - properly reset this components state on error
    return (
      <>
        <div className="waiting-title">Sorry, there was an error!</div>
        <p>{props.alert}</p>
        <Button onClick={() => history.push('/art/create')}>
          Back to Create NFT
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="waiting-title">Congratulations, you created an NFT!</div>
      <div className="congrats-button-container">
        <Button
          style={{ marginBottom: 16 }}
          onClick={() => window.open(newTweetURL(), '_blank')}
        >
          <span>Share it on Twitter &gt;</span>
        </Button>
        <Button
          style={{ marginBottom: 16 }}
          onClick={() =>
            history.push(`/art/${props.nft?.metadataAccount.toString()}`)
          }
        >
          <span>See it in your collection &gt;</span>
        </Button>
        <Button
          style={{ marginBottom: 16 }}
          onClick={() => history.push('/auction/create')}
        >
          <span>Sell it via auction &gt;</span>
        </Button>
      </div>
      <Confetti />
    </>
  );
};
