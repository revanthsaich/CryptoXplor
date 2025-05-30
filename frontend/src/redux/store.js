import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import coinGeckoReducer from "../utils/coinGeckoSlice";
import coinsReducer from "../redux/coinsSlice";
import createPersistConfig from "./persistConfig";

// Persist configuration for coinGecko
const coinGeckoPersistConfig = {
  ...createPersistConfig('coinGecko'),
  whitelist: ['topGainers', 'trending', 'newCoins'],
  blacklist: ['loading', 'error']
};
const persistedCoinGeckoReducer = persistReducer(coinGeckoPersistConfig, coinGeckoReducer);

// Persist configuration for coins
const coinsPersistConfig = {
  ...createPersistConfig('coins'),
  whitelist: ['coins'],
  blacklist: ['loading', 'error', 'page', 'hasMore']
};
const persistedCoinsReducer = persistReducer(coinsPersistConfig, coinsReducer);

export const store = configureStore({
  reducer: {
    coinGecko: persistedCoinGeckoReducer,
    coins: persistedCoinsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/REHYDRATE'],
        ignoredPaths: ['coinGecko']
      }
    }),
  devTools: true,
});

export const persistor = persistStore(store);
