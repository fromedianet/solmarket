import React, { useState } from "react";
import { Button, Row, Col, Form, Spin, Divider } from "antd";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PriceInput } from "../../components/PriceInput";
import { Offer } from "../../models/offer";
import { MarketType } from "../../constants";
import { useNativeAccount } from "../../contexts";
import { ConnectButton } from "../../components/ConnectButton";
import { MetaplexModal } from "../../components/MetaplexModal";
import { formatAmount } from "../../utils/utils";

export const ItemAction = (props: {
  nft: any;
  loading: boolean;
  myOffer: Offer | undefined;
  biddingBalance: number;
  onListNow: (a) => void;
  onCancelList: () => void;
  onBuyNow: () => void;
  onPlaceBid: (a) => void;
  onCancelVisible: () => void;
  onOpenMarketplace: () => void;
}) => {
  const [form] = Form.useForm();
  const wallet = useWallet();
  const { account } = useNativeAccount();
  const mainBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(0);
  const isOwner = props.nft.owner === wallet.publicKey?.toBase58();
  const alreadyListed = props.nft.price || 0 > 0;
  const checkPrice = (_: any, value: { number: number }) => {
    if (value && value.number > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Price must be greater than zero!"));
  };
  const [error, setError] = useState("");
  const [balanceError, setBalanceError] = useState("");

  const onChangeOffer = (value: number) => {
    let err = "";
    if (value < props.nft.price / 2) {
      err = "Price must be higher than 50% of the listing price";
    } else if (value >= props.nft.price) {
      err = "Price must be lower than listing price";
    }

    if (value > mainBalance) {
      setBalanceError("Not enough balance in the wallet");
    } else {
      setBalanceError("");
    }
    setError(err);
    setOfferPrice(value);
  };

  return (
    <div className="action-view">
      {alreadyListed && <span className="label">Current Price</span>}
      <div className="price-container">
        <img
          src="/icons/price.svg"
          width={24}
          alt="price"
          style={{ marginRight: "8px" }}
        />
        {alreadyListed && <span className="value">{props.nft.price} SOL</span>}
      </div>
      {!alreadyListed && <span className="value">Not listed</span>}
      {props.nft.symbol && (
        <div className="btn-container">
          {!wallet.connected ? (
            <ConnectButton className="button" />
          ) : props.nft.market !== MarketType.PaperCity ? (
            !isOwner && alreadyListed ? (
              <Button
                className="button"
                onClick={props.onBuyNow}
                disabled={props.loading}
              >
                Buy Now
              </Button>
            ) : (
              <Button
                className="button"
                onClick={props.onOpenMarketplace}
                disabled={props.loading}
              >
                {`Go to ${props.nft.market}`}
              </Button>
            )
          ) : isOwner ? (
            alreadyListed ? (
              <Button
                className="button"
                onClick={props.onCancelList}
                disabled={props.loading}
              >
                {props.loading ? <Spin /> : "Cancel Listing"}
              </Button>
            ) : (
              <Form
                form={form}
                name="price-control"
                layout="inline"
                onFinish={(val) => props.onListNow(val.price.number)}
              >
                <Row style={{ width: "100%" }}>
                  <Col span={12}>
                    <Form.Item name="price" rules={[{ validator: checkPrice }]}>
                      <PriceInput
                        value={{ number: props.nft.price }}
                        placeholder="Price"
                        addonAfter="SOL"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item>
                      <Button
                        className="button"
                        htmlType="submit"
                        disabled={props.loading}
                      >
                        {props.loading ? <Spin /> : "List Now"}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )
          ) : (
            alreadyListed && (
              <Row gutter={16}>
                <Col span={10}>
                  <Button
                    className="button"
                    onClick={props.onBuyNow}
                    disabled={props.loading}
                  >
                    Buy Now
                  </Button>
                </Col>
                <Col span={14}>
                  {props.myOffer ? (
                    <Button
                      className="button"
                      onClick={() => {
                        props.onCancelVisible();
                      }}
                      disabled={props.loading}
                    >
                      Cancel offer
                    </Button>
                  ) : (
                    <Button
                      className="button"
                      onClick={() => {
                        setShowOfferModal(true);
                        onChangeOffer(offerPrice);
                      }}
                      disabled={props.loading}
                    >
                      Make an offer
                    </Button>
                  )}
                </Col>
              </Row>
            )
          )}
        </div>
      )}
      <MetaplexModal
        className="make-offer-modal"
        visible={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
      >
        <div>
          <span className="header-text">Make an offer</span>
          <div className="body-container">
            <p className="description">
              When you make an offer, the funds are kept in your bidding wallet
              to allow you to make multiple offers using the same funds. To
              view, deposit, or withdraw from your bidding wallet, please visit
              the &apos;Offers Made&apos; page of your profile.
            </p>
            <button className="option-button">
              <span>Fund the offer</span>
              <span className="sub-title">
                Transfer money from your main wallet to the bidding wallet
                account.
              </span>
            </button>
            <Row style={{ width: "100%", marginTop: 24, marginBottom: 24 }}>
              <Col span={16}>
                <PriceInput
                  value={{ number: offerPrice }}
                  placeholder="Price"
                  addonAfter="SOL"
                  onChange={(value) => onChangeOffer(value.number!)}
                />
                {error && <span className="warning">{error}</span>}
                {balanceError && (
                  <span className="warning">{balanceError}</span>
                )}
              </Col>
              <Col span={7} style={{ marginLeft: 16 }}>
                <Button
                  className="button"
                  onClick={() => {
                    setShowOfferModal(false);
                    props.onPlaceBid(offerPrice);
                  }}
                  disabled={error !== "" || balanceError !== ""}
                >
                  Make offer
                </Button>
              </Col>
            </Row>
            <span className="nft-name">{props.nft.name}</span>
            <span className="nft-symbol">
              {props.nft.symbol}
              <img
                src="/icons/check.svg"
                style={{ width: 14, height: 14, marginLeft: 8 }}
                alt="check"
              />
            </span>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label text-gray">Buy now price</span>
              <span className="wallet-label text-gray">{`${parseFloat(
                props.nft.price.toFixed(5)
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Minimum offer (50%)</span>
              <span className="wallet-label">{`${parseFloat(
                (props.nft.price * 0.5).toFixed(5)
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Main wallet balance</span>
              <span className="wallet-label">{`${parseFloat(
                mainBalance.toFixed(5)
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Bidding wallet balance</span>
              <span className="wallet-label">{`${parseFloat(
                props.biddingBalance.toFixed(5)
              )} SOL`}</span>
            </div>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label">
                New main wallet balance{" "}
                {offerPrice > 0 ? (
                  <span style={{ color: "#ffaa00" }}>{` -${formatAmount(
                    offerPrice
                  )} SOL`}</span>
                ) : (
                  ""
                )}
              </span>
              <span className="wallet-label">{`${parseFloat(
                (mainBalance - offerPrice).toFixed(5)
              )} SOL`}</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">
                New bidding wallet balance{" "}
                {offerPrice > 0 ? (
                  <span style={{ color: "#00db80" }}>{` +${formatAmount(
                    offerPrice
                  )} SOL`}</span>
                ) : (
                  ""
                )}
              </span>
              <span className="wallet-label">{`${parseFloat(
                (props.biddingBalance + offerPrice).toFixed(5)
              )} SOL`}</span>
            </div>
            <span className="bottom-label">
              By selecting &quot;Make offer&quot;, you agree to{" "}
              <a href="">
                <a style={{ fontWeight: 600 }}>Terms of Service</a>
              </a>
            </span>
          </div>
        </div>
      </MetaplexModal>
    </div>
  );
};
