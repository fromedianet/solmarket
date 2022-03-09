import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import {
  ExAttribute,
  ExAttrValue,
  ExCollection,
  ExCollectionStats,
  ExNFT,
  Transaction,
} from '../models/exCollection';
import {
  ALPHA_ART_URIS,
  COLLECTIONS_URI,
  DIGITAL_EYES_URIS,
  MAGIC_EDEN_URIS,
  SOLANART_URIS,
} from '../views/inventory/constants';
import {APIS} from '../constants';

const PER_PAGE = 20;

export const useExCollections = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<ExCollection[]>([]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      // Get collections in selected marketplace.
      
      const uri = APIS.base_url + APIS.collections + id;
      fetch(uri)
        .then(res => res.json())
        .then(result => {
          setCollections(result['data']);
          setLoading(false);
        });
    }
  }, [id]);

  return { loading, collections };
};

export const useExCollection = (symbol: string, market: string) => {
  const [collection, setCollection] = useState<ExCollection>();
  const [attributes, setAttributes] = useState<ExAttribute[]>([]);
  const [collectionStats, setCollectionStats] = useState<ExCollectionStats>({});
  const [nfts, setNFTs] = useState<ExNFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [cursor, setCursor] = useState();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const collectionUri = APIS.base_url + APIS.collections + market + '/' + symbol;
    fetch(collectionUri)
      .then(res => res.json())
      .then(result => {
        if (result['collection']) {
          setCollection(result['collection']);
        }
        if (result['attributes']) {
          setAttributes(result['attributes']);
        }
        if (result['stats']) {
          setCollectionStats(result['stats']);
        }
      });

    /**
     * Get NFTs
     */
    // getListedNFTsByCollection({
    //   market: market,
    //   symbol: symbol,
    //   sort: 1,
    // });

    /**
     * Get transactions
     */
    // getTransactions({
    //   market: market,
    //   symbol: symbol,
    //   sort: 1,
    // });
  }, [symbol]);

  const getListedNFTsByCollection = (param: QUERIES) => {
    if (loading) return;
    setLoading(true);
    const uri = APIS.base_url + APIS.listedNFTs;
    let params = {};
    if (param.market === 'magiceden') {
      params = getParamsForMagicEden(param);
    } else if (market === 'solanart') {
      params = getParamsForSolanart(param);
    } else if (market === 'digital_eyes') {
      params = getParamsForDigitalEyes(param);
    } else if (market === 'alpha_art') {
      params = getParamsForAlphaArt(param);
    }

    fetch(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(result => {
        setNFTs(result['data']);

        if (param.market === 'magiceden') {
          if (result['data'].length < PER_PAGE) {
            setSkip(0);
            setHasMore(false);
          } else {
            setSkip(prev => prev + PER_PAGE);
            setHasMore(true);
          }
        } else if (param.market === 'solanart') {
          if (result['skip']) {
            setSkip(result['skip']);
            setHasMore(true);
          } else {
            setSkip(0);
            setHasMore(false);
          }
        } else if (param.market === 'digital_eyes') {
          if (result['listedCount'] || result['floorPrice']) {
            setCollectionStats(prev => ({
              ...prev,
              listedCount: result['listedCount'] || 0,
              floorPrice: result['floorPrice'] || 0,
            }));
          }
          if (result['cursor']) {
            setCursor(result['cursor']);
            setHasMore(true);
          } else {
            setCursor(undefined);
            setHasMore(false);
          }
        } else if (param.market === 'alpha_art') {
          if (result['listedCount'] || result['floorPrice']) {
            setCollectionStats(prev => ({
              ...prev,
              listedCount: result['listedCount'] || 0,
              floorPrice: result['floorPrice'] || 0,
            }));
          }
        }
        
        setLoading(false);
      });
  };

  const getTransactions = (param: QUERIES) => {
    if (param.market === 'magiceden') {
      const query = {
        $match: { collection_symbol: param.symbol },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      const uri =
        MAGIC_EDEN_URIS.getTransactions + encodeURI(JSON.stringify(query));
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const txs = parseTransactionsForMagicEden(data);
          setTransactions(txs);
        });
    } else if (param.market === 'solanart') {
      const uri = SOLANART_URIS.getTransactions + param.symbol;
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const txs = parseTransactionsForSolanart(data);
          setTransactions(txs);
        });
    } else if (param.market === 'solanart' || param.market === 'digital_eyes') {
      const uri =
        DIGITAL_EYES_URIS.getTransactions +
        'collection=' +
        encodeURIComponent(param.symbol);
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const txs = parseTransactionsForDigitalEyes(data);
          setTransactions(txs);
        });
    } else if (param.market === 'alpha_art') {
      const query = `${param.symbol}?trading_types=1%2C2&no_foreign_listing=true`;
      const uri = ALPHA_ART_URIS.getTransactions + query;
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const txs = parseTransactionsForAlphaArt(data, param.symbol);
          setTransactions(txs);
        });
    }
  };

  return {
    collection,
    attributes,
    collectionStats,
    nfts,
    transactions,
    loading,
    getListedNFTsByCollection,
    skip,
    cursor,
    hasMore,
  };
};

