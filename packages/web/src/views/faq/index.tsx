import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

export const FAQView = () => {
  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container faq-page">
          <h1>FAQ</h1>
          <Collapse className="collapse-container" expandIconPosition="right">
            <Panel header="What is this?" key="1">
              <span>
                PaperCity is a marketplace aggregator for NFTs on the Solana
                platform, incorporating listings from all the most popular
                marketplaces as well as our own inventory
              </span>
            </Panel>
            <Panel header="How do I sell a Solana NFT?" key="2">
              <span>
                Connect your wallet to PaperCity then visit{' '}
                <a href="https://papercity.io/profile">
                  https://papercity.io/profile
                </a>
                , find the NFT you want to sell, click on it to set the price,
                click “List Now” and confirm in your wallet dialog
              </span>
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};
