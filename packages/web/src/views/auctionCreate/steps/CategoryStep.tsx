import React from 'react';
import useWindowDimensions from '../../../utils/layout';
import {Row, Col, Button} from 'antd';
import { AuctionCategory } from '../index';

export const CategoryStep = (props: {
  confirm: (category: AuctionCategory) => void;
}) => {
  const { width } = useWindowDimensions();
  return (
    <>
      <Row className="call-to-action">
        <h2>List an item</h2>
        <p>
          First time listing on Metaplex? <a>Read our sellers&apos; guide.</a>
        </p>
      </Row>
      <Row justify={width < 768 ? 'center' : 'start'}>
        <Col>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(AuctionCategory.InstantSale)}
            >
              <div>
                <div>Instant Sale</div>
                <div className="type-btn-description">
                  At a fixed price, sell a single Master NFT or copies of it
                </div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(AuctionCategory.Limited)}
            >
              <div>
                <div>Limited Edition</div>
                <div className="type-btn-description">
                  Sell a limited copy or copies of a single Master NFT
                </div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(AuctionCategory.Open)}
            >
              <div>
                <div>Open Edition</div>
                <div className="type-btn-description">
                  Sell unlimited copies of a single Master NFT
                </div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(AuctionCategory.Tiered)}
            >
              <div>
                <div>Tiered Auction</div>
                <div className="type-btn-description">
                  Participants get unique rewards based on their leaderboard
                  rank
                </div>
              </div>
            </Button>
          </Row>
          <Row>
            <Button
              className="type-btn"
              size="large"
              onClick={() => props.confirm(AuctionCategory.Single)}
            >
              <div>
                <div>Sell an Existing Item</div>
                <div className="type-btn-description">
                  Sell an existing item in your NFT collection, including Master
                  NFTs
                </div>
              </div>
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};