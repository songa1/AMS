import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersSlices = createApi({
  reducerPath: "usersSlices",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    users: builder.query({
      query: (code) => `users`,
    }),
    addUser: builder.mutation({
      query: (credentials) => ({
        url: "users",
        method: "POST",
        body: credentials,
      }),
    }),
    bulkAddUsers: builder.mutation({
      query: (credentials) => ({
        url: "users/bulk",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useUsersQuery, useAddUserMutation, useBulkAddUsersMutation } =
  usersSlices;
