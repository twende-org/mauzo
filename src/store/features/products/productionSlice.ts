// src/store/features/production/productionSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";

// ----------------------
// Types
// ----------------------
export interface ProductionBatch {
  id: string;
  date: string;
  totalProduced: number;
  totalCost: number;
}

interface ProductionState {
  batches: ProductionBatch[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  batches: [],
  loading: false,
  error: null,
};

// ----------------------
// Firestore references
// ----------------------
const productionRef = collection(db, "production_batches");

// ----------------------
// Async Thunks
// ----------------------

// Fetch all production batches
export const fetchProduction = createAsyncThunk<ProductionBatch[]>(
  "production/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(productionRef);
      const data: ProductionBatch[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ProductionBatch, "id">),
        date: (doc.data() as any).date?.toDate
          ? (doc.data() as any).date.toDate().toISOString()
          : new Date().toISOString(),
      }));
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add a new production batch
export const createProduction = createAsyncThunk<
  ProductionBatch,
  { totalProduced: number; totalCost: number }
>(
  "production/create",
  async (data, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(productionRef, {
        ...data,
        date: Timestamp.now(),
      });
      return {
        id: docRef.id,
        ...data,
        date: new Date().toISOString(),
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {},
  extraReducers: (builder) => {


    // Fulfilled
    builder.addCase(fetchProduction.fulfilled, (state, action: PayloadAction<ProductionBatch[]>) => {
      state.loading = false;
      state.batches = action.payload;
    });

    builder.addCase(createProduction.fulfilled, (state, action: PayloadAction<ProductionBatch>) => {
      state.loading = false;
      state.batches.push(action.payload);
    })
    
        // Pending
    builder.addMatcher(
      (action) => action.type.startsWith("production/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // Rejected
    builder.addMatcher(
      (action) => action.type.startsWith("production/") && action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      }
    );
    ;
  },
});

export default productionSlice.reducer;
