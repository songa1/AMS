"use client";

import {
  useCountriesQuery,
  useDistrictsQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  Country,
  organization,
  residentDistrict,
  residentSector,
  State,
  WorkingSector,
} from "@/types/user";
import { useOrganizationsQuery } from "@/lib/features/orgSlice";

function AddEmployedInfo({ canMove }: { canMove: any }) {
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState([]);
  const [countriesEmployed, setCountriesEmployed] = useState([]);
  const [sectorsEmployed, setSectorsEmployed] = useState([]);
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] = useState("");
  const [districtsEmployed, setDistrictsEmployed] = useState([]);
  const [newOrg, setNewOrg] = useState("");
  const [organizations, setOrganizations] = useState([]);

  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState([]);

  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: OrganizationsData } = useOrganizationsQuery("");
  const { data: EmployedStatesData } = useStatesByCountryQuery(
    employedCountry,
    {
      skip: !employedCountry,
    }
  );
  const { data: SectorsDataEmployed } = useSectorsByDistrictQuery(
    selectedDistrictEmployed,
    {
      skip: !selectedDistrictEmployed,
    }
  );
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectorsEmployed(WorkingSectorsData?.data);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (SectorsDataEmployed) {
      setSectorsEmployed(SectorsDataEmployed?.data);
    }
  }, [SectorsDataEmployed]);

  useEffect(() => {
    if (OrganizationsData) {
      setOrganizations(OrganizationsData?.data);
    }
  }, [OrganizationsData]);

  useEffect(() => {
    if (EmployedStatesData) {
      setEmployedStates(EmployedStatesData?.data);
    }
  }, [EmployedStatesData]);

  useEffect(() => {
    if (DistrictData) {
      setDistrictsEmployed(DistrictData?.data);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) {
      setCountriesEmployed(CountryData?.data);
    }
  }, [CountryData]);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companySector: "",
      companyPosition: "",
      companyWebsite: "",
      companyDistrictName: "",
      companySectorId: "",
      companyCountry: "",
      companyState: null,
    },
    validationSchema: Yup.object({
      companyName: Yup.string(),
      companySector: Yup.string(),
      companyPosition: Yup.string(),
      companyWebsite: Yup.string().url("Invalid website URL"),
      companyDistrictName: Yup.string(),
      companySectorId: Yup.string(),
      companyCountry: Yup.string(),
    }),
    onSubmit: async (values) => {
      // Being done in another function
    },
  });

  const handleSubmit = async () => {
    // const values: any = formik.values;
    // try {
    //   const res = await addUser({
    //     user: {
    //       firstName: values.firstName,
    //       middleName: values.middleName,
    //       lastName: values.lastName,
    //       email: values.email,
    //       linkedin: values?.linkedin,
    //       instagram: values?.instagram,
    //       twitter: values?.twitter,
    //       facebook: values?.facebook,
    //       bio: values?.bio,
    //       phoneNumber: values.phoneNumber,
    //       whatsappNumber: values.whatsAppNumber,
    //       genderName: values.gender.name,
    //       nearestLandmark: values.nearlestLandmark,
    //       cohortId: values?.cohortId?.id,
    //       trackId: values?.track?.id,
    //       residentDistrictId: values?.districtName.id,
    //       residentSectorId: values?.sectorId.id,
    //       state: values?.state?.id,
    //       residentCountryId: values?.residentCountryId.id,
    //       positionInFounded: values?.foundedPosition,
    //       positionInEmployed: values?.companyPosition,
    //       profileImageId: values?.profileImageId,
    //     },
    //     organizationFounded: {
    //       name: values?.initiativeName,
    //       workingSector: values?.mainSector?.id,
    //       countryId: values?.foundedCountry?.id,
    //       state: values?.foundedState?.id,
    //       districtId: values.foundedDistrictName.name,
    //       sectorId: values?.foundedSectorId.id,
    //       website: values?.foundedWebsite,
    //     },
    //     organizationEmployed: {
    //       name: values?.companyName,
    //       workingSector: values?.companySector?.id,
    //       countryId: values?.companyCountry?.id,
    //       state: values?.companyState?.id,
    //       districtId: values?.companyDistrictName.name,
    //       sectorId: values?.companySectorId.id,
    //       website: values?.companyWebsite,
    //     },
    //   }).unwrap();
    //   if (res.message) {
    //     formik.resetForm();
    //     setImagePreview(null);
    //     setImageData(null);
    //     setUploadSuccess(false);
    //     if (formik.values.profileImageId)
    //       formik.setFieldValue("profileImageId", "");
    //     setSuccess("User added successfully!");
    //   }
    // } catch (error: any) {
    //   console.log(error);
    //   if (error?.status === 409) {
    //     setError(error?.data?.error);
    //   } else {
    //     setError(
    //       "Adding user Failed! Try again, or contact the administrator!"
    //     );
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Box sx={{ marginTop: "15px" }}>
      <FormControl
        variant="filled"
        sx={{ minWidth: 120, width: "100%", marginBottom: "15px" }}
      >
        <InputLabel>Choose your organization:</InputLabel>
        <Select value={newOrg} onChange={(e) => setNewOrg(e.target.value)}>
          <MenuItem key={100} value="new">
            Add a new company
          </MenuItem>
          {organizations.map((item: organization) => (
            <MenuItem key={item?.id} value={item.id}>
              {item?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {newOrg === "new" && (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            paddingTop: "30px",
          }}
        >
          <TextField
            label="Company Name:"
            variant="filled"
            value={formik.values.companyName}
            onChange={(e) =>
              formik.setFieldValue("companyName", e.target.value)
            }
            placeholder="Name of company you work for"
            error={
              formik.errors.companyName && formik.touched.companyName
                ? true
                : false
            }
            helperText={
              formik.errors.companyName && formik.touched.companyName
                ? formik.errors.companyName
                : ""
            }
          />
          <FormControl
            variant="filled"
            error={
              formik.errors.companySector && formik.touched.companySector
                ? true
                : false
            }
            sx={{ minWidth: 120, width: "100%" }}
          >
            <InputLabel>Working Sector</InputLabel>
            <Select
              value={formik.values.companySector}
              onChange={(e) =>
                formik.setFieldValue("companySector", e.target.value)
              }
            >
              {workingSectorsEmployed.map((item: WorkingSector) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.companySector && formik.touched.companySector && (
              <FormHelperText>{formik.errors.companySector}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Your Position:"
            variant="filled"
            value={formik.values.companyPosition}
            onChange={(e) =>
              formik.setFieldValue("companyPosition", e.target.value)
            }
            placeholder="eg: Consultant, Executive, etc"
            error={
              formik.errors.companyPosition && formik.touched.companyPosition
                ? true
                : false
            }
            helperText={
              formik.errors.companyPosition && formik.touched.companyPosition
                ? formik.errors.companyPosition
                : ""
            }
          />
          <TextField
            label="Website:"
            variant="filled"
            value={formik.values.companyWebsite}
            onChange={(e) =>
              formik.setFieldValue("companyWebsite", e.target.value)
            }
            placeholder="https://example.com"
            error={
              formik.errors.companyWebsite && formik.touched.companyWebsite
                ? true
                : false
            }
            helperText={
              formik.errors.companyWebsite && formik.touched.companyWebsite
                ? formik.errors.companyWebsite
                : ""
            }
          />
          <FormControl
            variant="filled"
            error={
              formik.errors.companyCountry && formik.touched.companyCountry
                ? true
                : false
            }
            sx={{ minWidth: 120, width: "100%" }}
          >
            <InputLabel>Country</InputLabel>
            <Select
              value={formik.values.companyCountry}
              onChange={(e) => {
                formik.setFieldValue("companyCountry", e.target.value);
                setEmployedCountry(e.target.value);
              }}
            >
              {countriesEmployed.map((item: Country) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.companyCountry && formik.touched.companyCountry && (
              <FormHelperText>{formik.errors.companyCountry}</FormHelperText>
            )}
          </FormControl>
          {formik.values.companyCountry &&
            formik.values.companyCountry !== "RW" && (
              <FormControl
                variant="filled"
                error={
                  formik.errors.companyState && formik.touched.companyState
                    ? true
                    : false
                }
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>State</InputLabel>
                <Select
                  value={formik?.values?.companyState}
                  onChange={(e) => {
                    formik.setFieldValue("companyState", e.target.value);
                  }}
                >
                  {employedStates.map((item: State) => (
                    <MenuItem key={item?.id} value={item?.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.companyState && formik.touched.companyState && (
                  <FormHelperText>{formik.errors.companyState}</FormHelperText>
                )}
              </FormControl>
            )}
          {formik.values.companyCountry == "RW" && (
            <FormControl
              variant="filled"
              error={
                formik.errors.companyDistrictName &&
                formik.touched.companyDistrictName
                  ? true
                  : false
              }
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>District</InputLabel>
              <Select
                value={formik?.values?.companyDistrictName}
                onChange={(e) => {
                  setSelectedDistrictEmployed(e.target.value);
                  formik.setFieldValue("companyDistrictName", e.target.value);
                  formik.setFieldValue("companySectorId", "");
                }}
              >
                {districtsEmployed.map((item: residentDistrict) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.companyDistrictName &&
                formik.touched.companyDistrictName && (
                  <FormHelperText>
                    {formik.errors.companyDistrictName}
                  </FormHelperText>
                )}
            </FormControl>
          )}
          {formik.values.companyCountry == "RW" && (
            <FormControl
              variant="filled"
              error={
                formik.errors.companySectorId && formik.touched.companySectorId
                  ? true
                  : false
              }
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>District</InputLabel>
              <Select
                value={formik.values.companySectorId}
                onChange={(e) => {
                  formik.setFieldValue("companySectorId", e.target.value);
                }}
              >
                {sectorsEmployed.map((item: residentSector) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.companySectorId &&
                formik.touched.companySectorId && (
                  <FormHelperText>
                    {formik.errors.companySectorId}
                  </FormHelperText>
                )}
            </FormControl>
          )}
        </Box>
      )}
    </Box>
  );
}

export default AddEmployedInfo;