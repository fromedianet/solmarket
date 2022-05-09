import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Spin, Button, Progress } from 'antd';
import { useCollectionsAPI } from '../../hooks/useCollectionsAPI';
import {
  CANDY_MACHINE_PROGRAM_ID,
  ConnectButton,
  notify,
  toPublicKey,
  useConnection,
  useConnectionConfig,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  CandyMachineAccount,
  getCandyMachineState,
  mintOneToken,
  getCollectionPDA,
  SetupState,
  createAccountsForMint,
  awaitTransactionSignatureConfirmation,
} from './candy-machine';
import { formatNumber, getAtaForMint, toDate } from './utils';
import { PublicKey, Transaction } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { MintCountdown } from './MintCountdown';
import { DEFAULT_TIMEOUT, sendTransaction } from './connection';
import { MintButton } from './MintButton';
import { useSocket } from '../../contexts';

export const LaunchpadDetailView = () => {
  const params = useParams<{ symbol: string }>();
  const symbol = params.symbol || '';
  const { getCollectionBySymbol, updateCandyMachineStatus } =
    useCollectionsAPI();
  const wallet = useWallet();
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState({});
  const [candyMachineId, setCandyMachineId] = useState<PublicKey>();
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
  const [needTxnSplit, setNeedTxnSplit] = useState(true);
  const [setupTxn, setSetupTxn] = useState<SetupState>();
  const [refresh, setRefresh] = useState(0);
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
    getCollectionBySymbol({ symbol, type: 1 })
      // @ts-ignore
      .then((res: any) => {
        if (res) {
          setCollection(res);
          const candyMachineId = res['candymachine_id'];
          if (candyMachineId) {
            setCandyMachineId(toPublicKey(candyMachineId));
          }
        }
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
          if (!collection['mint_ended']) {
            updateCandyMachineStatus({
              candymachine_id: candyMachineId.toBase58(),
              mint_ended: true,
            }).then(res => console.log('>>> updateCandyMachineStatus', res));
          }
        }

        const [collectionPDA] = await getCollectionPDA(candyMachineId);
        const collectionPDAAccount =
          await cndy.program.provider.connection.getAccountInfo(collectionPDA);

        setIsActive((cndy.state.isActive = active));
        setIsPresale((cndy.state.isPresale = presale));
        console.log('candyMachine', cndy);
        setCandyMachine(cndy);

        const txnEstimate =
          892 +
          (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
          (cndy.state.tokenMint ? 177 : 0) +
          (cndy.state.whitelistMintSettings ? 33 : 0) +
          (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 145 : 0) +
          (cndy.state.gatekeeper ? 33 : 0) +
          (cndy.state.gatekeeper?.expireOnUse ? 66 : 0);

        setNeedTxnSplit(txnEstimate > 1230);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === `Account does not exist ${candyMachineId}`) {
            notify({
              message: `Couldn't fetch candy machine state from candy machine with address: ${candyMachineId}, using rpc: ${endpoint.url}!`,
              type: 'error',
            });
          } else if (e.message.startsWith('failed to get info about account')) {
            notify({
              message: `Couldn't fetch candy machine state with rpc: ${endpoint.url}!`,
              type: 'error',
            });
          }
        } else {
          notify({
            message: `${e}`,
            type: 'error',
          });
        }
        console.log(e);
      }
    }
  }, [wallet, connection, candyMachineId, refresh]);

  const onMint = async (
    beforeTransactions: Transaction[] = [],
    afterTransactions: Transaction[] = [],
  ) => {
    try {
      setIsUserMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        let setupMint: SetupState | undefined;
        if (needTxnSplit && setupTxn === undefined) {
          notify({
            message: 'Please sign account setup transaction',
            type: 'info',
          });
          setupMint = await createAccountsForMint(
            candyMachine,
            wallet.publicKey,
          );
          let status: any = { err: true };
          if (setupMint.transaction) {
            status = await awaitTransactionSignatureConfirmation(
              setupMint.transaction,
              DEFAULT_TIMEOUT,
              connection,
              true,
            );
          }
          if (status && !status.err) {
            setSetupTxn(setupMint);
            notify({
              message:
                'Setup transaction succeeded! Please sign minting transaction',
              type: 'info',
            });
          } else {
            notify({
              message: 'Mint failed! Please try again!',
              type: 'error',
            });
            setIsUserMinting(false);
            return;
          }
        } else {
          notify({
            message: 'Please sign minting transaction',
            type: 'info',
          });
        }

        const mintResult = await mintOneToken(
          candyMachine,
          wallet.publicKey,
          beforeTransactions,
          afterTransactions,
          setupMint ?? setupTxn,
        );

        console.log('>>> mintResult', mintResult);
        const mintTxId = mintResult[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            DEFAULT_TIMEOUT,
            connection,
            true,
          );
        }

        if (status && !status.err) {
          // manual update since the refresh might not detect
          // the change immediately
          const redeemed = itemsRedeemed! + 1;
          setItemsRedeemed(redeemed);
          setIsActive(
            (candyMachine.state.isActive = itemsLimit - redeemed > 0),
          );
          candyMachine.state.isSoldOut = itemsLimit - redeemed === 0;
          setSetupTxn(undefined);
          notify({
            message: 'Congratulations! Mint succeeded!',
            type: 'success',
          });
          socket.emit('syncCandyMachine', {
            candyMachineId: candyMachineId!.toBase58(),
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
          message = 'Transaction timeout! Please try again.';
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

      // updates the candy machine state to reflect the latest
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
    const interval = setInterval(() => {
      setRefresh(Date.now());
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (candyMachineId && !isUserMinting) {
      refreshCandyMachineState();
    }
  }, [
    candyMachineId,
    anchorWallet,
    connection,
    refreshCandyMachineState,
    refresh,
  ]);

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
                      <Button
                        className="mint-btn"
                        onClick={() => {
                          navigate(`/marketplace/1/${symbol}`);
                        }}
                      >
                        Visit Collection
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  showMintInfo &&
                  (!wallet.connected ? (
                    <div className="bottom-content">
                      <ConnectButton className="mint-btn" />
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
                      <Col span={24} xxl={10}>
                        <div className="btn-content">
                          {candyMachine?.state.isActive &&
                          candyMachine?.state.gatekeeper &&
                          wallet.publicKey &&
                          wallet.signTransaction ? (
                            <GatewayProvider
                              wallet={{
                                publicKey:
                                  wallet.publicKey || CANDY_MACHINE_PROGRAM_ID,
                                //@ts-ignore
                                signTransaction: wallet.signTransaction,
                              }}
                              gatekeeperNetwork={
                                candyMachine?.state?.gatekeeper
                                  ?.gatekeeperNetwork
                              }
                              clusterUrl={endpoint.url}
                              handleTransaction={async (
                                transaction: Transaction,
                              ) => {
                                setIsUserMinting(true);
                                const userMustSign =
                                  transaction.signatures.find(sig =>
                                    sig.publicKey.equals(wallet.publicKey!),
                                  );
                                if (userMustSign) {
                                  notify({
                                    message:
                                      'Please sign one-time Civic Pass issuance',
                                    type: 'info',
                                  });
                                  try {
                                    transaction = await wallet.signTransaction!(
                                      transaction,
                                    );
                                  } catch (e) {
                                    notify({
                                      message: 'User cancelled signing',
                                      type: 'error',
                                    });
                                    // setTimeout(() => window.location.reload(), 2000);
                                    setIsUserMinting(false);
                                    throw e;
                                  }
                                } else {
                                  notify({
                                    message: 'Refreshing Civic Pass',
                                    type: 'info',
                                  });
                                }
                                try {
                                  await sendTransaction(
                                    connection,
                                    wallet,
                                    transaction,
                                    [],
                                    true,
                                    'confirmed',
                                  );
                                  notify({
                                    message: 'Please sign minting',
                                    type: 'info',
                                  });
                                } catch (e) {
                                  notify({
                                    message:
                                      'Solana dropped the transaction, please try again',
                                    type: 'warning',
                                  });
                                  console.error(e);
                                  // setTimeout(() => window.location.reload(), 2000);
                                  setIsUserMinting(false);
                                  throw e;
                                }
                                await onMint();
                              }}
                              broadcastTransaction={false}
                              options={{ autoShowModal: false }}
                            >
                              <MintButton
                                candyMachine={candyMachine}
                                isMinting={isUserMinting}
                                setIsMinting={val => setIsUserMinting(val)}
                                onMint={onMint}
                                isActive={
                                  isActive || (isPresale && isWhitelistUser)
                                }
                              />
                            </GatewayProvider>
                          ) : (
                            <MintButton
                              candyMachine={candyMachine}
                              isMinting={isUserMinting}
                              setIsMinting={val => setIsUserMinting(val)}
                              onMint={onMint}
                              isActive={
                                isActive || (isPresale && isWhitelistUser)
                              }
                            />
                          )}
                        </div>
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
