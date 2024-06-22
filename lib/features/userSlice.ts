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
    getOneUser: builder.query({
      query: (userId) => `users/${userId}`,
    }),
    deleteUser: builder.mutation({
      // Assuming your API endpoint for deleting a user is like DELETE /users/{userId}

      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
    }),
    updatedUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'UPDATE',
      }),
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


export const { useUsersQuery, useGetOneUserQuery, useDeleteUserMutation ,useUpdatedUserMutation ,useAddUserMutation ,useBulkAddUsersMutation } = usersSlices;

