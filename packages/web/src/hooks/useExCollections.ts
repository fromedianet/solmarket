import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { ExAttribute, ExAttrValue, ExCollection, ExCollectionStats } from '../models/exCollection';
import { ALPHA_ART_URIS, COLLECTIONS_URI, DIGITAL_EYES_URIS, MAGIC_EDEN_URIS, SOLANART_URIS } from '../views/inventory/constants';

export const useExCollections = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<ExCollection[]>([]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      // Get collections in selected marketplace.
      const uri = COLLECTIONS_URI[id];
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const result = parseCollections(id, data);
          setCollections(result);
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

  useEffect(() => {
    if (market === 'magiceden') {
      /**
       * Get collection in magiceden
       * 
       * Sample
       * Request URL: https://api-mainnet.magiceden.io/collections/_a_beer_for_you_?edge_cache=true
       */
      const collectionUri = `${MAGIC_EDEN_URIS.collection}${symbol}`;
      fetch(collectionUri)
        .then(res => res.json())
        .then(data => {
          const result = parseCollection(market, data);
          if (result) {
            setCollection(result);
          }
        });
      
      /**
       * Get collection attributes and stats in Magic Eden
       * 
       * Sample
       * Request URL: https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/_a_beer_for_you_?edge_cache=true
       */
      const statsUri = `${MAGIC_EDEN_URIS.collectionStats}${symbol}`;
      fetch(statsUri)
        .then(res => res.json())
        .then(data => {
          const result = parseMagicEdenAttributes(data['results']['availableAttributes']);
          setAttributes(result);
          const stats = parseMagicEdenCollectionStats(data['results']);
          if (stats) {
            setCollectionStats(stats);
          }
        });
    } else if (market === 'solanart') {
      /**
       * Get collection by filtering the collections by symbol
       * 
       * Request URL: https://api.solanart.io/get_collections
       */
      const collectionUri = SOLANART_URIS.collections;
      fetch(collectionUri)
        .then(res => res.json())
        .then(data => {
          const filters = data.filter(item => item.url === symbol);
          if (filters.length > 0) {
            const res = filters[0];
            const result = parseSolanartCollection(res, market);
            if (result) {
              setCollection(result);
            }
          }
        })
      /**
       * Get collection attributes in Solanart
       * 
       * Sample
       * Request URL: https://api.solanart.io/get_attributes_floor_price?collection=deadlyskulls
       */
      const attrUri = `${SOLANART_URIS.attributes}${symbol}`;
      fetch(attrUri)
        .then(res => res.json())
        .then(data => {
          const attrs = parseSolanartAttributes(data);
          setAttributes(attrs);
        });

      /**
       * Get collection stats in Solanart
       * 
       * Sample
       * Request URL: https://api.solanart.io/get_floor_price?collection=deadlyskulls
       */
      const collectionStatsUri = `${SOLANART_URIS.collectionStats}${symbol}`;
      fetch(collectionStatsUri)
        .then(res => res.json())
        .then(data => {
          const stats = parseSolanartCollectionStats(data);
          if (stats) {
            setCollectionStats(prev => ({
              ...prev,
              floorPrice: stats?.floorPrice,
              listedCount: stats?.listedCount
            }));
          }
        });

      /**
       * Get collection volume
       * 
       * Sample
       * Request URL: https://api.solanart.io/volume_only_collection?collection=deadlyskulls
       */
      const volumeUri = `${SOLANART_URIS.volumeOnlyCollection}${symbol}`;
      fetch(volumeUri)
        .then(res => res.json())
        .then(data => {
          if (data['totalVolume']) {
            setCollectionStats(prev => ({
              ...prev,
              volume: data['totalVolume'],
            }));
          }
        });
    } else if (market === 'digital_eyes') {
      /**
       * Get collection, attributes and stats in DigitalEyes
       * 
       * Sample
       * Request URL: https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever?collection=HexaHero
       */
      const collectionUri = `${DIGITAL_EYES_URIS.collection}${symbol}`;
      console.log(collectionUri);
      fetch(collectionUri)
        .then(res => res.json())
        .then(data => {
          // Get collection
          const result = parseCollection(market, data);
          if (result) {
            setCollection(result);
          }

          // Get attributes
          if (data['filters']) {
            const attrs = parseDigitalEyesAttributes(data['filters']);
            setAttributes(attrs);
          }

          // Get stats total volume
          if (data['volumeTotal']) {
            setCollectionStats(prev => ({
              ...prev,
              volume: data['volumeTotal'] / LAMPORTS_PER_SOL
            }));
          }
        });

    } else if (market === 'alpha_art') {
      /**
       * Get collection, attributes, and stats in AlphaArt
       * 
       * Sample
       * Request URL: https://apis.alpha.art/api/v1/collection/santaminers
       */
      const collectionUri = `${ALPHA_ART_URIS.collection}${symbol}`;
      console.log(collectionUri)
      fetch(collectionUri)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          // Get collection
          const result = parseCollection(market, data['collection']);
          if (result) {
            setCollection(result);
          }

          // Get attributes
          if (data['traits']) {
            const attrs = parseAlphaArtAttributes(data['traits']);
            setAttributes(attrs);
          }

          // Get stats
          const stats = parseAlphaArtCollectionStats(data);
          if (stats) {
            setCollectionStats(stats);
          }
        });
    }
    
  }, [symbol]);

  return { collection, attributes, collectionStats };
}

