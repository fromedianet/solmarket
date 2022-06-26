/* eslint-disable no-undef */
const withPlugins = require("next-compose-plugins");
const withLess = require("next-with-less");

const assetPrefix = process.env.ASSET_PREFIX || "";

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  assetPrefix,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    NEXT_PUBLIC_STORE_OWNER_ADDRESS:
      process.env.STORE_OWNER_ADDRESS ||
      process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS,
    NEXT_PUBLIC_STORE_ADDRESS: process.env.STORE_ADDRESS,

    NEXT_SPL_TOKEN_MINTS: process.env.SPL_TOKEN_MINTS,
    NEXT_CG_SPL_TOKEN_IDS: process.env.CG_SPL_TOKEN_IDS,
    NEXT_ENV: process.env.REACT_ENV,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  compiler: {
    removeConsole: true,
  },
  productionBrowserSourceMaps: true,
});
