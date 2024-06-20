import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const otherSlices = createApi({
  reducerPath: "otherSlices",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    gender: builder.query({
      query: (code) => `data/genders`,
    }),
    districts: builder.query({
      query: (code) => `data/districts`,
    }),
    cohorts: builder.query({
      query: (code) => `data/cohorts`,
    }),
    sectorsByDistrict: builder.query({
      query: (districtName) => `data/district/sector/${districtName}`,
    }),
  }),
});

export const { useGenderQuery, useDistrictsQuery, useSectorsByDistrictQuery, useCohortsQuery } =
  otherSlices;
