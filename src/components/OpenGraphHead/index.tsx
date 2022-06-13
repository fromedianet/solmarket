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
      <meta
        property="og:url"
        content={props.ogUrl}
        key="ogurl"
        data-react-helmet="true"
      />
      <meta
        property="og:image"
        content={props.ogImage}
        key="ogimage"
        data-react-helmet="true"
      />
      <meta
        property="og:site_name"
        content="PaperCity"
        key="ogsitename"
        data-react-helmet="true"
      />
      <meta
        property="og:title"
        content={props.ogTitle}
        key="ogtitle"
        data-react-helmet="true"
      />
      <meta
        property="og:description"
        content={props.ogDescription}
        key="ogdesc"
        data-react-helmet="true"
      />
      <meta
        property="og:type"
        content="article"
        key="ogtype"
        data-react-helmet="true"
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
        data-react-helmet="true"
      />
      <meta
        name="twitter:title"
        content={props.ogTitle}
        data-react-helmet="true"
      />
      <meta
        name="twitter:description"
        content={props.ogDescription}
        data-react-helmet="true"
      />
      <meta
        name="twitter:image"
        content={props.ogImage}
        data-react-helmet="true"
      />
    </Head>
  );
}
