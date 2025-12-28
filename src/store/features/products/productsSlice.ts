// src/store/features/products/productsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/productService";
// src/types/Product.ts
export interface Product {
  id: string;
  name: string;
  sku?: string;
  unit: string;          // pcs, box, liter, etc.
  price: number;         // default selling price
  cost?: number;         // optional production cost
  active: boolean;
  createdAt: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

/* -------------------- THUNKS -------------------- */

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id" | "createdAt">
>("products/create", async (data, { rejectWithValue }) => {
  try {
    const id = await addProduct(data);
    return { id, ...data, createdAt: new Date().toISOString() };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const editProduct = createAsyncThunk<
  { id: string; data: Partial<Product> },
  { id: string; data: Partial<Product> }
>("products/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    await updateProduct(id, data);
    return { id, data };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const removeProduct = createAsyncThunk<string, string>(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- SLICE -------------------- */

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fulfilled
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
      })

      // pending
      .addMatcher(
        (a) => a.type.startsWith("products/") && a.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // rejected
      .addMatcher(
        (a) => a.type.startsWith("products/") && a.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload || "Product error";
        }
      );
  },
});

export default productsSlice.reducer;
