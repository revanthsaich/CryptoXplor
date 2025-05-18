import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "https://api.coingecko.com/api/v3/coins/markets";
const VS_CURRENCY = "usd";

// Async thunk to fetch coins by type
export const fetchCoins = createAsyncThunk(
  "coinGecko/fetchCoins",
  async (type) => {
    let url = "";

    if (type === "topGainers") {
      url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=price_change_percentage_24h_desc&per_page=8&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    } else if (type === "trending") {
      url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=market_cap_desc&per_page=8&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    } else if (type === "newCoins") {
      url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=market_cap_asc&per_page=8&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch coins");
    const data = await response.json();
    return { type, data };
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
