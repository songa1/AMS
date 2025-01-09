import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orgsSlices = createApi({
  reducerPath: "orgsSlices",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    organizations: builder.query({
      query: (code) => `organizations`,
    }),
  }),
});

export const { useOrganizationsQuery } = orgsSlices;
