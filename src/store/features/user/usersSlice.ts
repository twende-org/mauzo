import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { addUser, getUsersByBusiness, updateUser, deleteUser, type AppUser, type UserRole } from "../../../services/userService";

/* =======================
   TYPES
======================= */

export interface User extends AppUser {}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

/* =======================
   THUNKS
======================= */

// Fetch users for a business
export const fetchUsers = createAsyncThunk<User[], string>(
  "users/fetch",
  async (businessId, { rejectWithValue }) => {
    try {
      return await getUsersByBusiness(businessId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add user (with email + Firebase Auth)
export const createUser = createAsyncThunk<User, {
  email: string;
  password: string;
  name: string;
  contact?: string;
  route?: string;
  businessId: string;
  role?: UserRole;
}>(
  "users/create",
  async (user, { rejectWithValue }) => {
    try {
      // 1️⃣ Create Auth user & Firestore document
      const id = await addUser(user);

      const createdAt = new Date().toISOString();

      // 2️⃣ Return User type for Redux state
      return {
        id,
        uid: "", // Firestore UID is stored
        email: user.email,
        name: user.name,
        contact: user.contact ?? "",
        route: user.route ?? "",
        businessId: user.businessId,
        role: user.role ?? "seller",
        totalSales: 0,
        active: true,
        createdAt,
      } as User;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


// Update user
export const editUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      await updateUser(id, data);
      return { id, data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete user
export const removeUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* =======================
   SLICE
======================= */

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fulfilled
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.users.push(action.payload);
    });
    builder.addCase(editUser.fulfilled, (state, action: PayloadAction<{ id: string; data: Partial<User> }>) => {
      state.loading = false;
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) state.users[index] = { ...state.users[index], ...action.payload.data };
    });
    builder.addCase(removeUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.users = state.users.filter(u => u.id !== action.payload);
    });

    // Pending matcher
    builder.addMatcher(
      (action) => action.type.startsWith("users/") && action.type.endsWith("/pending"),
      (state) => { state.loading = true; state.error = null; }
    );

    // Rejected matcher
    builder.addMatcher(
      (action) => action.type.startsWith("users/") && action.type.endsWith("/rejected"),
      (state, action: any) => { state.loading = false; state.error = action.payload; }
    );
  },
});

export default usersSlice.reducer;
