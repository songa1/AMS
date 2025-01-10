"use client";

import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  useCountriesQuery,
  useDistrictsQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import {
  useGetOneUserQuery,
  useUpdatedUserMutation,
} from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import { organization, User } from "@/types/user";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useOrganizationsQuery } from "@/lib/features/orgSlice";

function UpdateEmployedInfo() {
  const { id } = useParams();
  const user = getUser();
  const [districtsEmployed, setDistrictsEmployed] = useState([]);
  const [countriesEmployed, setCountriesEmployed] = useState([]);
  const [sectorsEmployed, setSectorsEmployed] = useState([]);
  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState([]);
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] =
    useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState("");
  const [newOrg, setNewOrg] = useState("");

  const [organizations, setOrganizations] = useState([]);

  const [updatedUser] = useUpdatedUserMutation();
  const { data: UserData, refetch } = useGetOneUserQuery<{ data: User }>(
    id || user?.id
  );
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: OrganizationsData } = useOrganizationsQuery("");

  const { data: SectorsDataEmployed } = useSectorsByDistrictQuery(
    selectedDistrictEmployed,
    {
      skip: !selectedDistrictEmployed,
    }
  );

  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  const { data: EmployedStatesData } = useStatesByCountryQuery(
    employedCountry,
    {
      skip: !employedCountry,
    }
  );

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectorsEmployed(WorkingSectorsData?.data);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (OrganizationsData) {
      setOrganizations(OrganizationsData?.data);
    }
  }, [OrganizationsData]);

  useEffect(() => {
    if (SectorsDataEmployed) {
      setSectorsEmployed(SectorsDataEmployed?.data);
    }
  }, [SectorsDataEmployed]);

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

  useEffect(() => {
    if (EmployedStatesData) {
      setEmployedStates(EmployedStatesData?.data);
    }
  }, [EmployedStatesData]);

  const usr = UserData;

  const formik = useFormik({
    initialValues: {
      firstName: usr?.firstName,
      middleName: usr?.middleName,
      lastName: usr?.lastName,
      email: usr?.email,
      linkedin: usr?.linkedin,
      instagram: usr?.instagram,
      twitter: usr?.twitter,
      facebook: usr?.facebook,
      bio: usr?.bio,
      gender: usr?.gender,
      phoneNumber: usr?.phoneNumber,
      districtName: usr?.residentDistrict,
      sectorId: usr?.residentSector,
      residentCountryId: usr?.residentCountry,
      state: usr?.state,
      whatsAppNumber: usr?.whatsappNumber,
      nearlestLandmark: usr?.nearestLandmark,
      track: usr?.track,
      cohortId: usr?.cohort,
      initiativeName: usr?.organizationFounded?.name,
      mainSector: usr?.organizationFounded?.workingSector,
      foundedPosition: usr?.positionInFounded,
      foundedDistrictName: usr?.organizationFounded?.district,
      foundedSectorId: usr?.organizationFounded?.sector,
      foundedWebsite: usr?.organizationFounded?.website,
      foundedCountry: usr?.organizationFounded?.country,
      companyName: usr?.organizationEmployed?.name,
      companySector: usr?.organizationEmployed?.workingSector,
      companyPosition: usr?.positionInEmployed,
      companyWebsite: usr?.organizationEmployed?.website,
      companyDistrictName: usr?.organizationEmployed?.district,
      companySectorId: usr?.organizationEmployed?.sector,
      companyState: usr?.organizationEmployed?.state,
      foundedState: usr?.organizationFounded?.state,
      companyCountry: usr?.organizationEmployed?.country,
      profileImageId: usr?.profileImage,
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
      residentCountryId: Yup.string().required("Resident country is required"),
      whatsAppNumber: Yup.string().matches(
        /^[0-9]+$/,
        "WhatsApp number must be digits only"
      ),
      nearlestLandmark: Yup.string().max(
        255,
        "Landmark cannot exceed 255 characters"
      ),
      track: Yup.string(),
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

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 10000);
    }
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, 10000);
    }
  }, [error, success]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const values: any = formik.values;
    try {
      const res = await updatedUser({
        userId: usr?.id,
        organizationEmployed: {
          id: usr?.organizationEmployed?.id,
          name: values?.companyName,
          workingSector: values?.companySector?.id,
          countryId: values?.companyCountry?.id,
          state: values?.companyState?.id,
          districtId: values?.companyDistrictName?.name,
          sectorId: values?.companySectorId?.id,
          website: values?.companyWebsite,
        },
      }).unwrap();
      if (res.message) {
        if (id) {
          globalThis.location.href = "/dashboard/users/" + id;
        } else {
          globalThis.location.href = "/dashboard/profile";
        }
        formik.resetForm();
        refetch();
      }
    } catch (error: any) {
      console.log(error);
      if (error?.status === 409) {
        setError(error?.data?.error);
      } else {
        setError(
          "Updating user Failed! Try again, or contact the administrator!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="w-full">
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="filled" severity="success">
            {success}
          </Alert>
        )}
        <div className="flex items-start justify-between py-4">
          <div></div>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Update
          </Button>
        </div>
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
              paddingTop: "10px",
            }}
          >
            <TextField
              label="Company Name"
              value={
                user?.organizationEmployed?.name
                  ? user?.organizationEmployed?.name
                  : "--"
              }
            />

            <TextField
              value={
                user?.organizationEmployed?.workingSector?.name
                  ? user?.organizationEmployed?.workingSector?.name
                  : "--"
              }
              label="Company Sector"
            />
            <TextField
              value={user?.positionInEmployed ? user?.positionInEmployed : "--"}
              label="Position"
            />
            <TextField
              value={
                user?.organizationEmployed?.website
                  ? user?.organizationEmployed?.website
                  : "--"
              }
              label="Website"
            />
            <TextField
              value={
                user?.organizationEmployed?.country?.name
                  ? user?.organizationEmployed?.country?.name
                  : "--"
              }
              label="Country"
            />
            {user?.organizationEmployed &&
              user?.organizationEmployed?.country?.id == "RW" && (
                <TextField
                  value={
                    user?.organizationEmployed?.district?.name
                      ? user?.organizationEmployed?.district?.name
                      : "--"
                  }
                  label="District"
                />
              )}
            {user?.organizationEmployed &&
              user?.organizationEmployed?.country?.id == "RW" && (
                <TextField
                  value={
                    user?.organizationEmployed?.sector?.name
                      ? user?.organizationEmployed?.sector?.name
                      : "--"
                  }
                  label="Sector"
                />
              )}
          </Box>
        )}
      </div>
    </div>
  );
}

export default UpdateEmployedInfo;
