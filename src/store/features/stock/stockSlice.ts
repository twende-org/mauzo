// src/store/features/stock/stockSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { addStockItem, getStockItems, updateStockItem, deleteStockItem } from "../../../services/stockService";

interface StockItem {
  date: any;
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StockState {
  stock: StockItem[];
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  stock: [],
  loading: false,
  error: null,
};

// Async thunks

export const fetchStock = createAsyncThunk<StockItem[], void>("stock/fetch", async () => {
  const items = await getStockItems();
  return items as StockItem[];
});

export const createStockItem = createAsyncThunk<StockItem, { name: string; quantity: number; lowStockThreshold?: number }>(
  "stock/create",
  async (item) => {
    const id = await addStockItem(item);
    return { id, ...item, date: new Date(), createdAt: new Date(), updatedAt: new Date() };
  }
);

export const editStockItem = createAsyncThunk(
  "stock/update",
  async ({ id, data }: { id: string; data: Partial<StockItem> }) => {
    await updateStockItem(id, data);
    return { id, data };
  }
);

export const removeStockItem = createAsyncThunk("stock/delete", async (id: string) => {
  await deleteStockItem(id);
  return id;
});

// Slice

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStock.fulfilled, (state, action: PayloadAction<StockItem[]>) => {
      state.loading = false;
      state.stock = action.payload;
    });
    builder.addCase(fetchStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch stock items";
    });

    // Create
    builder.addCase(createStockItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createStockItem.fulfilled, (state, action: PayloadAction<StockItem>) => {
      state.loading = false;
      state.stock.push(action.payload);
    });
    builder.addCase(createStockItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create stock item";
    });

    // Update
    builder.addCase(editStockItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editStockItem.fulfilled, (state, action: PayloadAction<{ id: string; data: Partial<StockItem> }>) => {
      state.loading = false;
      const index = state.stock.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.stock[index] = { ...state.stock[index], ...action.payload.data };
    });
    builder.addCase(editStockItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update stock item";
    });

    // Delete
    builder.addCase(removeStockItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeStockItem.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.stock = state.stock.filter((s) => s.id !== action.payload);
    });
    builder.addCase(removeStockItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete stock item";
    });
  },
});

export default stockSlice.reducer;
