export const TITLE = {
  magiceden: 'Magic Eden',
  solanart: 'Solanart',
  digital_eyes: 'Digital Eyes',
  alpha_art: 'Alpha Art',
  // exchange_art: "Exchange Art",
  // solsea: "solsea",
};

export const COLLECTIONS_URI = {
  magiceden: 'https://api-mainnet.magiceden.io/all_collections?edge_cache=true',
  solanart: 'https://api.solanart.io/get_collections',
  digital_eyes:
    'https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever',
  alpha_art: 'https://apis.alpha.art/api/v1/collections?order=recent',
};

export const MAGIC_EDEN_URIS = {
  collections:
    'https://api-mainnet.magiceden.io/all_collections?edge_cache=true',
  collection: 'https://api-mainnet.magiceden.io/collections/',
  collectionStats:
    'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/',
  listedNFTs: 'https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery',
  getNFTByMintAddress:
    'https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/',
  getNFTStatsByMintAddress:
    'https://api-mainnet.magiceden.io/rpc/getNFTStatsByMintAddress/',
  getTransactions:
    'https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQuery?q=',
  getBiddingsByQuery:
    'https://api-mainnet.magiceden.io/rpc/getBiddingsByQuery?q=',
};

export const SOLANART_URIS = {
  collections: 'https://api.solanart.io/get_collections',
  collectionStats: 'https://api.solanart.io/get_floor_price?collection=',
  attributes: 'https://api.solanart.io/get_attributes_floor_price?collection=',
  volumeOnlyCollection:
    'https://api.solanart.io/volume_only_collection?collection=',
  listedNFTs: 'https://api.solanart.io/get_nft',
  getTransactions:
    'https://api.solanart.io/all_sold_per_collection_day?collection=',
};

export const DIGITAL_EYES_URIS = {
  collections:
    'https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever',
  collection:
    'https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever?collection=',
  listedNFTs:
    'https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever',
  getNFTByMintAddress:
    'https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever',
  getTransactions:
    'https://us-central1-digitaleyes-prod.cloudfunctions.net/sales-history-v3?',
};

export const ALPHA_ART_URIS = {
  collections: 'https://apis.alpha.art/api/v1/collections?order=recent',
  collection: 'https://apis.alpha.art/api/v1/collection/',
  listedNFTs: 'https://apis.alpha.art/api/v1/collection',
  getTransactions: 'https://apis.alpha.art/api/v2/activity/collection/',
};
