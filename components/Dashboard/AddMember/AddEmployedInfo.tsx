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
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  Country,
  residentDistrict,
  residentSector,
  WorkingSector,
} from "@/types/user";

function AddEmployedInfo(props) {
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState([]);
  const [countriesEmployed, setCountriesEmployed] = useState([]);
  const [sectorsEmployed, setSectorsEmployed] = useState([]);
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] =
    useState(null);
  const [districtsEmployed, setDistrictsEmployed] = useState([]);

  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState([]);

  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CountryData } = useCountriesQuery("");
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
      bio: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      linkedin: "",
      instagram: "",
      twitter: "",
      facebook: "",
      gender: "",
      phoneNumber: "",
      districtName: "",
      sectorId: "",
      residentCountryId: "",
      whatsAppNumber: "",
      nearlestLandmark: "",
      track: "",
      cohortId: null,
      state: null,
      initiativeName: "",
      mainSector: "",
      foundedPosition: "",
      foundedDistrictName: "",
      foundedSectorId: "",
      foundedWebsite: "",
      foundedCountry: "",
      companyName: "",
      companySector: "",
      companyPosition: "",
      companyWebsite: "",
      companyDistrictName: "",
      companySectorId: "",
      companyCountry: "",
      profileImageId: "",
      companyState: null,
      foundedState: null,
    },
    validationSchema: Yup.object({
      bio: Yup.string().max(500, "Bio cannot exceed 500 characters"),
      firstName: Yup.string().required("First name is required"),
      middleName: Yup.string(),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      linkedin: Yup.string().url("Invalid LinkedIn URL"),
      instagram: Yup.string().url("Invalid Instagram URL"),
      twitter: Yup.string().url("Invalid Twitter URL"),
      facebook: Yup.string().url("Invalid Facebook URL"),
      gender: Yup.string().oneOf(
        ["Male", "Female", "Other"],
        "Select a valid gender"
      ),
      phoneNumber: Yup.string().matches(
        /^[0-9]+$/,
        "Phone number must be digits only"
      ),
      districtName: Yup.string(),
      sectorId: Yup.string(),
      whatsAppNumber: Yup.string().matches(
        /^[0-9]+$/,
        "WhatsApp number must be digits only"
      ),
      nearlestLandmark: Yup.string().max(
        255,
        "Landmark cannot exceed 255 characters"
      ),
      track: Yup.string().required("Track is required"),
      cohortId: Yup.number().nullable(),
      initiativeName: Yup.string(),
      mainSector: Yup.string(),
      foundedPosition: Yup.string(),
      foundedDistrictName: Yup.string(),
      foundedSectorId: Yup.string(),
      foundedWebsite: Yup.string().url("Invalid website URL"),
      foundedCountry: Yup.string(),
      companyName: Yup.string(),
      companySector: Yup.string(),
      companyPosition: Yup.string(),
      companyWebsite: Yup.string().url("Invalid website URL"),
      companyDistrictName: Yup.string(),
      companySectorId: Yup.string(),
      companyCountry: Yup.string(),
      profileImageId: Yup.string(),
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
    <div className="grid grid-cols-2 gap-3">
      <TextField
        label="Company Name:"
        variant="filled"
        value={formik.values.companyName}
        onChange={(e) => formik.setFieldValue("companyName", e.target.value)}
        placeholder="Name of company you work for"
        error={
          formik.errors.companyName && formik.touched.companyName ? true : false
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
          {workingSectorsEmployed.map((gen: WorkingSector) => (
            <MenuItem key={gen?.id} value={gen}>
              {gen?.name}
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
        onChange={(e) => formik.setFieldValue("companyWebsite", e.target.value)}
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
            setEmployedCountry(e.target.value?.id);
          }}
        >
          {countriesEmployed.map((gen: Country) => (
            <MenuItem key={gen?.id} value={gen}>
              {gen?.name}
            </MenuItem>
          ))}
        </Select>
        {formik.errors.companyCountry && formik.touched.companyCountry && (
          <FormHelperText>{formik.errors.companyCountry}</FormHelperText>
        )}
      </FormControl>
      {formik.values.companyCountry &&
        formik.values.companyCountry.id !== "RW" && (
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
                formik.setFieldValue("companyState", e.value);
              }}
            >
              {employedStates.map((gen: State) => (
                <MenuItem key={gen?.id} value={gen}>
                  {gen?.name}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.companyState && formik.touched.companyState && (
              <FormHelperText>{formik.errors.companyState}</FormHelperText>
            )}
          </FormControl>
        )}
      {formik.values.companyCountry.id == "RW" && (
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
              setSelectedDistrictEmployed(e.value.name);
              formik.setFieldValue("companyDistrictName", e.value);
              formik.setFieldValue("companySectorId", "");
            }}
          >
            {districtsEmployed.map((gen: residentDistrict) => (
              <MenuItem key={gen?.id} value={gen}>
                {gen?.name}
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
      {formik.values.companyCountry.id == "RW" && (
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
            {sectorsEmployed.map((gen: residentSector) => (
              <MenuItem key={gen?.id} value={gen}>
                {gen?.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.companySectorId && formik.touched.companySectorId && (
            <FormHelperText>{formik.errors.companySectorId}</FormHelperText>
          )}
        </FormControl>
      )}
    </div>
  );
}

export default AddEmployedInfo;
