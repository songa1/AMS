import { configureStore } from "@reduxjs/toolkit";
import { authSlices } from "./features/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authSlices.reducerPath]: authSlices.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([authSlices.middleware]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
