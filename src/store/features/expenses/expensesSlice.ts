// src/store/features/expenses/expensesSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getExpenses, addExpense, updateExpense, deleteExpense, type ExpenseData, type ExpenseCategory } from "../../../services/expenseService";

// ----------------------
// Types
// ----------------------
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
   date: Date | any; // can be Date or Firestore Timestamp
  createdAt: any;   // Timestamp
  updatedAt?: any;  // optional Timestamp// ISO string
  productId?: string;
  dispatchId?: string;
}

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

// ----------------------
// Initial State
// ----------------------
const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
};

// ----------------------
// Async Thunks
// ----------------------

// Fetch all expenses
export const fetchExpenses = createAsyncThunk<Expense[]>(
  "expenses/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getExpenses();

      const toISO = (val: any): string => {
        if (!val) return new Date().toISOString();
        if (val instanceof Date) return val.toISOString();
        if (val.toDate) return val.toDate().toISOString(); // Firestore Timestamp
        return new Date(val).toISOString();
      };

      return res.map((e) => ({
        id: e.id,
        description: e.description,
        amount: e.amount,
        category: e.category,
        date: toISO(e.date),
        createdAt: toISO(e.createdAt),
        updatedAt: e.updatedAt ? toISO(e.updatedAt) : undefined,
        productId: e.productId,
        dispatchId: e.dispatchId,
      }));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


// Create a new expense
export const createExpense = createAsyncThunk<Expense, ExpenseData>(
  "expenses/create",
  async (expense, { rejectWithValue }) => {
    try {
      const id = await addExpense(expense);
      return {
        id,
        ...expense,
        date: expense.date.toString(),
        createdAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Update an expense
export const editExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, data }: { id: string; data: Partial<Expense> }, { rejectWithValue }) => {
    try {
      // Convert date back to Date for Firestore if it's string
      const payload: Partial<ExpenseData> = {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      };
      await updateExpense(id, payload);
      return { id, data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete an expense
export const removeExpense = createAsyncThunk(
  "expenses/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteExpense(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fulfilled
    builder.addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
      state.loading = false;
      state.expenses = action.payload;
    });

    builder.addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
      state.loading = false;
      state.expenses.push(action.payload);
    });

    builder.addCase(editExpense.fulfilled, (state, action: PayloadAction<{ id: string; data: Partial<Expense> }>) => {
      state.loading = false;
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.expenses[index] = { ...state.expenses[index], ...action.payload.data };
    });

    builder.addCase(removeExpense.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    });

    // Pending
    builder.addMatcher(
      (action) => action.type.startsWith("expenses/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // Rejected
    builder.addMatcher(
      (action) => action.type.startsWith("expenses/") && action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Expense error";
      }
    );
  },
});

export default expensesSlice.reducer;
