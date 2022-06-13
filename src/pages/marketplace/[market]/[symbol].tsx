import dynamic from "next/dynamic";
import React from "react";

const MarketplaceView = dynamic(() => import("../../../views/marketplace"), {
  ssr: true,
});

function MarketplacePage({ market, symbol }) {
  return (
    <>
      <MarketplaceView market={market} symbol={symbol} />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const market: string = query.market;
  const symbol: string = query.symbol;

  return {
    props: {
      market,
      symbol,
    },
  };
}

export default MarketplacePage;
