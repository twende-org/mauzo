// src/store/features/dailySales/dailySalesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDailySales, addDailySale, updateDailySale, deleteDailySale, type DailySaleRecord } from "../../../services/dailySalesService";

interface DailySalesState {
  dailySales: DailySaleRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: DailySalesState = {
  dailySales: [],
  loading: false,
  error: null,
};

// Fetch all sales
export const fetchDailySales = createAsyncThunk<DailySaleRecord[]>(
  "dailySales/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getDailySales();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Create a sale
export const createDailySale = createAsyncThunk<DailySaleRecord, Omit<DailySaleRecord, "id">>(
  "dailySales/create",
  async (sale, { rejectWithValue }) => {
    try {
      const id = await addDailySale(sale);
      return { id, ...sale };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Update a sale
export const editDailySale = createAsyncThunk(
  "dailySales/update",
  async ({ id, data }: { id: string; data: Partial<DailySaleRecord> }, { rejectWithValue }) => {
    try {
      await updateDailySale(id, data);
      return { id, data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a sale
export const removeDailySale = createAsyncThunk(
  "dailySales/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDailySale(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const dailySalesSlice = createSlice({
  name: "dailySales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Pending

    // Fulfilled
    builder.addCase(fetchDailySales.fulfilled, (state, action) => {
      state.loading = false;
      state.dailySales = action.payload;
    });
    builder.addCase(createDailySale.fulfilled, (state, action) => {
      state.loading = false;
      state.dailySales.push(action.payload);
    });
    builder.addCase(editDailySale.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.dailySales.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.dailySales[index] = { ...state.dailySales[index], ...action.payload.data };
    });
    builder.addCase(removeDailySale.fulfilled, (state, action) => {
      state.loading = false;
      state.dailySales = state.dailySales.filter(s => s.id !== action.payload);
    })
    
        builder.addMatcher(
      (a) => a.type.startsWith("dailySales/") && a.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    // Rejected
    builder.addMatcher(
      (a) => a.type.startsWith("dailySales/") && a.type.endsWith("/rejected"),
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Daily Sales Error";
      }
    );
    ;
  },
});

export default dailySalesSlice.reducer;