export type QUERIES = {
  market: string;
  symbol: string;
  sort: number;
  searchKey?: string;
  attributes?: {};
  min?: number;
  max?: number;
  skip?: number;
  cursor?: number;
};

function getParamsForMagicEden(param: QUERIES) {
  const queries = {
    $skip: param.skip ? param.skip : 0,
    $limit: PER_PAGE,
  };
  const match = {};
  match['collectionSymbol'] = param.symbol;
  if (param.searchKey) {
    match['$text'] = {
      $search: param.searchKey,
    };
  }
  if (param.min || param.max) {
    const takerAmount = {};
    if (param.min) {
      takerAmount['$gte'] = param.min * 1000000000;
    }
    if (param.max) {
      takerAmount['$lte'] = param.max * 1000000000;
    }
    match['takerAmount'] = takerAmount;
  }

  if (param.attributes && Object.keys(param.attributes).length > 0) {
    const attrs: any[] = [];
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      const subAttrs = param.attributes[key].map(val => ({
        attributes: {
          $elemMatch: {
            trait_type: key,
            value: val,
          },
        },
      }));
      attrs.push({ $or: subAttrs });
    });

    match['$and'] = attrs;
  }

  queries['$match'] = match;

  const sortQuery = {};
  if (param.sort === 2) {
    sortQuery['takerAmount'] = 1;
  } else if (param.sort === 3) {
    sortQuery['takerAmount'] = -1;
  }
  sortQuery['createdAt'] = -1;

  queries['$sort'] = sortQuery;

  const queryStr = `?q=${encodeURIComponent(JSON.stringify(queries))}`;
  
  const result = {
    market: param.market,
    params: queryStr
  };

  return result;
}

function getParamsForSolanart(param: QUERIES) {
  let queries = '?collection=' + param.symbol;
  queries += '&listed=true&fits=any&bid=all';
  queries += '&page=' + (param.skip ? param.skip : 0);
  queries += '&limit=' + PER_PAGE;
  if (param.min) {
    queries += '&min=' + param.min;
  }
  if (param.max) {
    queries += '&max=' + param.max;
  }
  let order = 'recent';
  if (param.sort === 2) {
    order = 'price-ASC';
  } else if (param.sort === 3) {
    order = 'price-DESC';
  }
  queries += '&order=' + order;
  if (param.searchKey && param.searchKey.length > 0) {
    queries += '&search=' + param.searchKey;
  }
  if (param.attributes && Object.keys(param.attributes).length > 0) {
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      param.attributes[key].forEach(val => {
        queries += `&trait[]=${key}: ${val}`;
      });
    });
  }

  queries = queries.replaceAll(' ', '+');
  
  const result = {
    market: param.market,
    params: queries
  }

  return result;
}

function getParamsForDigitalEyes(param: QUERIES) {
  let queries = '?collection=' + param.symbol;
  if (param.sort === 1) {
    queries += '&addEpoch=desc';
  } else if (param.sort === 2) {
    queries += '&price=asc';
  } else if (param.sort === 3) {
    queries += '&price=desc';
  }
  if (param.attributes && Object.keys(param.attributes).length > 0) {
    Object.keys(param.attributes).forEach(key => {
      // @ts-ignore
      param.attributes[key].forEach(val => {
        queries += `&${key}=${val}`;
      });
    });
  }
  if (param.cursor) {
    queries += `&cursor=${param.cursor}`;
  }

  const result = {
    market: param.market,
    params: queries
  };

  return result;
}

function getParamsForAlphaArt(param: QUERIES) {
  const queries = {};
  queries['collectionId'] = param.symbol;
  queries['status'] = ['BUY_NOW'];
  if (param.sort === 2) {
    queries['orderBy'] = 'PRICE_LOW_TO_HIGH';
  } else if (param.sort === 3) {
    queries['orderBy'] = 'PRICE_HIGH_TO_LOW';
  } else {
    queries['orderBy'] = 'RECENTLY_LISTED';
  }

  if (param.attributes && Object.keys(param.attributes).length > 0) {
    queries['traits'] = Object.keys(param.attributes).map(key => ({
      key: key,
      // @ts-ignore
      values: param.attributes[key],
    }));
  } else {
    queries['traits'] = [];
  }

  const result = {
    market: param.market,
    params: queries
  }
  return result;
}

