import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from './api';

const VS_CURRENCY = "usd";
const PER_PAGE = 8;

export const fetchCoins = createAsyncThunk(
  "coinGecko/fetchCoins",
  async (type, { rejectWithValue }) => {
    try {
      const response = await api.get(`/market/coins/${type}`, {
        params: {
          vs_currency: VS_CURRENCY,
          per_page: PER_PAGE,
          page: 1
        }
      });
      
      return { type, data: response.data };
    } catch (error) {
      console.error(`Error fetching ${type} coins:`, error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch coins');
    }
  }
);

const initialState = {
  topGainers: null,
  trending: null,
  newCoins: null,
  loading: false,
  error: null,
};

const coinGeckoSlice = createSlice({
  name: "coinGecko",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
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
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = coinGeckoSlice.actions;

export default coinGeckoSlice.reducer;
