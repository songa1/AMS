import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationSlices = createApi({
  reducerPath: "notificationSlices",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    notifications: builder.query({
      query: (id) => `notification/${id}`,
    }),
    unopenedNotifications: builder.query({
      query: (id) => `notification/unopened/${id}`,
    }),
    notSetups: builder.query({
      query: () => `notification/update/setup`,
    }),
    notSetup: builder.query({
      query: (id) => ({ url: `notification/update/setup/one`, body: id }),
    }),
    openNotification: builder.mutation({
      query: (credentials) => ({
        url: "notification",
        method: "POST",
        body: credentials,
      }),
    }),
    updateSetup: builder.mutation({
      query: (data) => ({
        url: "notification/update/setup",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useNotificationsQuery,
  useOpenNotificationMutation,
  useUnopenedNotificationsQuery,
  useLazyNotificationsQuery,
  useNotSetupsQuery,
  useNotSetupQuery,
  useUpdateSetupMutation,
} = notificationSlices;
