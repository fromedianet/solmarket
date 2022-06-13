import dynamic from "next/dynamic";
import React from "react";
import { MarketType } from "../../../constants";

const OpenGraphHead = dynamic(
  () => import("../../../components/OpenGraphHead"),
  {
    ssr: true,
  }
);
const MarketplaceView = dynamic(() => import("../../../views/marketplace"), {
  ssr: false,
});
const Providers = dynamic(() => import("../../../contexts/providers"), {
  ssr: false,
});

function MarketplacePage({ market, symbol, metaTags }) {
  return (
    <>
      <OpenGraphHead
        ogTitle={metaTags.ogTitle}
        ogDescription={metaTags.ogDescription}
        ogUrl={metaTags.ogUrl}
        ogImage={metaTags.ogImage}
      />
      <Providers>
        <MarketplaceView market={market} symbol={symbol} />
      </Providers>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const market: string = query.market;
  const symbol: string = query.symbol;

  let metaTags = {
    ogTitle: "PaperCity",
    ogDescription:
      "PaperCity is a marketplace aggregator for NFTs on the Solana platform, incorporating listings from all the most popular marketplaces as well as our own inventory",
    ogUrl: `https://papercity.io`,
    ogImage: "https://papercity-bucket.s3.amazonaws.com/papercity_logo.png",
  };
  if (market === MarketType.PaperCity) {
    const res = await fetch(
      `https://api.papercity.io/api/collections/getCollectionBySymbol`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol }),
      }
    );
    const data = await res.json();
    if (data.data) {
      metaTags = {
        ogTitle: data.data.name,
        ogDescription: data.data.description,
        ogUrl: `https://papercity.io/marketplace/${market}/${symbol}`,
        ogImage: data.data.image,
      };
    }
  } else {
    const res = await fetch(
      `https://othersapi.papercity.io/api/getCollectionBySymbol/${market}/${symbol}`
    );
    const data = await res.json();
    if (data.data) {
      metaTags = {
        ogTitle: data.data.name,
        ogDescription: data.data.description,
        ogUrl: `https://papercity.io/marketplace/${market}/${symbol}`,
        ogImage: data.data.image,
      };
    }
  }

  return {
    props: {
      market,
      symbol,
      metaTags,
    },
  };
}

export default MarketplacePage;