function parseCollections(id: string, data: any) {
  const result: ExCollection[] = [];
  try {
    if (id === 'magiceden') {
      data['collections'].forEach(item => {
        const val = parseMagicEdenCollection(item, id);
        if (val) {
          result.push(val);
        }
      });
    } else if (id === 'solanart') {
      data.forEach(item => {
        const val = parseSolanartCollection(item, id);
        if (val) {
          result.push(val);
        }
      });
    } else if (id === 'alpha_art') {
      data['collections'].forEach(item => {
        const val = parseAlphaArtCollection(item, id);
        if (val) {
          result.push(val);
        }
      });
    } else if (id === 'digital_eyes') {
      data.forEach(item => {
        const val = parseDigitalEyesCollection(item, id);
        if (val) {
          result.push(val);
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseCollection(market: string, data: any) {
  let collection: ExCollection | null = null;
  try {
    if (market === 'magiceden') {
      collection = parseMagicEdenCollection(data, market);
    } else if (market === 'alpha_art') {
      collection = parseAlphaArtCollection(data, market);
    } else if (market === 'digital_eyes') {
      collection = parseDigitalEyesCollection(data, market);
    }
  } catch (e) {
    console.error('parseCollection', e);
    collection = null;
  }
  return collection;
}

function parseMagicEdenCollection(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['name'],
      description: data['description'],
      symbol: data['symbol'],
      thumbnail: data['image'],
      discord: data['discord'],
      twitter: data['twitter'],
      website: data['website'],
      createdAt: data['createdAt'],
      market: market,
    };
    return item;
  } catch (e) {
    console.error('Parse Magic Eden data error: ', e);
    return null;
  }
}

function parseSolanartCollection(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['name'],
      description: data['description'],
      symbol: data['url'],
      banner: data['img'],
      thumbnail: data['imgpreview'],
      discord: data['discord'],
      twitter: data['twitter'],
      website: data['website'],
      createdAt: data['date'],
      market: market,
    };
    return item;
  } catch (e) {
    console.error('Parse Magic Eden data error: ', e);
    return null;
  }
}

function parseAlphaArtCollection(data: any, market: string) {
  try {
    let discord = undefined;
    let twitter = undefined;
    let website = undefined;
    if (data['links'] && data["links"].length > 0) {
      data["links"].forEach(val => {
        if (val.includes("twitter")) {
          twitter = val;
        } else if (val.includes("discord")) {
          discord = val;
        } else {
          website = val;
        }
      });
    }
    const item: ExCollection = {
      name: data['title'],
      description: '',
      symbol: data['slug'],
      banner: data['banner'],
      thumbnail: data['thumbnail'],
      discord: discord,
      twitter: twitter,
      website: website,
      createdAt: data['addedAt'],
      market: market,
    };
    return item;
  } catch (e) {
    console.error('Parse Magic Eden data error: ', e);
    return null;
  }
}

function parseDigitalEyesCollection(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['name'],
      description: data['description'],
      symbol: data['name'],
      banner: data['bannerUrl'],
      thumbnail: data['thumbnail'],
      discord: data['discord'],
      twitter: data['twitter'],
      website: data['website'],
      createdAt: data['createdAt'],
      market: market,
    };
    return item;
  } catch (e) {
    console.error('Parse Magic Eden data error: ', e);
    return null;
  }
}

