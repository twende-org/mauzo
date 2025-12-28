// src/store/features/sellers/sellersSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { addSeller, getSellers, updateSeller, deleteSeller } from "../../../services/sellerService";

// ----------------------
// Types
// ----------------------
export interface Seller {
  id: string;
  name: string;
  phone: string;
  route: string;
  active: boolean;
  createdAt: string;
}

interface SellersState {
  sellers: Seller[];
  loading: boolean;
  error: string | null;
}

// ----------------------
// Initial State
// ----------------------
const initialState: SellersState = {
  sellers: [],
  loading: false,
  error: null,
};

// ----------------------
// Async Thunks
// ----------------------

// Fetch all sellers
export const fetchSellers = createAsyncThunk<Seller[]>(
  "sellers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellers();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Create a new seller
export const createSeller = createAsyncThunk<
  Seller,
  Omit<Seller, "id" | "createdAt">
>("sellers/create", async (seller, { rejectWithValue }) => {
  try {
    const id = await addSeller(seller);
    return { id, ...seller, createdAt: new Date().toISOString() };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Update an existing seller
export const editSeller = createAsyncThunk(
  "sellers/update",
  async (
    { id, data }: { id: string; data: Partial<Seller> },
    { rejectWithValue }
  ) => {
    try {
      await updateSeller(id, data);
      return { id, data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a seller
export const removeSeller = createAsyncThunk(
  "sellers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSeller(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
const sellersSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Pending matcher


    // Fulfilled cases
    builder.addCase(fetchSellers.fulfilled, (state, action: PayloadAction<Seller[]>) => {
      state.loading = false;
      state.sellers = action.payload;
    });

    builder.addCase(createSeller.fulfilled, (state, action: PayloadAction<Seller>) => {
      state.loading = false;
      state.sellers.push(action.payload);
    });

    builder.addCase(editSeller.fulfilled, (state, action: PayloadAction<{ id: string; data: Partial<Seller> }>) => {
      state.loading = false;
      const index = state.sellers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.sellers[index] = { ...state.sellers[index], ...action.payload.data };
    });

    builder.addCase(removeSeller.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.sellers = state.sellers.filter(s => s.id !== action.payload);
    });

        builder.addMatcher(
      (action) => action.type.startsWith("sellers/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // Rejected matcher
    builder.addMatcher(
      (action) => action.type.startsWith("sellers/") && action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export default sellersSlice.reducer;