function parseMagicEdenNFTs(data: any) {
  let result: ExNFT[] = [];
  try {
    if (data['results']) {
      result = data['results'].map(item => ({
        mintAddress: item['mintAddress'],
        name: item['title'],
        image: item['img'],
        collection: item['collectionTitle'],
        price: item['price'],
      }));
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseSolanartNFTs(data: any, collection: string) {
  let result: ExNFT[] = [];
  try {
    if (data['items']) {
      result = data['items'].map(item => ({
        mintAddress: item['token_add'],
        name: item['name'],
        image: item['link_img'],
        collection: collection,
        price: item['price'],
      }));
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseDigitalEyesNFTs(data: any, collection: string) {
  let result: ExNFT[] = [];
  try {
    if (data['offers']) {
      result = data['offers'].map(item => ({
        mintAddress: item['mint'],
        pk: item['pk'],
        name: item['metadata']['name'],
        image: item['metadata']['image'],
        collection: item['metadata']['collection']
          ? item['metadata']['collection']['name']
          : collection,
        price: item['price'] / LAMPORTS_PER_SOL,
      }));
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseAlphaArtNFTs(data: any, collection: string) {
  let result: ExNFT[] = [];
  try {
    if (data['tokens']) {
      result = data['tokens'].map(item => ({
        mintAddress: item['mintId'],
        name: item['title'],
        image: item['image'],
        collection: collection,
        price: parseInt(item['price']) / LAMPORTS_PER_SOL,
      }));
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseTransactionsForMagicEden(data: any) {
  const result: Transaction[] = [];
  try {
    if (data['results']) {
      data['results'].forEach((item, index) => {
        let txType = '';
        let price;
        switch (item['txType']) {
          case 'initializeEscrow':
            txType = 'LISTING';
            price = item['parsedList']['amount'];
            break;
          case 'cancelEscrow':
            txType = 'CANCEL LISTING';
            break;
          case 'cancelBid':
            txType = 'CANCEL BID';
            break;
          case 'placeBid':
            txType = 'PLACE BID';
            price = item['parsedPlacebid']['amount'];
            break;
          case 'exchange':
            txType = 'SALE';
            price = item['parsedTransaction']['total_amount'];
            break;
        }
        const tx: Transaction = {
          key: index,
          blockTime: item['blockTime'],
          buyer: item['buyer_address'],
          seller: item['seller_address'],
          collection: item['collection_symbol'],
          mint: item['mint'],
          price: price,
          transaction: item['transaction_id'],
          txType: txType,
          name: item['mintObject']['title'],
          image: item['mintObject']['img'],
        };
        result.push(tx);
      });
      result.sort((a, b) => b.blockTime - a.blockTime);
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseTransactionsForSolanart(data: any) {
  const result: Transaction[] = [];
  try {
    data.forEach((item, index) => {
      const tx: Transaction = {
        key: index,
        collection: item['type'],
        blockTime: Date.parse(item['date']) / 1000,
        mint: item['token_add'],
        price: item['price'],
        name: item['name'],
        image: item['link_img'],
        transaction: '',
        txType: item['state'] === 1 ? 'OFFER' : 'SALE',
        buyer: item['buyerAdd'],
        seller: item['seller_address'],
      };
      result.push(tx);
    });
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseTransactionsForDigitalEyes(data: any) {
  const result: Transaction[] = [];
  try {
    if (data['sales_history']) {
      data['sales_history'].forEach((item, index) => {
        const tx: Transaction = {
          key: index,
          blockTime: item['epoch'],
          buyer: item['buyer'],
          seller: item['seller'],
          collection: item['collection'],
          mint: item['mint'],
          price: item['price'],
          transaction: item['transaction'],
          txType: item['type'],
          name: item['tags']['name'],
          image: item['tags']['image'],
        };
        result.push(tx);
      });
      result.sort((a, b) => b.blockTime - a.blockTime);
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseTransactionsForAlphaArt(data: any, collection: string) {
  const result: Transaction[] = [];
  try {
    data.forEach((item, index) => {
      const tx: Transaction = {
        key: index,
        collection: collection,
        blockTime: Date.parse(item['createdAt']) / 1000,
        mint: item['mintPubkey'],
        price: parseInt(item['price']),
        name: item['name'],
        image: item['image'],
        transaction: item['signature'],
        txType: item['tradingType'],
        buyer: null,
        seller: null,
      };
      result.push(tx);
    });
    result.sort((a, b) => b.blockTime - a.blockTime);
  } catch (e) {
    console.error(e);
  }
  return result;
}
