import { StringPublicKey, useLocalStorage, useMeta } from "@oyster/common";
import { useEffect, useState } from "react";

export const useAttributesByCollection = (pubkey: StringPublicKey) => {
  const { metadata } = useMeta();
  const list = metadata.filter(item => item.info.collection?.key === pubkey);
  const localStorage = useLocalStorage();
  const [attributes, setAttributes] = useState<Record<string, Record<string | number, number>>>({});

  useEffect(() => {
    fetchAll();
  }, [pubkey]);

  async function fetchAll() {
    const result: any[] = [];
    let prom = Promise.resolve();
    list.forEach((item, index) => {
      prom = prom.then(() => {
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
          const data = await fetchData(item.info.data.uri);
          result.push(data);
          if (index === list.length - 1) {
            prepareAttrubutes(result.map(val => val.attributes));
          }
          resolve("");
        })
      })
    });
    await prom;
  }

  async function fetchData(uri: string) {
    const cache = localStorage.getItem(uri);
    if (cache) {
      return JSON.parse(cache);
    } else {
      const result = await fetch(uri);
      try {
        const data = await result.json();
        try {
          localStorage.setItem(uri, JSON.stringify(data));
        } catch (e) {
          window.localStorage.clear();
        }
        return data;
      } catch (e) {
        return undefined;
      }
    }
  }

  function prepareAttrubutes(attrs: any[]) {
    const data: Record<string, Record<string | number, number>> = {};
    attrs.forEach(attr => {
      attr.forEach(sub => {
        const item = data[sub.trait_type] || [];
        const subVal = item[sub.value];
        if (isNaN(subVal)) {
          item[sub.value] = 1;
        } else {
          item[sub.value] += 1;
        }
        data[sub.trait_type] = item;
      });
    });

    setAttributes(data);
  }

  return attributes;
}