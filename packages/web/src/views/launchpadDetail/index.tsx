import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useParams } from 'react-router-dom';
import { Row, Col, Spin, Button, Progress } from 'antd';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import { ConnectButton, notify, useConnection } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';
import { formatNumber, getAtaForMint, toDate } from './utils';
import { Transaction } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { MintCountdown } from './MintCountdown';

export const LaunchpadDetailView = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { launchpadCollectionBySymbol } = useCollectionsAPI();
  const wallet = useWallet();
  const connection = useConnection();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState();
  const [candyMachineId, setCandyMachineId] = useState(null);
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [isActive, setIsActive] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [itemsRedeemed, setItemsRedeemed] = useState<number>(0);
  const [itemsLimit, setItemsLimit] = useState<number>(1);
  const [isWhitelistUser, setIsWhitelistUser] = useState(false);
  const [isPresale, setIsPresale] = useState(false);
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>();
  const [showMintInfo, setShowMintInfo] = useState(false);
  const txTimeoutInMilliseconds = 30000;
  const one_day = (24 * 60) & 60;

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  useEffect(() => {
    setLoading(true);
    launchpadCollectionBySymbol(symbol)
      // @ts-ignore
      .then((res: {}) => {
        if (res['data']) {
          setCollection(res['data']);
          const candyMachineIds = res['data']['candymachine_ids'];
          if (candyMachineIds.length > 0) {
            setCandyMachineId(candyMachineIds[0]);
          }
        } else {
          notify({
            message: res['message'],
            type: 'error',
          });
        }
      })
      .catch(err => {
        notify({
          message: err.message,
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [symbol]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          candyMachineId,
          connection,
        );
        let active =
          cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000;

        if (
          new Date().getTime() / 1000 - cndy.state.goLiveDate.toNumber() >
          one_day
        ) {
          setShowMintInfo(true);
        } else {
          setShowMintInfo(false);
        }

        let presale = false;
        // whitelist mint?
        if (cndy?.state.whitelistMintSettings) {
          // is it a presale mint?
          if (
            cndy.state.whitelistMintSettings.presale &&
            (!cndy.state.goLiveDate ||
              cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
          ) {
            presale = true;
          }
          // is there a discount?
          if (cndy.state.whitelistMintSettings.discountPrice) {
            setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice);
          } else {
            setDiscountPrice(undefined);
            // when presale=false and discountPrice=null, mint is restricted
            // to whitelist users only
            if (!cndy.state.whitelistMintSettings.presale) {
              cndy.state.isWhitelistOnly = true;
            }
          }
          // retrieves the whitelist token
          const mint = new anchor.web3.PublicKey(
            cndy.state.whitelistMintSettings.mint,
          );
          const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0];

          try {
            const balance = await connection.getTokenAccountBalance(token);
            const valid = parseInt(balance.value.amount) > 0;
            // only whitelist the user if the balance > 0
            setIsWhitelistUser(valid);
            active = (presale && valid) || active;
          } catch (e) {
            setIsWhitelistUser(false);
            // no whitelist user, no mint
            if (cndy.state.isWhitelistOnly) {
              active = false;
            }
            console.log('There was a problem fetching whitelist token balance');
            console.log(e);
          }
        }
        // datetime to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.date) {
          setEndDate(toDate(cndy.state.endSettings.number));
          if (
            cndy.state.endSettings.number.toNumber() <
            new Date().getTime() / 1000
          ) {
            active = false;
          }
        }
        // amount to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.amount) {
          const limit = Math.min(
            cndy.state.endSettings.number.toNumber(),
            cndy.state.itemsAvailable,
          );
          if (cndy.state.itemsRedeemed === limit) {
            cndy.state.isSoldOut = true;
          }
          setItemsLimit(limit);
        } else {
          setItemsLimit(cndy.state.itemsAvailable);
        }
        setItemsRedeemed(cndy.state.itemsRedeemed);

        if (cndy.state.isSoldOut) {
          active = false;
        }

        setIsActive((cndy.state.isActive = active));
        setIsPresale((cndy.state.isPresale = presale));
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
  }, [anchorWallet, candyMachineId, connection]);

  const onMint = async (
    beforeTransactions: Transaction[] = [],
    afterTransactions: Transaction[] = [],
  ) => {
    try {
      setIsUserMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintOne = await mintOneToken(
          candyMachine,
          wallet.publicKey,
          beforeTransactions,
          afterTransactions,
        );

        const mintTxId = mintOne[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            txTimeoutInMilliseconds,
            connection,
            true,
          );
        }

        if (status && !status.err) {
          // manual update since the refresh might not detect
          // the change immediately
          setItemsRedeemed(candyMachine.state.itemsRedeemed);
          setIsActive(
            (candyMachine.state.isActive =
              itemsLimit - candyMachine.state.itemsRedeemed > 0),
          );
          candyMachine.state.isSoldOut =
            itemsLimit - candyMachine.state.itemsRedeemed === 0;
          notify({
            message: 'Congratulations! Mint succeeded!',
            type: 'success',
          });
        } else {
          notify({
            message: 'Mint failed! Please try again!',
            type: 'error',
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x137')) {
          console.log(error);
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          console.log(error);
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      notify({
        message,
        type: 'error',
      });
      // updates the candy machine state to reflect the lastest
      // information on chain
      refreshCandyMachineState();
    } finally {
      setIsUserMinting(false);
    }
  };

  const toggleMintButton = () => {
    let active = !isActive || isPresale;

    if (active) {
      if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) {
        active = false;
      }
      if (endDate && Date.now() >= endDate.getTime()) {
        active = false;
      }
    }

    if (
      isPresale &&
      candyMachine!.state.goLiveDate &&
      candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000
    ) {
      setIsPresale((candyMachine!.state.isPresale = false));
    }

    setIsActive((candyMachine!.state.isActive = active));
  };

  useEffect(() => {
    if (candyMachineId) {
      refreshCandyMachineState();
    }
  }, [candyMachineId, anchorWallet, connection, refreshCandyMachineState]);

  const getCountdownDate = (
    candyMachine: CandyMachineAccount,
  ): Date | undefined => {
    if (
      candyMachine.state.isActive &&
      candyMachine.state.endSettings?.endSettingType.date
    ) {
      return toDate(candyMachine.state.endSettings.number);
    }

    return toDate(
      candyMachine.state.goLiveDate
        ? candyMachine.state.goLiveDate
        : candyMachine.state.isPresale
        ? new anchor.BN(new Date().getTime() / 1000)
        : undefined,
    );
  };

  return (
    <div className="main-area launchpad-detail">
      {loading ? (
        <div className="load-container">
          <Spin size="large" />
        </div>
      ) : (
        collection &&
        candyMachine && (
          <Row style={{ flexFlow: 'row wrap-reverse' }}>
            <Col span={24} md={12}>
              <div className="collection-container">
                <h1>{collection['name']}</h1>
                <div className="info-container">
                  <div className="item-content">
                    TOTAL ITEMS{' '}
                    <span style={{ fontWeight: 600 }}>{itemsLimit}</span>
                  </div>
                  <div className="item-content">
                    PRICE{' '}
                    <span style={{ fontWeight: 600 }}>{`${formatNumber.asNumber(
                      candyMachine.state.price,
                    )} ◎`}</span>
                  </div>
                  {collection['website'] && (
                    <a href={collection['website']}>
                      <img src="/icons/website.svg" alt="website" />
                    </a>
                  )}
                  <a href={collection['discord']}>
                    <img src="/icons/discord.svg" alt="discord" />
                  </a>
                  <a href={collection['twitter']}>
                    <img src="/icons/twitter2.svg" alt="twitter" />
                  </a>
                </div>
                <p className="description">{collection['description']}</p>
                {isWhitelistUser && discountPrice && (
                  <div className="sale-info">
                    <div className="sale-top">
                      <span className="sale-type">White List</span>
                      <MintCountdown
                        date={getCountdownDate(candyMachine)}
                        status={
                          candyMachine.state.isSoldOut ||
                          (endDate && Date.now() > endDate.getTime())
                            ? 'ENDED'
                            : 'LIVE'
                        }
                        onComplete={toggleMintButton}
                      />
                    </div>
                    <div className="sale-bottom">
                      Price{' '}
                      <span
                        style={{ fontWeight: 600 }}
                      >{`${formatNumber.asNumber(discountPrice)}◎`}</span>
                    </div>
                  </div>
                )}
                <div className="sale-info">
                  <div className="sale-top">
                    <span className="sale-type">Public Sale</span>
                    <MintCountdown
                      date={getCountdownDate(candyMachine)}
                      status={
                        candyMachine.state.isSoldOut ||
                        (endDate && Date.now() > endDate.getTime())
                          ? 'ENDED'
                          : 'LIVE'
                      }
                      onComplete={toggleMintButton}
                    />
                  </div>
                  <div className="sale-bottom">
                    Price{' '}
                    <span style={{ fontWeight: 600 }}>{`${formatNumber.asNumber(
                      candyMachine.state.price,
                    )}◎`}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={24} md={12}>
              <div className="collection-container image-container">
                <img
                  src={collection['image']}
                  alt="image"
                  className="collection-image"
                />
                {collection['mint_ended'] ? (
                  <Row className="bottom-content">
                    <Col span={24} xxl={14}>
                      <div className="progress-content">
                        <div className="progress-info">
                          <span>Total minted</span>
                          <span>
                            <span
                              style={{ color: 'white', fontWeight: 500 }}
                            >{`${Math.floor(
                              (itemsRedeemed / itemsLimit) * 100,
                            )}%`}</span>{' '}
                            {`(${itemsRedeemed}/${itemsLimit})`}
                          </span>
                        </div>
                        <Progress
                          showInfo={false}
                          percent={Math.floor(
                            (itemsRedeemed / itemsLimit) * 100,
                          )}
                        />
                      </div>
                    </Col>
                    <Col span={24} xxl={10} className="btn-content">
                      <Button className="my-btn">Visit Collection</Button>
                    </Col>
                  </Row>
                ) : (
                  showMintInfo &&
                  (!wallet.connected ? (
                    <div className="bottom-content">
                      <ConnectButton className="my-btn" />
                    </div>
                  ) : (
                    <Row className="bottom-content">
                      <Col span={24} xxl={14}>
                        <div className="progress-content">
                          <div className="progress-info">
                            <span>Total minted</span>
                            <span>
                              <span
                                style={{ color: 'white', fontWeight: 500 }}
                              >{`${Math.floor(
                                (itemsRedeemed / itemsLimit) * 100,
                              )}%`}</span>{' '}
                              {`(${itemsRedeemed}/${itemsLimit})`}
                            </span>
                          </div>
                          <Progress
                            showInfo={false}
                            percent={Math.floor(
                              (itemsRedeemed / itemsLimit) * 100,
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={24} xxl={10} className="btn-content">
                        <Button className="my-btn">Mint</Button>
                      </Col>
                    </Row>
                  ))
                )}
              </div>
            </Col>
          </Row>
        )
      )}
    </div>
  );
};
