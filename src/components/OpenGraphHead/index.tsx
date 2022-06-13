import Head from "next/head";
export default function OpenGraphHead(props: {
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
}) {
  return (
    <Head>
      {/* Open Graph */}
      <meta property="og:url" content={props.ogUrl} key="ogurl" />
      <meta property="og:image" content={props.ogImage} key="ogimage" />
      <meta property="og:site_name" content="PaperCity" key="ogsitename" />
      <meta property="og:title" content={props.ogTitle} key="ogtitle" />
      <meta
        property="og:description"
        content={props.ogDescription}
        key="ogdesc"
      />
      <meta property="og:type" content="article" key="ogtype" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twcard" />
      <meta name="twitter:title" content={props.ogTitle} key="twtitle" />
      <meta
        name="twitter:description"
        content={props.ogDescription}
        key="twdescription"
      />
      <meta name="twitter:image" content={props.ogImage} key="twimage" />
    </Head>
  );
}
