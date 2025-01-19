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
        url: `users`,
        method: "PATCH",
        body: {
          user: data?.user,
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
    createUserProfile: builder.mutation({
      query: (credentials) => ({
        url: "users/profile",
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
    updateProfilePicture: builder.mutation({
      query: (credentials) => ({
        url: "users/picture",
        method: "PATCH",
        body: credentials,
      }),
    }),
    importUsers: builder.mutation({
      query: (data) => ({
        url: "users/import",
        method: "POST",
        body: data,
      }),
    }),
    exportUsers: builder.mutation({
      query: () => ({
        url: "users/export",
        method: "POST",
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
  useUploadPictureMutation,
  useChangeMutation,
  useImportUsersMutation,
  useExportUsersMutation,
  useCreateUserProfileMutation,
  useUpdateProfilePictureMutation,
} = usersSlices;
