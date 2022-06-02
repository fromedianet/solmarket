export const DBConfig = {
  name: 'MyDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'cache',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'cacheKey', keypath: 'cacheKey', options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
      ],
    },
  ],
};
