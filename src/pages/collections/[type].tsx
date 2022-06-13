import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const OpenGraphHead = dynamic(() => import("../../components/OpenGraphHead"), {
  ssr: true,
});
const Providers = dynamic(() => import("../../contexts/providers"), {
  ssr: false,
});
const CollectionView = dynamic(() => import("../../views/collections"), {
  ssr: false,
});

export default function CollectionsPage() {
  const { query } = useRouter();
  // @ts-ignore
  const type: string = query.type;
  const metaTags = {
    ogTitle: "PaperCity",
    ogDescription:
      "PaperCity is a marketplace aggregator for NFTs on the Solana platform, incorporating listings from all the most popular marketplaces as well as our own inventory",
    ogUrl: `https://papercity.io/collections/${type}`,
    ogImage: "https://papercity-bucket.s3.amazonaws.com/papercity_logo.png",
  };
  console.log("Collections page", type);
  return (
    <>
      <OpenGraphHead
        ogTitle={metaTags.ogTitle}
        ogDescription={metaTags.ogDescription}
        ogUrl={metaTags.ogUrl}
        ogImage={metaTags.ogImage}
      />
      <Providers>
        <CollectionView type={type} />
      </Providers>
    </>
  );
}
