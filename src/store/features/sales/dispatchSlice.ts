import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDispatch, getDispatches, closeDispatch } from "../../../services/dispatchService";
import { adjustInventoryAction } from "../inventory/inventorySlice"; // import your inventory thunk
import type { AppDispatch } from "../../index";

export interface DispatchRecord {
  productId: string;
  productName: string;
  id: string;
  sellerId: string;
  givenQty: number;
  meltedQty: number;
  returnedQty: number;
  soldQty: number;
  pricePerUnit: number;
  cashCollected: number;
  status: "open" | "closed";
  date: string;
  unit: string;
}

interface DispatchState {
  records: DispatchRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: DispatchState = {
  records: [],
  loading: false,
  error: null,
};

// Fetch all dispatches
export const fetchDispatches = createAsyncThunk<
  DispatchRecord[],
  void,
  { rejectValue: string }
>("dispatch/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getDispatches();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Create a new dispatch
export const createDispatch = createAsyncThunk<
  DispatchRecord,
  { productId: string; productName: string; sellerId: string; givenQty: number; pricePerUnit: number; unit: string },
  { rejectValue: string }
>("dispatch/create", async (data, { rejectWithValue }) => {
  try {
    const id = await addDispatch(data);
    return {
      id,
      ...data,
      meltedQty: 0,
      returnedQty: 0,
      soldQty: 0,
      cashCollected: 0,
      status: "open",
      date: new Date().toISOString(),
    };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Close a dispatch and update inventory
export const closeDispatchRecord = createAsyncThunk<
  { id: string; meltedQty: number; returnedQty: number; soldQty: number; cashCollected: number },
  { id: string; meltedQty: number; returnedQty: number; productId: string },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "dispatch/close",
  async ({ id, meltedQty, returnedQty, productId }, { rejectWithValue, dispatch }) => {
    try {
      // Close the dispatch in Firestore
      await closeDispatch(id, { meltedQty, returnedQty });

      // Fetch updated dispatch to get soldQty & cashCollected
      const updatedDispatch = (await getDispatches()).find((d) => d.id === id);
      if (!updatedDispatch) throw new Error("Dispatch not found after closing");

      const soldQty = updatedDispatch.soldQty;

      // Update inventory: subtract soldQty
      if (soldQty > 0) {
        await dispatch(
          adjustInventoryAction({
            productId,
            type: "DISPATCH",
            quantity: soldQty,
          })
        ).unwrap();
      }

      return {
        id,
        meltedQty,
        returnedQty,
        soldQty,
        cashCollected: updatedDispatch.cashCollected,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const dispatchSlice = createSlice({
  name: "dispatch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispatches.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(createDispatch.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(closeDispatchRecord.fulfilled, (state, action) => {
        state.loading = false;
        const r = state.records.find((d) => d.id === action.payload.id);
        if (!r || r.status === "closed") return;

        r.meltedQty = action.payload.meltedQty;
        r.returnedQty = action.payload.returnedQty;
        r.soldQty = action.payload.soldQty;
        r.cashCollected = action.payload.cashCollected;
        r.status = "closed";
      })
      .addMatcher(
        (action) => action.type.startsWith("dispatch/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("dispatch/") && action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default dispatchSlice.reducer;
