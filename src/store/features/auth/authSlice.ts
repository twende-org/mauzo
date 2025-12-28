import { createSlice,createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../../firebase/config";

type LoginPayload={
    email:string;
    password:string;
};
// auth.types.ts (or inside the slice)
export interface AuthUser {
  uid: string;
  email: string | null;
}

interface AuthState{
    user:AuthUser|null;
    loading:boolean;
    error:string|null;
}
const initialState:AuthState={
    user:null,
    loading:false,
    error:null,
};

export const loginUser=createAsyncThunk<AuthUser,LoginPayload>(
    "auth/loginUser",
    async({email,password},{rejectWithValue})=>{
        try{
            const userCredential=await signInWithEmailAndPassword(auth,email,password);
             const user=userCredential.user;
            return {
                uid:user.uid,
                email:user.email,
            };
        }catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser=createAsyncThunk<void>(
    "auth/logoutUser",
    async(_, {rejectWithValue})=>{
        try{
            await auth.signOut();
        }catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);



const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginUser.fulfilled,(state,action:PayloadAction<AuthUser>)=>{
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        })
        .addCase(logoutUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        
        .addCase(logoutUser.fulfilled,(state)=>{
            state.user=null;
        })
        .addCase(logoutUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
    },
});
export const {logout}=authSlice.actions;
export default authSlice.reducer;