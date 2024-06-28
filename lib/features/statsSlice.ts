import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statSlice = createApi({
  reducerPath: "statSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    stats: builder.query({
      query: () => `stats`,
    }),
  }),
});

export const { useStatsQuery } = statSlice;
