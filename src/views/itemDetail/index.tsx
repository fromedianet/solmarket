import React, { lazy, useEffect, useState } from "react";
import { Spin, Button, Divider } from "antd";
import Head from "next/head";
import { getDateStringFromUnixTimestamp } from "../../utils/utils";
import { useNFTsAPI } from "../../hooks/useNFTsAPI";
import { Transaction as TransactionData } from "../../models/exCollection";
import { useTransactionsAPI } from "../../hooks/useTransactionsAPI";
import { MarketType, meConnection } from "../../constants";
import { Offer } from "../../models/offer";
import { useWallet } from "@solana/wallet-adapter-react";
import { useInstructionsAPI } from "../../hooks/useInstructionsAPI";
import { toast } from "react-toastify";
import { Connection, Message, Transaction } from "@solana/web3.js";
import { sendTransaction, useConnection, useSocket } from "../../contexts";
import { showEscrow } from "../../actions/showEscrow";
import { useMEApis } from "../../hooks/useMEApis";
import { AUCTION_HOUSE_ID } from "../../utils/ids";

const MetaplexModal = lazy(() => import("../../components/MetaplexModal"));
const EmptyView = lazy(() => import("../../components/EmptyView"));
const BottomSection = lazy(() => import("./bottomSection"));
const InfoSection = lazy(() => import("./infoSection"));

