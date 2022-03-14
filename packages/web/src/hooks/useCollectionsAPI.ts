import { APIS } from '../constants';

export const useCollectionsAPI = () => {
  const createCollection = async (id: string, email: string) => {
    const url = APIS.base_url + APIS.collectionCreate;
    const params = {
      _id: id,
      email: email,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    return res.json();
  };

  const getCollectionsByEmail = async (email: string) => {
    const url = APIS.base_url + APIS.collections;
    const params = { email: email };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    return res.json();
  };

  const getCollectionById = async (id: string) => {
    const url = APIS.base_url + APIS.collections + '/' + id;
    const res = await fetch(url);
    return res.json();
  };

  return { createCollection, getCollectionsByEmail, getCollectionById };
};
