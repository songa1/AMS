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
    countries: builder.query({
      query: (code) => `data/countries`,
    }),
    cohorts: builder.query({
      query: (code) => `data/cohorts`,
    }),
    sectorsByDistrict: builder.query({
      query: (districtName) => `data/district/sector/${districtName}`,
    }),
    workingSector: builder.query({
      query: () => `data/working-sectors`,
    }),
    tracks: builder.query({
      query: () => `data/tracks`,
    }),
    addCohort: builder.mutation({
      query: (data) => ({
        url: "data/cohort",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGenderQuery,
  useDistrictsQuery,
  useSectorsByDistrictQuery,
  useCohortsQuery,
  useWorkingSectorQuery,
  useTracksQuery,
  useCountriesQuery,
  useAddCohortMutation,
} = otherSlices;
