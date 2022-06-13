import dynamic from "next/dynamic";
import React from "react";

const OpenGraphHead = dynamic(() => import("../components/OpenGraphHead"), {
  ssr: true,
});
const Providers = dynamic(() => import("../contexts/providers"), {
  ssr: false,
});
const HomeView = dynamic(() => import("../views/home"), { ssr: false });

export default function HomePage() {
  const metaTags = {
    ogTitle: "PaperCity",
    ogDescription:
      "PaperCity is a marketplace aggregator for NFTs on the Solana platform, incorporating listings from all the most popular marketplaces as well as our own inventory",
    ogUrl: "https://papercity.io",
    ogImage: "https://papercity-bucket.s3.amazonaws.com/papercity_logo.png",
  };

  return (
    <>
      <OpenGraphHead
        ogTitle={metaTags.ogTitle}
        ogDescription={metaTags.ogDescription}
        ogUrl={metaTags.ogUrl}
        ogImage={metaTags.ogImage}
      />
      <Providers>
        <HomeView />
      </Providers>
    </>
  );
}
