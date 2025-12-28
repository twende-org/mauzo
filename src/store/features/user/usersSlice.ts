// src/store/features/users/usersSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { addUser, getUsers, updateUser, deleteUser } from "../../../services/userService";

interface User {
  sales: any;
  id: string;
  name: string;
  contact: string;
  route: string;
  totalSales: number;
  createdAt: any;
}

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

// Async thunks

export const fetchUsers = createAsyncThunk<User[]>("users/fetch", async () => {
  const users = await getUsers();
  return users as User[];
});

export const createUser = createAsyncThunk<User, { name: string; contact: string; route: string }>(
  "users/create",
  async (user: { name: string; contact: string; route: string }) => {
    const id = await addUser(user);
    return { id, ...user, totalSales: 0, createdAt: new Date(), sales: [] };
  }
);

export const editUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: string; data: Partial<{ name: string; contact: string; route: string }> }) => {
    await updateUser(id, data);
    return { id, data };
  }
);

export const removeUser = createAsyncThunk("users/delete", async (id: string) => {
  await deleteUser(id);
  return id;
});

// Slice

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch users";
    });

    // Create user
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create user";
    });

    // Update user
    builder.addCase(editUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editUser.fulfilled, (state, action: PayloadAction<{ id: string; data: Partial<User> }>) => {
      state.loading = false;
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.users[index] = { ...state.users[index], ...action.payload.data };
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update user";
    });

    // Delete user
    builder.addCase(removeUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.users = state.users.filter((u) => u.id !== action.payload);
    });
    builder.addCase(removeUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete user";
    });
  },
});

export default usersSlice.reducer;
