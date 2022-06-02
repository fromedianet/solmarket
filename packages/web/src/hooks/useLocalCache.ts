import { useIndexedDB } from 'react-indexed-db';

const expiry = 20 * 60 * 1000; // 20 minutes

export const useLocalCache = () => {
  const db = useIndexedDB('cache');

  async function setItem(cacheKey: string, data: string): Promise<boolean> {
    try {
      await db.add({
        cacheKey: cacheKey,
        data: data,
        createdAt: Date.now(),
      });
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async function getItem(cacheKey: string): Promise<any> {
    try {
      const item = await db.getByIndex('cacheKey', cacheKey);
      if (typeof item !== 'undefined') {
        const age = Date.now() - item.createdAt;
        if (age > expiry) {
          await removeItem(item.id);
          return null;
        } else {
          return item;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async function removeItem(id: string): Promise<boolean> {
    try {
      await db.deleteRecord(id);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async function clearAll(): Promise<boolean> {
    try {
      await db.clear();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  return {
    setItem,
    getItem,
    removeItem,
    clearAll,
  };
};
