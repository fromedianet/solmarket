import React, { useEffect } from "react";

const description = `
  NFT stands for Non-Fungible Token. Basically that means that you have a one of a kind token which can be transferred from one wallet to the next with all these transactions recorded on the blockchain.\n
  NFTs were popularized on the ETH blockchain but more modern Layer 1 chains like Solana have taken it to another level with deeper NFT functionality as well as almost no transaction fees. Transaction fees on ETH can be anywhere from $20-$100 per transaction, while transaction fees on Solana are typically < $0.003. This enables many more use cases for NFTs, especially on-chain gaming.\n
  So you've bought some NFTs and now it's time to unload them. All you need to do is connect your wallet to an NFT marketplace like PaperCity, go to your collection, and click "List NFT"\n
  Boom your NFT is now listed for sale and just waiting for the right collector to come along and give it a new home.
`;

export default function SellView() {
  useEffect(() => {
    window.addEventListener("scroll", () => {}, { passive: true });
  }, []);

  return (
    <div className="main-area">
      <div className="main-page">
        <div className="container sell-page">
          <h1>Sell your Solana NFT</h1>
          <NewLineText text={description} style={{ color: "#9ca3af" }}/>
        </div>
      </div>
    </div>
  );
}

function NewLineText(props) {
  const { text, style } = props;
  const newText = text.split('\n').map((str, index) => str.length > 0 ? <p key={index} style={style}>{str}</p> : <></>);
  return newText;
}
