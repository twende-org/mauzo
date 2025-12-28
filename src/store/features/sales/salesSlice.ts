// src/store/features/sales/salesSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { addSale, getSales, getSalesBySeller } from "../../../services/salesService";

interface Sale {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  round: number;
  date: Date;
  createdAt: Date;
}

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

// Async thunks

export const fetchSales = createAsyncThunk<Sale[], void>("sales/fetch", async () => {
  const sales = await getSales();
  return sales as Sale[];
});

export const fetchSalesBySeller = createAsyncThunk<Sale[], string>(
  "sales/fetchBySeller",
  async (sellerId: string) => {
    const sales = await getSalesBySeller(sellerId);
    return sales as Sale[];
  }
);

export const createSale = createAsyncThunk(
  "sales/create",
  async (sale: { sellerId: string; sellerName: string; amount: number; round: number }) => {
    const id = await addSale(sale);
    return { id, ...sale, date: new Date(), createdAt: new Date() };
  }
);

// Slice

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all sales
    builder.addCase(fetchSales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSales.fulfilled, (state, action: PayloadAction<Sale[]>) => {
      state.loading = false;
      state.sales = action.payload;
    });
    builder.addCase(fetchSales.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch sales";
    });

    // Fetch sales by seller
    builder.addCase(fetchSalesBySeller.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSalesBySeller.fulfilled, (state, action: PayloadAction<Sale[]>) => {
      state.loading = false;
      state.sales = action.payload;
    });
    builder.addCase(fetchSalesBySeller.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch sales";
    });

    // Create sale
    builder.addCase(createSale.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
      state.loading = false;
      state.sales.push(action.payload);
    });
    builder.addCase(createSale.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create sale";
    });
  },
});

export default salesSlice.reducer;
