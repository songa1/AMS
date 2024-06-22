import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatSlices = createApi({
  reducerPath: "chatSlices",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    chats: builder.query({
      query: () => `chat`,
    }),
    addMessage: builder.mutation({
      query: (credentials) => ({
        url: "chat",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useAddMessageMutation, useChatsQuery } = chatSlices;
