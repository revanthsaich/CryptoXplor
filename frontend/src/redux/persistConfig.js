import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['coinGecko'], // Only persist the coinGecko slice
};

export default persistConfig;
