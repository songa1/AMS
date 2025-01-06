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
  State,
  WorkingSector,
} from "@/types/user";

function AddFoundedInfo() {
  const [foundedCountry, setFoundedCountry] = useState("");
  const [foundedStates, setFoundedStates] = useState([]);
  const [countriesFounded, setCountriesFounded] = useState([]);
  const [sectorsFounded, setSectorsFounded] = useState([]);
  const [districtsFounded, setDistrictsFounded] = useState([]);
  const [selectedDistrictFounded, setSelectedDistrictFounded] = useState(null);

  const [workingSectors, setWorkingSectors] = useState([]);
  const { data: CountryData } = useCountriesQuery("");
  const { data: FoundedStatesData } = useStatesByCountryQuery(foundedCountry, {
    skip: !foundedCountry,
  });
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFounded,
    {
      skip: !selectedDistrictFounded,
    }
  );
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectors(WorkingSectorsData?.data);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (FoundedStatesData) {
      setFoundedStates(FoundedStatesData?.data);
    }
  }, [FoundedStatesData]);

  useEffect(() => {
    if (SectorsDataFounded) {
      setSectorsFounded(SectorsDataFounded?.data);
    }
  }, [SectorsDataFounded]);

  useEffect(() => {
    if (DistrictData) {
      setDistrictsFounded(DistrictData?.data);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) {
      setCountriesFounded(CountryData?.data);
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
        label="Your Initiative Name:"
        variant="filled"
        value={formik.values.initiativeName}
        onChange={(e) => formik.setFieldValue("initiativeName", e.target.value)}
        placeholder="Name of your initiative"
        error={
          formik.errors.initiativeName && formik.touched.initiativeName
            ? true
            : false
        }
        helperText={
          formik.errors.initiativeName && formik.touched.initiativeName
            ? formik.errors.initiativeName
            : ""
        }
      />
      <FormControl
        variant="filled"
        error={
          formik.errors.mainSector && formik.touched.mainSector ? true : false
        }
        sx={{ minWidth: 120, width: "100%" }}
      >
        <InputLabel>Working Sector</InputLabel>
        <Select
          value={formik.values.mainSector}
          onChange={(e) => formik.setFieldValue("mainSector", e.target.value)}
        >
          {workingSectors.map((gen: WorkingSector) => (
            <MenuItem key={gen?.id} value={gen}>
              {gen?.name}
            </MenuItem>
          ))}
        </Select>
        {formik.errors.mainSector && formik.touched.mainSector && (
          <FormHelperText>{formik.errors.mainSector}</FormHelperText>
        )}
      </FormControl>
      <TextField
        label="Your Position:"
        variant="filled"
        value={formik.values.foundedPosition}
        onChange={(e) =>
          formik.setFieldValue("foundedPosition", e.target.value)
        }
        placeholder="eg: The Founder, Managing Director, etc"
        error={
          formik.errors.foundedPosition && formik.touched.foundedPosition
            ? true
            : false
        }
        helperText={
          formik.errors.foundedPosition && formik.touched.foundedPosition
            ? formik.errors.foundedPosition
            : ""
        }
      />
      <TextField
        label="Website:"
        variant="filled"
        value={formik.values.foundedWebsite}
        onChange={(e) => formik.setFieldValue("foundedWebsite", e.target.value)}
        placeholder="https://example.com"
        error={
          formik.errors.foundedWebsite && formik.touched.foundedWebsite
            ? true
            : false
        }
        helperText={
          formik.errors.foundedWebsite && formik.touched.foundedWebsite
            ? formik.errors.foundedWebsite
            : ""
        }
      />
      <FormControl
        variant="filled"
        error={
          formik.errors.foundedCountry && formik.touched.foundedCountry
            ? true
            : false
        }
        sx={{ minWidth: 120, width: "100%" }}
      >
        <InputLabel>Country</InputLabel>
        <Select
          value={formik.values.foundedCountry}
          onChange={(e) => {
            formik.setFieldValue("foundedCountry", e.target.value);
            setFoundedCountry(e.target.value?.id);
          }}
        >
          {countriesFounded.map((gen: Country) => (
            <MenuItem key={gen?.id} value={gen}>
              {gen?.name}
            </MenuItem>
          ))}
        </Select>
        {formik.errors.foundedCountry && formik.touched.foundedCountry && (
          <FormHelperText>{formik.errors.foundedCountry}</FormHelperText>
        )}
      </FormControl>
      {formik.values.foundedCountry &&
        formik.values.foundedCountry.id !== "RW" && (
          <FormControl
            variant="filled"
            error={
              formik.errors.foundedState && formik.touched.foundedState
                ? true
                : false
            }
            sx={{ minWidth: 120, width: "100%" }}
          >
            <InputLabel>State</InputLabel>
            <Select
              value={formik.values.foundedState}
              onChange={(e) => {
                formik.setFieldValue("foundedState", e.value);
              }}
            >
              {foundedStates.map((gen: State) => (
                <MenuItem key={gen?.id} value={gen}>
                  {gen?.name}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.foundedState && formik.touched.foundedState && (
              <FormHelperText>{formik.errors.foundedState}</FormHelperText>
            )}
          </FormControl>
        )}
      {formik.values.foundedCountry.id == "RW" && (
        <FormControl
          variant="filled"
          error={
            formik.errors.foundedDistrictName &&
            formik.touched.foundedDistrictName
              ? true
              : false
          }
          sx={{ minWidth: 120, width: "100%" }}
        >
          <InputLabel>District</InputLabel>
          <Select
            value={formik.values.foundedDistrictName}
            onChange={(e) => {
              setSelectedDistrictFounded(e.value.name);
              formik.setFieldValue("foundedDistrictName", e.value);
              formik.setFieldValue("foundedSectorId", "");
            }}
          >
            {districtsFounded.map((gen: residentDistrict) => (
              <MenuItem key={gen?.id} value={gen}>
                {gen?.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.foundedDistrictName &&
            formik.touched.foundedDistrictName && (
              <FormHelperText>
                {formik.errors.foundedDistrictName}
              </FormHelperText>
            )}
        </FormControl>
      )}
      {formik.values.foundedCountry.id == "RW" && (
        <FormControl
          variant="filled"
          error={
            formik.errors.foundedSectorId && formik.touched.foundedSectorId
              ? true
              : false
          }
          sx={{ minWidth: 120, width: "100%" }}
        >
          <InputLabel>District</InputLabel>
          <Select
            value={formik.values.foundedSectorId}
            onChange={(e) => {
              formik.setFieldValue("foundedSectorId", e.target.value);
            }}
          >
            {sectorsFounded.map((gen: residentSector) => (
              <MenuItem key={gen?.id} value={gen}>
                {gen?.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.foundedSectorId && formik.touched.foundedSectorId && (
            <FormHelperText>{formik.errors.foundedSectorId}</FormHelperText>
          )}
        </FormControl>
      )}
    </div>
  );
}

export default AddFoundedInfo;
