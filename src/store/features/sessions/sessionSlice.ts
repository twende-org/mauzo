import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { getUserByUid } from "../../../services/userService";
import { getBusinessById } from "../../../services/businessService";

export const listenToAuth = createAsyncThunk(
  "session/listenToAuth",
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(clearSession());
        return;
      }

      const appUser = await getUserByUid(firebaseUser.uid);
      if (!appUser) return;

      const business = await getBusinessById(appUser.businessId!);

      dispatch(setSession({ user: appUser, business }));
    });
  }
);

interface SessionState {
  user: any | null;
  business: any | null;
  loading: boolean;
}

const initialState: SessionState = {
  user: null,
  business: null,
  loading: true,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession(state, action) {
      state.user = action.payload.user;
      state.business = action.payload.business;
      state.loading = false;
    },
    clearSession(state) {
      state.user = null;
      state.business = null;
      state.loading = false;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
