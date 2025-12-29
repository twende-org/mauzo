import { configureStore } from "@reduxjs/toolkit";
import authSlice  from "./features/auth/authSlice";
import expensesSlice from "./features/expenses/expensesSlice";
import salesSlice from "./features/sales/salesSlice";
import usersSlice from "./features/user/usersSlice";
import dispatchSlice from "./features/sales/dispatchSlice";
import dailySalesSlice from "./features/sales/dailySalesSlice";
import productionSlice from "./features/products/productionSlice";
import inventorySlice from "./features/inventory/inventorySlice";
import sellersSlice from "./features/sellers/sellersSlice";
import productsSlice from "./features/products/productsSlice";
import sessionReducer from "./features/sessions/sessionSlice";



export const store=configureStore({
    reducer:{
        auth:authSlice,
        expenses:expensesSlice,
        sales:salesSlice,
        users:usersSlice,
        dispatch:dispatchSlice,
        dailySales:dailySalesSlice,
        production:productionSlice,
        inventory:inventorySlice,
        sellers:sellersSlice,
        products:productsSlice,
        session:sessionReducer,
    },
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;