function parseMagicEdenAttributes(data: any) {
  const attrs: ExAttribute[] = [];
  try {
    let prevKey = '';
    let attr: ExAttribute = {
      key: '',
      numbers: [],
    };
    data.forEach((item, index) => {
      const val: ExAttrValue = {
        value: item['attribute']['value'].toString(),
        amount: item['count'] && parseInt(item['count'].toString()),
        floor: item['floor'] && parseInt(item['floor'].toString()) / LAMPORTS_PER_SOL,
      };

      if (prevKey !== item['attribute']['trait_type'].toString()) {
        if (index > 0) {
          attrs.push(attr);
        }
        attr = {
          key: item['attribute']['trait_type'].toString(),
          numbers: [val],
        };
        prevKey = item['attribute']['trait_type'].toString();
      } else {
        attr.numbers.push(val);
      }

      if (index === data.length - 1) {
        attrs.push(attr);
      }
    })
  } catch (e) {
    console.error(e);
  }
  return attrs;
}

function parseSolanartAttributes(data: any) {
  const attrs: ExAttribute[] = [];
  try {
    const dict = {};
    data.forEach(item => {
      if (item['countListed'] > 0) {
        const attr: string[] = item['attributes'].toString().split(': ');
        const val: ExAttrValue = {
          value: attr[1].trim(),
          amount: item['contListed'],
          floor: item['floorPrice'] && item['floorPrice'],
        };
        const numbers = dict[attr[0]] || [];
        numbers.push(val);
        dict[attr[0]] = numbers;
      }
    });

    Object.keys(dict).forEach(key => {
      const attr: ExAttribute = {
        key: key,
        numbers: dict[key],
      };
      attrs.push(attr);
    })
  } catch (e) {
    console.error(e);
  }
  return attrs;
}

function parseDigitalEyesAttributes(data: any) {
  const attrs: ExAttribute[] = [];
  try {
    data.forEach(item => {
      const numbers: ExAttrValue[] = [];
      item["values"].forEach(sub => {
        const val: ExAttrValue = {
          value: sub.toString(),
        };
        numbers.push(val);
      });
      const attr: ExAttribute = {
        key: item['name'].toString(),
        numbers: numbers,
      };
      attrs.push(attr);
    })
  } catch (e) {
    console.error(e);
  }
  return attrs;
}

function parseAlphaArtAttributes(data: any) {
  const attrs: ExAttribute[] = [];
  try {
    data.forEach(item => {
      const numbers: ExAttrValue[] = [];
      item['numbers'].forEach(sub => {
        const val: ExAttrValue = {
          value: sub['value'].toString(),
          amount: sub['amount'] && parseInt(sub['amount'].toString()),
          floor: sub['floor'] && parseInt(sub['floor'].toString()) / LAMPORTS_PER_SOL,
        };
        numbers.push(val);
      });
      const attr: ExAttribute = {
        key: item['key'].toString(),
        numbers: numbers,
      };
      attrs.push(attr);
    })
  } catch (e) {
    console.error(e);
  }
  return attrs;
}

function parseMagicEdenCollectionStats(data: any) {
  try {
    const stats: ExCollectionStats = {
      floorPrice: data['floorPrice'] / LAMPORTS_PER_SOL,
      volume: data['volumeAll'] / LAMPORTS_PER_SOL,
      listedCount: data['listedCount'],
    };
    return stats;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

function parseSolanartCollectionStats(data: any) {
  try {
    const stats: ExCollectionStats = {
      floorPrice: data['floorPrice'],
      listedCount: data['count_listed']
    };
    return stats;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

function parseAlphaArtCollectionStats(data: any) {
  try {
    const volume = data['collection']['volume'] && parseInt(data['collection']['volume']) / LAMPORTS_PER_SOL;
    const floorPrice = data['floorPrice'] && parseInt(data['floorPrice']) / LAMPORTS_PER_SOL;
    const stats: ExCollectionStats = {
      floorPrice: floorPrice,
      volume: volume,
    };
    return stats;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
