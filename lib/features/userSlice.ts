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
    change: builder.mutation({
      query: (userId) => ({
        url: `users/role/${userId}`,
        method: "POST",
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
    }),
    updatedUser: builder.mutation({
      query: (data) => ({
        url: `users/${data?.userId}`,
        method: "PUT",
        body: {
          user: data?.user,
          organizationFounded: data?.organizationFounded,
          organizationEmployed: data?.organizationEmployed,
        },
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
    uploadPicture: builder.mutation({
      query: (credentials) => ({
        url: "upload/image",
        method: "POST",
        body: credentials,
      }),
    }),
    importUsers: builder.mutation({
      query: (data) => ({
        url: "users/import",
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useUsersQuery,
  useGetOneUserQuery,
  useDeleteUserMutation,
  useUpdatedUserMutation,
  useAddUserMutation,
  useBulkAddUsersMutation,
  useUploadPictureMutation,
  useChangeMutation,
  useImportUsersMutation,
} = usersSlices;
