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
    comms: builder.query({
      query: (id) => `stats/comms/${id}`,
    }),
  }),
});

export const { useStatsQuery, useCommsQuery } = statSlice;
