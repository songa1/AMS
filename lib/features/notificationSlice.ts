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
    openNotification: builder.mutation({
      query: (credentials) => ({
        url: "notification",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useNotificationsQuery,
  useOpenNotificationMutation,
  useUnopenedNotificationsQuery,
  useLazyNotificationsQuery,
} = notificationSlices;
