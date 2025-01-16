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
    organization: builder.query({
      query: (code) => `organizations/${code}`,
    }),
    addOrg: builder.mutation({
      query: (credentials) => ({
        url: "organizations",
        method: "POST",
        body: credentials,
      }),
    }),
    assignOrg: builder.mutation({
      query: (credentials) => ({
        url: "organizations/assign",
        method: "PATCH",
        body: credentials,
      }),
    }),
    updateOrg: builder.mutation({
      query: (credentials) => ({
        url: "organizations",
        method: "PATCH",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useOrganizationsQuery,
  useOrganizationQuery,
  useAddOrgMutation,
  useAssignOrgMutation,
  useUpdateOrgMutation,
} = orgsSlices;
