import dynamic from "next/dynamic";
import React from "react";

const OpenGraphHead = dynamic(() => import("../../../../components/OpenGraphHead"), {
  ssr: true,
});
const Providers = dynamic(() => import("../../../../contexts/providers"), {
  ssr: false,
});
const ItemDetailView = dynamic(() => import("../../../../views/itemDetail"), { ssr: false });

function ItemDetailPage({ market, symbol, mint, metaTags }) {
  return (
    <>
      <OpenGraphHead
        ogTitle={metaTags.ogTitle}
        ogDescription={metaTags.ogDescription}
        ogUrl={metaTags.ogUrl}
        ogImage={metaTags.ogImage}
      />
      <Providers>
        <ItemDetailView market={market} symbol={symbol} mint={mint} />
      </Providers>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const market: string = query.market;
  const symbol: string = query.symbol;
  const mint: string = query.mint;

  let metaTags = {
    ogTitle: "PaperCity",
    ogDescription:
      "PaperCity is a marketplace aggregator for NFTs on the Solana platform, incorporating listings from all the most popular marketplaces as well as our own inventory",
    ogUrl: `https://papercity.io`,
    ogImage: "https://papercity-bucket.s3.amazonaws.com/papercity_logo.png",
  };
  const res = await fetch(`https://api.papercity.io/api/nfts/getNftByMint`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mint })
    },
  )
  const data = await res.json();
  if (data.data) {
    metaTags = {
      ogTitle: data.data.name,
      ogDescription: data.data.description,
      ogUrl: `https://papercity.io/item-details/${market}/${symbol}/${mint}`,
      ogImage: data.data.image,
    }
  }

  return {
    props: {
      market,
      symbol,
      mint,
      metaTags,
    },
  };
}

export default ItemDetailPage;
