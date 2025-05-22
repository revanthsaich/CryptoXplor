import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import coinGeckoReducer from "../utils/coinGeckoSlice";
import persistConfig from "./persistConfig";

const persistedCoinGeckoReducer = persistReducer({
  ...persistConfig,
  whitelist: ['coinGecko'], // Only persist the coinGecko slice
  blacklist: ['loading'] // Don't persist loading state
}, coinGeckoReducer);

export const store = configureStore({
  reducer: {
    coinGecko: persistedCoinGeckoReducer,
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
