import { useEffect, useState } from 'react';
import { ExCollection } from '../../../models/exCollection';
import { COLLECTIONS_URI } from '../constants';

export const useExCollection = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<ExCollection[]>([]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      const uri = COLLECTIONS_URI[id];
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const result = parseData(id, data);
          setCollections(result);
          setLoading(false);
        });
    }
  }, [id]);

  return { loading, collections };
};

function parseData(id: string, data: any) {
  const result: ExCollection[] = [];
  try {
    if (id === 'magiceden') {
      data['collections'].forEach(item => {
        const val = parseMagicEdenData(item, id);
        if (val) {
          result.push(val);
        }
      });
    } else if (id === 'solanart') {
      data.forEach(item => {
        const val = parseSolanartData(item, id);
        if (val) {
          result.push(val);
        }
      });
    } else if (id === 'alpha_art') {
      data['collections'].forEach(item => {
        const val = parseAlphaArtData(item, id);
        if (val) {
          result.push(val);
        }
      });
    } else if (id === 'digital_eyes') {
      data.forEach(item => {
        const val = parseDigitalEyesData(item, id);
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

function parseMagicEdenData(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['name'],
      description: data['description'],
      symbol: data['symbol'],
      image: data['image'],
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

function parseSolanartData(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['name'],
      description: data['description'],
      symbol: data['url'],
      image: data['img'],
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

function parseAlphaArtData(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['title'],
      description: '',
      symbol: data['slug'],
      image: data['banner'],
      thumbnail: data['thumbnail'],
      createdAt: data['addedAt'],
      market: market,
    };
    return item;
  } catch (e) {
    console.error('Parse Magic Eden data error: ', e);
    return null;
  }
}

function parseDigitalEyesData(data: any, market: string) {
  try {
    const item: ExCollection = {
      name: data['name'],
      description: data['description'],
      symbol: data['name'],
      image: data['thumbnail'],
      thumbnail: data['thumbnail'],
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
