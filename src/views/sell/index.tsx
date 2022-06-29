import { useWallet } from "@solana/wallet-adapter-react";
import React, { lazy, useEffect, useState } from "react";
import { ConnectButton, HorizontalGrid } from "../../components";
import CardLoader from "../../components/CardLoader";
import { useNFTsAPI } from "../../hooks/useNFTsAPI";

const NFTCard = lazy(() => import("../../components/NFTCard"));

const description = `
  NFT stands for Non-Fungible Token. Basically that means that you have a one of a kind token which can be transferred from one wallet to the next with all these transactions recorded on the blockchain.\n
  NFTs were popularized on the ETH blockchain but more modern Layer 1 chains like Solana have taken it to another level with deeper NFT functionality as well as almost no transaction fees. Transaction fees on ETH can be anywhere from $20-$100 per transaction, while transaction fees on Solana are typically < $0.003. This enables many more use cases for NFTs, especially on-chain gaming.\n
  So you've bought some NFTs and now it's time to unload them. All you need to do is connect your wallet to an NFT marketplace like PaperCity, go to your collection, and click "List NFT"\n
  Boom your NFT is now listed for sale and just waiting for the right collector to come along and give it a new home.
`;

export default function SellView() {
  const wallet = useWallet();
  const { getRecentListings, getNFTsByWallet } = useNFTsAPI();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    myItems: [],
    myListings: [],
    listings: []
  });

  useEffect(() => {
    window.addEventListener("scroll", () => {}, { passive: true });
  }, []);

  useEffect(() => {
    if (wallet.publicKey) {
      if (loading) return;
      setLoading(true);
      loadData(wallet.publicKey.toBase58())
        .then((res: any) => setData(res))
        .finally(() => setLoading(false));
    }
  }, [wallet]);

  async function loadData(pubkey: string) {
    const res = await getNFTsByWallet(pubkey);
    const myItems = res.filter(k => k.price === 0);
    const myListings = res.filter(k => k.price > 0);
    const listings = await getRecentListings();

    const result = {
      myItems: myItems,
      myListings: myListings,
      listings: listings,
    };
    return result;
  }

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container sell-page">
          <h1>Sell your Solana NFT</h1>
          <NewLineText text={description} style={{ color: "#9ca3af" }}/>
          {!wallet.connected ? (
            <div className="connect-container">
              <p>Connect wallet to see this page</p>
              <ConnectButton className="connect-button" />
            </div>
          ) : (
            <>
              <div className="home-section">
                <div className="section-header">
                  <span className="section-title">My NFTs</span>
                </div>
                {loading
                  ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
                  : data["myItems"] && (
                      <HorizontalGrid
                        childrens={data["myItems"].map((item: any) => (
                          <NFTCard
                            key={item.mint}
                            item={item}
                            itemId={item.mint}
                            collection={item.collectionName}
                            className="margin-0"
                          />
                        ))}
                      />
                    )}
              </div>
              <div className="home-section">
                <div className="section-header">
                  <span className="section-title">My Listings</span>
                </div>
                {loading
                  ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
                  : data["myListings"] && (
                      <HorizontalGrid
                        childrens={data["myListings"].map((item: any) => (
                          <NFTCard
                            key={item.mint}
                            item={item}
                            itemId={item.mint}
                            collection={item.collectionName}
                            className="margin-0"
                          />
                        ))}
                      />
                    )}
              </div>
              <div className="home-section">
                <div className="section-header">
                  <span className="section-title">Recent Listings</span>
                </div>
                {loading
                  ? [...Array(2)].map((_, idx) => <CardLoader key={idx} />)
                  : data["listings"] && (
                      <HorizontalGrid
                        childrens={data["listings"].map((item: any) => (
                          <NFTCard
                            key={item.mint}
                            item={item}
                            itemId={item.mint}
                            collection={item.collectionName}
                            className="margin-0"
                          />
                        ))}
                      />
                    )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NewLineText(props) {
  const { text, style } = props;
  const newText = text.split('\n').map((str, index) => str.length > 0 ? <p key={index} style={style}>{str}</p> : null);
  return newText;
}
