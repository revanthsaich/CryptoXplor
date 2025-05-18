import { configureStore } from "@reduxjs/toolkit";
import coinGeckoReducer from "../utils/coinGeckoSlice";

export const store = configureStore({
  reducer: {
    coinGecko: coinGeckoReducer,
  },
});
