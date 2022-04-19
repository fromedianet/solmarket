export const APIS = {
  base_api_url:
    process.env.NEXT_ENV == 'production'
      ? 'https://api.papercity.io/api'
      : process.env.NEXT_ENV == 'development'
      ? 'https://staging.api.papercity.io/api'
      : 'http://localhost:5000/api',
  base_others_api_url:
    process.env.NEXT_ENV == 'production'
      ? 'https://othersapi.papercity.io/api'
      : process.env.NEXT_ENV == 'development'
      ? 'https://staging.othersapi.papercity.io/api'
      : 'http://localhost:8000/api',
  socket_url:
    process.env.NEXT_ENV == 'production'
      ? 'https://api.papercity.io/api'
      : process.env.NEXT_ENV == 'development'
      ? 'https://staging.api.papercity.io'
      : 'http://localhost:5000',
  magiceden_base_url: 'https://api-mainnet.magiceden.io/v2',
};
