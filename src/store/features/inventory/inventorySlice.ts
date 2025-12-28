// src/store/features/inventory/inventorySlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
 
  collection,
  getDocs,
  increment,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../../firebase/config";

// ----------------------
// Types
// ----------------------
interface ProductInventory {
  availableQty: number;
  lastUpdated: Timestamp;
}

interface InventoryState {
  items: Record<string, ProductInventory>; // productId -> inventory
  loading: boolean;
  error: string | null;
}

interface AdjustInventoryPayload {
  productId: string;
  type: "PRODUCTION" | "DISPATCH" | "RETURN" | "MELT";
  quantity: number;
  referenceId?: string;
  note?: string;
}

// ----------------------
// Initial State
// ----------------------
const initialState: InventoryState = {
  items: {},
  loading: false,
  error: null,
};

// Firestore references
const inventoryCollection = collection(db, "inventory");
const movementsRef = collection(db, "inventory_movements");

// ----------------------
// Async Thunks
// ----------------------

// Fetch all product inventories
export const fetchInventory = createAsyncThunk(
  "inventory/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(inventoryCollection);
      const items: Record<string, ProductInventory> = {};
      snapshot.forEach((doc) => {
        items[doc.id] = doc.data() as ProductInventory;
      });
      return items;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Adjust inventory for a specific product
export const adjustInventoryAction = createAsyncThunk<
  { productId: string; type: string; quantity: number },
  AdjustInventoryPayload
>(
  "inventory/adjust",
  async ({ productId, type, quantity, referenceId, note }, { rejectWithValue }) => {
    try {
      const productDoc = doc(db, "inventory", productId);

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(productDoc);

        if (!snap.exists()) {
          transaction.set(productDoc, { availableQty: 0, lastUpdated: Timestamp.now() });
        }

        const delta = type === "PRODUCTION" || type === "RETURN" ? quantity : -quantity;

        transaction.update(productDoc, {
          availableQty: increment(delta),
          lastUpdated: Timestamp.now(),
        });

        transaction.set(doc(movementsRef), {
          productId,
          type,
          quantity,
          delta,
          referenceId: referenceId || null,
          note: note || "",
          date: Timestamp.now(),
        });
      });

      return { productId, type, quantity };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch inventory
    builder.addCase(fetchInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInventory.fulfilled, (state, action: PayloadAction<Record<string, ProductInventory>>) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Adjust inventory
    builder.addCase(adjustInventoryAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      adjustInventoryAction.fulfilled,
      (state, action: PayloadAction<{ productId: string; type: string; quantity: number }>) => {
        state.loading = false;

        const { productId, type, quantity } = action.payload;
        const delta = type === "PRODUCTION" || type === "RETURN" ? quantity : -quantity;

        if (!state.items[productId]) {
          state.items[productId] = { availableQty: 0, lastUpdated: Timestamp.now() };
        }
        state.items[productId].availableQty += delta;
        state.items[productId].lastUpdated = Timestamp.now();
      }
    );
    builder.addCase(adjustInventoryAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default inventorySlice.reducer;
