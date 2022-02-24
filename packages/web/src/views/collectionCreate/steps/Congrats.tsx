import { StringPublicKey } from '@oyster/common';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { Confetti } from '../../../components/Confetti';

export const Congrats = (props: {
  collection?: {
    metadataAccount: StringPublicKey;
  };
  alert?: string;
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I've created a new collection on PaperCity, check it out!",
      url: `${
        window.location.origin
      }/art/${props.collection?.metadataAccount.toString()}`,
      hashtags: 'NFT,Crypto,PaperCity',
      related: 'PaperCity,Solana',
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
        <Button onClick={() => history.push('/collection/create')}>
          Back to Create Collection
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="waiting-title">
        Congratulations, you created a collection!
      </div>
      <div className="congrats-button-container">
        <Button
          style={{ marginBottom: 16, height: 40 }}
          onClick={() => window.open(newTweetURL(), '_blank')}
        >
          <span>Share it on Twitter &gt;</span>
        </Button>
        <Button
          style={{ marginBottom: 16, height: 40 }}
          onClick={() => (window.location.href = '/art/create')}
        >
          <span>Create NFT</span>
        </Button>
      </div>
      <Confetti />
    </>
  );
};
