import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  coins: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (page, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://crypto-xplor.vercel.app/market/list-all/?page=${page}`);
      // const response = await fetch(`http://localhost:5000/market/list-all/?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coins');
    }
  }
);

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    resetCoins: (state) => {
      state.coins = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
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
        const newCoins = action.payload;
        
        // Filter out duplicates
        const existingIds = new Set(state.coins.map(coin => coin.id));
        const uniqueNewCoins = newCoins.filter(coin => !existingIds.has(coin.id));
        
        state.coins = [...state.coins, ...uniqueNewCoins];
        state.page += 1;
        state.hasMore = newCoins.length === 50; // Assuming 50 items per page
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch coins';
        state.hasMore = false;
      });
  },
});

export const { resetCoins } = coinsSlice.actions;

export default coinsSlice.reducer;
