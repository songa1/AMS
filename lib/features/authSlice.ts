import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlices = createApi({
  reducerPath: "apiCountries",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    requestReset: builder.mutation({
      query: (credentials) => ({
        url: "auth/request-link",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRequestResetMutation,
  useResetPasswordMutation,
} = authSlices;
