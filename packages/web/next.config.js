/* eslint-disable no-undef */
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const assetPrefix = process.env.ASSET_PREFIX || '';

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#09080d',
            '@text-color': '#8e8e8e',
            '@text-color-secondary': '#9ca3af',
            '@assetPrefix': assetPrefix || "''",
          },
          javascriptEnabled: true,
        },
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  assetPrefix,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    NEXT_PUBLIC_STORE_OWNER_ADDRESS:
      process.env.STORE_OWNER_ADDRESS ||
      process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS,
    NEXT_PUBLIC_STORE_ADDRESS: process.env.STORE_ADDRESS,
    NEXT_PUBLIC_BIG_STORE: process.env.REACT_APP_BIG_STORE,
    NEXT_PUBLIC_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,

    NEXT_SPL_TOKEN_MINTS: process.env.SPL_TOKEN_MINTS,
    NEXT_CG_SPL_TOKEN_IDS: process.env.CG_SPL_TOKEN_IDS,
    NEXT_ENABLE_NFT_PACKS: process.env.REACT_APP_ENABLE_NFT_PACKS,
    NEXT_ENABLE_NFT_PACKS_REDEEM: process.env.REACT_APP_ENABLE_NFT_PACKS_REDEEM,
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
});
