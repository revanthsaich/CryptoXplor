import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "https://api.coingecko.com/api/v3/coins/markets";
const VS_CURRENCY = "usd";

// Async thunk to fetch coins by type
import { getCachedData, setCachedData } from '../utils/cache';
import { canMakeCall, recordCall } from '../utils/rateLimiter';

export const fetchCoins = createAsyncThunk(
  "coinGecko/fetchCoins",
  async (type) => {
    // Check cache first
    const cacheKey = `coins_${type}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return { type, data: cachedData };
    }

    // Check rate limit
    if (!canMakeCall()) {
      throw new Error("Rate limit exceeded. Please wait a minute before making another request.");
    }

    let url = "";

    if (type === "topGainers") {
      url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=price_change_percentage_24h_desc&per_page=8&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    } else if (type === "trending") {
      url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=market_cap_desc&per_page=8&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    } else if (type === "newCoins") {
      url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=market_cap_asc&per_page=8&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch coins");
      const data = await response.json();
      
      // Cache the data
      setCachedData(cacheKey, data);
      
      // Record the API call
      recordCall();
      
      return { type, data };
    } catch (error) {
      // If there's an error, try to return cached data if available
      const fallbackData = getCachedData(cacheKey);
      if (fallbackData) {
        return { type, data: fallbackData };
      }
      throw error;
    }
  }
);

const coinGeckoSlice = createSlice({
  name: "coinGecko",
  initialState: {
    topGainers: null,
    trending: null,
    newCoins: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state[action.payload.type] = action.payload.data;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default coinGeckoSlice.reducer;