export default function ItemDetailView(props: {
  market: string;
  symbol: string;
  mint: string;
}) {
  const [market, setMarket] = useState<string>(
    props.market || MarketType.PaperCity
  );
  const symbol: string = props.symbol || "";
  const mint: string = props.mint || "";
  const wallet = useWallet();
  const connection = useConnection();
  const { socket } = useSocket();
  const [nft, setNFT] = useState<any>();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [nftList, setNFTList] = useState<any[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [myOffer, setMyOffer] = useState<Offer>();
  const [refresh, setRefresh] = useState(0);
  const [biddingBalance, setBiddingBalance] = useState(0);
  const [cancelVisible, setCancelVisible] = useState(false);
  const { getNftByMint, getListedNftsByQuery } = useNFTsAPI();
  const { getTransactionsByMint, getOffersByMints } = useTransactionsAPI();
  const { buyNow, list, cancelList, placeBid, cancelBid, buyNowME } =
    useInstructionsAPI();
  const meApis = useMEApis();

  useEffect(() => {
    window.addEventListener("scroll", () => {}, { passive: true });
  }, []);

  useEffect(() => {
    if (nft && socket) {
      if (nft.market === MarketType.PaperCity) {
        const auctionHouseListener = (params: any[]) => {
          if (params.some((k) => k.mint === nft.mint)) {
            setRefresh(Date.now());
          }
        };

        const nftsListener = (params: any) => {
          if (params.wallet === wallet.publicKey?.toBase58()) {
            setRefresh(Date.now());
          }
        };
        socket.on("syncedAuctionHouse", auctionHouseListener);
        socket.on("syncedNFTsByOwner", nftsListener);

        return () => {
          socket.off("syncedAuctionHouse", auctionHouseListener);
          socket.off("syncedNFTsByOwner", nftsListener);
        };
      }
    }
  }, [socket, nft]);

  useEffect(() => {
    getNFT().then((res) => {
      if (res) setNFT(res);
    });

    getTransactions().then((res) => setTransactions(res));
  }, [mint, refresh]);

  useEffect(() => {
    const filters = transactions.filter(
      (item) => item.txType === "SALE" || item.txType === "Auction Settled"
    );
    const data = filters.map((item) => ({
      date: getDateStringFromUnixTimestamp(item.blockTime),
      price: item.price || 0,
    }));

    setPriceData(data.reverse());
  }, [transactions]);

  useEffect(() => {
    if (nft) {
      getListedNFTs(nft).then((res) => setNFTList(res));
      getEscrowBalance().then((val) => setBiddingBalance(val));
      getOffers(mint, nft.owner).then((res) => {
        setOffers(res);
      });
    }
  }, [nft, wallet]);

  useEffect(() => {
    if (wallet.publicKey && offers.length > 0) {
      const offer = offers.find(
        (k) => k.buyer === wallet.publicKey!.toBase58()
      );
      if (offer) {
        setMyOffer(offer);
      }
    }
  }, [wallet, offers]);

  async function getNFT() {
    if (!mint) return undefined;
    if (loadingPage) return;
    setLoadingPage(true);

    let result = await getNftByMint(mint);
    if (market !== MarketType.PaperCity && result) {
      if (result.price > 0) {
        // When NFT was already listed on PaperCity
        setMarket(MarketType.PaperCity);
        result = {
          ...result,
          market: MarketType.PaperCity,
        };
      } else {
        const nftData = await meApis.getNFTByMintAddress(mint, market);
        if (nftData) {
          result = {
            ...result,
            symbol: nftData.symbol || symbol,
            price: nftData.price || 0,
            auctionHouse: nftData.auctionHouse || null,
            owner: nftData.owner || result.owner,
            escrowPubkey: nftData.escrowPubkey || null,
            market: market,
          };
        } else {
          result = {
            ...result,
            symbol: symbol,
            market: market,
          };
        }
      }
    }

    setLoadingPage(false);
    return result;
  }

  async function getTransactions(): Promise<any[]> {
    let data = await getTransactionsByMint(mint);
    const exData = await meApis.getTransactionsByMint(mint, market);
    let txs = data.map((k) => k.transaction);
    exData.forEach((item) => {
      if (!txs.includes(item.transaction)) {
        data.push(item);
        txs.push(item.transaction);
      }
    });
    data.sort((a, b) => {
      if (b.blockTime > a.blockTime) {
        return 1;
      } else if (b.blockTime < a.blockTime) {
        return -1;
      } else {
        if (b.id > a.id) {
          return 1;
        } else if (b.id < a.id) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    data = data.map((k: any, index: number) => ({
      ...k,
      key: index,
    }));
    return data;
  }

  async function getListedNFTs(nftItem: any) {
    let result: any[] = [];
    const param = {
      symbol: nftItem.symbol,
      sort: 1,
      type: market,
      status: false,
    };

    if (
      market === MarketType.DigitalEyes ||
      market === MarketType.Solanart ||
      market === MarketType.AlphaArt
    ) {
      // @ts-ignore
      result = await meApis.getListedNftsByQuery(param, market);
    } else {
      // @ts-ignore
      result = await getListedNftsByQuery(param);
    }

    result = result.filter((item) => item.mint != nftItem.mint);
    return result;
  }

  async function getOffers(mintAddress: string, owner: string) {
    let list: Offer[] = await getOffersByMints({
      mints: [mintAddress],
      owner: owner,
    });

    list = list.map((item, index) => ({
      ...item,
      key: index,
    }));
    return list;
  }

  const onListNow = async (price: number) => {
    if (!wallet.publicKey || !nft) return;

    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result: any = await list({
          seller: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: nft.mint,
          price: price,
        });
        if (result && "data" in result) {
          const status = await runInstructions(result["data"], connection);
          if (!status["err"]) {
            socket.emit("syncAuctionHouse", { mint: nft.mint });
            resolve("");
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          "After wallet approval, your transaction will be finished in a few seconds",
        error: "Something wrong. Please refresh the page and try again.",
        success:
          "Transaction has been successed! Your data will be updated in a minute",
      },
      {
        position: "top-center",
        theme: "dark",
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      }
    );
  };

  const onCancelList = async () => {
    if (!wallet.publicKey || !nft) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const result: any = await cancelList({
          seller: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: nft.mint,
          price: nft.price,
        });
        if (result && "data" in result) {
          const status = await runInstructions(result["data"], connection);
          if (!status["err"]) {
            socket.emit("syncAuctionHouse", { mint: nft.mint });
            resolve("");
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          "After wallet approval, your transaction will be finished in a few seconds",
        error: "Something wrong. Please refresh the page and try again.",
        success:
          "Transaction has been successed! Your data will be updated in a minute",
      },
      {
        position: "top-center",
        theme: "dark",
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      }
    );
  };

  const openMarketPlace = () => {
    let url = "";
    if (nft.market === MarketType.MagicEden) {
      url = `https://magiceden.io/item-details/${nft.mint}`;
    } else if (nft.market === MarketType.Solanart) {
      url = `https://solanart.io/nft/${nft.mint}`;
    } else if (nft.market === MarketType.DigitalEyes) {
      url = `https://digitaleyes.market/item/Solarians/${nft.mint}`;
    } else if (nft.market === MarketType.AlphaArt) {
      url = `https://alpha.art/t/${nft.mint}`;
    }
    window.open(url, "_blank");
  };

  const onBuyNow = async () => {
    if (!wallet.publicKey || !nft) return;
    console.log("=========== onBuyNow ============", nft);
    if (nft.market !== MarketType.PaperCity && !nft.auctionHouse) {
      openMarketPlace();
      return;
    }
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        if (nft.market !== MarketType.PaperCity) {
          if (nft.auctionHouse && nft.escrowPubkey) {
            const result: any = await buyNowME({
              buyer: wallet.publicKey!.toBase58(),
              seller: nft.owner,
              auctionHouseAddress: nft.auctionHouse,
              tokenMint: nft.mint,
              escrowPubkey: nft.escrowPubkey,
              expiry: -1,
              price: nft.price,
            });
            if (result && "data" in result) {
              const status = await runInstructions(
                result["data"],
                meConnection
              );
              if (!status["err"]) {
                setTimeout(() => {
                  socket.emit("syncGetNFTsByOwner", {
                    wallet: wallet.publicKey?.toBase58(),
                  });
                }, 20000);
                resolve("");
                return;
              }
            }
          }
        } else {
          const result: any = await buyNow({
            buyer: wallet.publicKey!.toBase58(),
            seller: nft.owner,
            auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
            tokenMint: nft.mint,
            price: nft.price,
          });
          if (result && "data" in result) {
            const status = await runInstructions(result["data"], connection);
            if (!status["err"]) {
              socket.emit("syncAuctionHouse", { mint: nft.mint });
              resolve("");
              return;
            }
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          "After wallet approval, your transaction will be finished in a few seconds",
        error: "Something wrong. Please refresh the page and try again.",
        success:
          "Transaction has been successed! Your data will be updated in a minute",
      },
      {
        position: "top-center",
        theme: "dark",
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      }
    );
  };

  const onPlaceBid = async (price: number) => {
    if (!wallet.publicKey || !nft) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        // Own marketplace placeBid
        const result: any = await placeBid({
          buyer: wallet.publicKey!.toBase58(),
          seller: nft.owner,
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: nft.mint,
          price: price,
        });
        if (result && "data" in result) {
          const status = await runInstructions(result["data"], connection);
          if (!status["err"]) {
            socket.emit("syncAuctionHouse", { mint: nft.mint });
            resolve("");
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          "After wallet approval, your transaction will be finished in a few seconds",
        error: "Something wrong. Please refresh the page and try again.",
        success:
          "Transaction has been successed! Your data will be updated in a minute",
      },
      {
        position: "top-center",
        theme: "dark",
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      }
    );
  };

  const onCancelBid = (offer: Offer) => {
    if (!wallet.publicKey) return;
    // eslint-disable-next-line no-async-promise-executor
    const resolveWithData = new Promise(async (resolve, reject) => {
      try {
        const result: any = await cancelBid({
          buyer: wallet.publicKey!.toBase58(),
          auctionHouseAddress: AUCTION_HOUSE_ID.toBase58(),
          tokenMint: offer.mint,
          tokenAccount: offer.tokenAccount,
          tradeState: offer.tradeState!,
          price: offer.bidPrice,
        });
        if (result && "data" in result) {
          const status = await runInstructions(result["data"], connection);
          if (!status["err"]) {
            socket.emit("syncAuctionHouse", {
              wallet: wallet.publicKey!.toBase58(),
            });
            resolve("");
            return;
          }
        }

        reject();
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(
      resolveWithData,
      {
        pending:
          "After wallet approval, your transaction will be finished in a few seconds",
        error: "Something wrong. Please refresh the page and try again.",
        success:
          "Transaction has been successed! Your data will be updated in a minute",
      },
      {
        position: "top-center",
        theme: "dark",
        autoClose: 6000,
        hideProgressBar: false,
        pauseOnFocusLoss: false,
      }
    );
  };

  async function getEscrowBalance() {
    let result = 0;
    if (wallet.publicKey && nft) {
      result = await showEscrow(connection, wallet.publicKey);
    }
    return result;
  }

  async function runInstructions(data: Buffer, _connection: Connection) {
    let status: any = { err: true };
    try {
      const transaction = Transaction.populate(Message.from(data));
      console.log("---- transaction ---", transaction);
      // @ts-ignore
      const { txid } = await sendTransaction(
        _connection,
        wallet,
        transaction.instructions,
        []
      );

      console.log("---------- transaction id --------------", txid);
      if (txid) {
        status = await _connection.confirmTransaction(txid, "confirmed");
      }
    } catch (e) {
      console.error("----- runInstructions error ------------", e);
    }
    return status;
  }

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container art-container">
          {loadingPage ? (
            <Spin />
          ) : nft ? (
            <>
              <Head>
                <meta property="og:title" content={nft.name} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={nft.image} />
                <meta property="og:description" content={nft.description} />
                <meta property="og:site_name" content="PaperCity" />
              </Head>
              <InfoSection
                nft={nft}
                loading={loading}
                biddingBalance={biddingBalance}
                priceData={priceData}
                myOffer={myOffer}
                onRefresh={() => setRefresh(Date.now())}
                onListNow={onListNow}
                onCancelList={onCancelList}
                onBuyNow={onBuyNow}
                onPlaceBid={onPlaceBid}
                onOpenMarketplace={openMarketPlace}
                onCancelVisible={() => setCancelVisible(true)}
              />
              <BottomSection
                transactions={transactions}
                nft={nft}
                nftList={nftList}
                offers={offers}
                setMyOffer={(val) => setMyOffer(val)}
                onCancelVisible={() => setCancelVisible(true)}
              />
            </>
          ) : (
            <EmptyView />
          )}
        </div>
      </div>
      <MetaplexModal
        className="cancel-modal"
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
      >
        <>
          <span className="header-text">
            {myOffer?.market ? "Cancel the offer (ME)" : "Cancel the offer"}
          </span>
          <div className="body-container">
            <span className="description">
              When your offer is canceled, the funds will remain in your bidding
              wallet until you withdraw them. This is to allow your other bids
              to remain open and prevent them from becoming invalid. When
              you&apos;re ready to withdraw the funds from your bidding wallet,
              you can do so from the &apos;Offers Made&apos; page of your
              profile.
            </span>
            <Button
              className="button"
              onClick={() => {
                setCancelVisible(false);
                onCancelBid(myOffer!);
              }}
            >
              Cancel offer
            </Button>
            <span className="nft-name" style={{ marginTop: 24 }}>
              {`${myOffer?.name} ${myOffer?.market ? `(ME)` : ""}`}
            </span>
            <span className="nft-symbol">
              {myOffer?.symbol}
              <img
                src="/icons/check.svg"
                style={{ width: 14, height: 14, marginLeft: 8 }}
                alt="check icon"
              />
            </span>
            <Divider />
            <div className="wallet-info">
              <span className="wallet-label text-gray">Buy now price</span>
              <span className="wallet-label text-gray">
                {`${parseFloat((myOffer?.listingPrice || 0).toFixed(5))} SOL`}
              </span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Your offer</span>
              <span className="wallet-label">
                {`${parseFloat((myOffer?.bidPrice || 0).toFixed(5))} SOL`}
              </span>
            </div>
            <span className="bottom-label">
              By selecting &quot;Cancel offer&quot;, you agree to{" "}
              <a style={{ fontWeight: 600 }}>Terms of Service</a>
            </span>
          </div>
        </>
      </MetaplexModal>
    </div>
  );
}
