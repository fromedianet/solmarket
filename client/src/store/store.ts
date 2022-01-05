import { configureStore } from "@reduxjs/toolkit";
import chainReducer from "../services/chain/chainSlice";
import walletReducer from "../services/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    chain: chainReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
