import React from 'react';

const OpenGraphHead = ({ ogTitle, ogDescription, ogUrl, ogImage }: {
  ogTitle: string,
  ogDescription: string,
  ogUrl: string,
  ogImage: string;
}) => {
  return (
    <>
      {/* Open Graph */}
      <meta property="og:url" content={ogUrl} key="ogurl" />
      <meta property="og:image" content={ogImage} key="ogimage" />
      <meta property="og:site_name" content="PaperCity" key="ogsitename" />
      <meta property="og:title" content={ogTitle} key="ogtitle" />
      <meta property="og:description" content={ogDescription} key="ogdesc" />
      <meta property="og:type" content="article" key="ogtype"/>

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
};

export default OpenGraphHead;
