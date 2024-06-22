import { configureStore } from "@reduxjs/toolkit";
import { authSlices } from "./features/authSlice";
import { usersSlices } from "./features/userSlice";
import { otherSlices } from "./features/otherSlice";
import { chatSlices } from "./features/chatSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authSlices.reducerPath]: authSlices.reducer,
      [usersSlices.reducerPath]: usersSlices.reducer,
      [otherSlices.reducerPath]: otherSlices.reducer,
      [chatSlices.reducerPath]: chatSlices.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authSlices.middleware,
        usersSlices.middleware,
        otherSlices.middleware,
        chatSlices.middleware,
      ]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
