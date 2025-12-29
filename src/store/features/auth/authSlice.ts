import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { getUserByUid, type AppUser } from "../../../services/userService";

type LoginPayload = {
    email: string;
    password: string;
};

export interface AuthUser {
    uid: string;
    email: string | null;
    businessId?: string; // store businessId for routing
    role?: AppUser["role"]; // store role for permissions
}

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

// Login user with Firebase Auth and fetch extra info from Firestore
export const loginUser = createAsyncThunk<AuthUser, LoginPayload>(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Fetch additional user info from Firestore
            const appUser = await getUserByUid(firebaseUser.uid);

            if (!appUser) {
                console.warn("Firestore user not found, logging in Auth-only user:", firebaseUser.uid);
                return {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                };
            }

            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                businessId: appUser.businessId,
                role: appUser.role,
            };
        } catch (error: any) {
            console.error("Login failed:", error); // log full error object
            return rejectWithValue(error.message || "Unknown login error");
        }
    }
);


export const logoutUser = createAsyncThunk<void>(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await auth.signOut();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
