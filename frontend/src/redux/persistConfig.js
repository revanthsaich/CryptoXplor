import storage from 'redux-persist/lib/storage';

const createPersistConfig = (key) => ({
  key,
  storage,
  version: 1,
  // Add any default options here
});

export default createPersistConfig;
