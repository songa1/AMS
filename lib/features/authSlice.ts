import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlices = createApi({
  reducerPath: "apiCountries",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.query({
      query: () => "auth/login",
    }),
    requestReset: builder.query({
      query: () => `auth/request-link`,
    }),
    resetPassword: builder.query({
      query: () => `auth/reset-password`,
    }),
  }),
});

export const { useLoginQuery, useRequestResetQuery, useResetPasswordQuery } =
  authSlices;
