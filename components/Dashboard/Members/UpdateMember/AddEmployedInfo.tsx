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
import {
  Country,
  organization,
  residentDistrict,
  residentSector,
  State,
  User,
  WorkingSector,
} from "@/types/user";
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
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState([]);
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
      companyName: usr?.organizationEmployed?.name,
      companySector: usr?.organizationEmployed?.workingSector?.id,
      companyPosition: usr?.positionInEmployed,
      companyWebsite: usr?.organizationEmployed?.website,
      companyDistrictName: usr?.organizationEmployed?.district?.id,
      companySectorId: usr?.organizationEmployed?.sector?.id,
      companyState: usr?.organizationEmployed?.state?.id,
      companyCountry: usr?.organizationEmployed?.country?.id,
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
            <FormControl
              variant="outlined"
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>Working Sector</InputLabel>
              <Select
                defaultValue={user?.organizationEmployed?.workingSector?.id}
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
            </FormControl>
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
            <FormControl
              variant="outlined"
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>Country</InputLabel>
              <Select
                defaultValue={user?.organizationEmployed?.country?.name}
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
            </FormControl>
            {(user?.organizationEmployed &&
              user?.organizationEmployed?.country?.id !== "RW") ||
              (formik.values.companyCountry !== "RW" && (
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 120, width: "100%" }}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    value={formik.values.companyState}
                    defaultValue={user?.organizationEmployed?.state?.id}
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
                </FormControl>
              ))}
            {(user?.organizationEmployed &&
              user?.organizationEmployed?.country?.id == "RW") ||
              (formik.values.companyCountry === "RW" && (
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 120, width: "100%" }}
                >
                  <InputLabel>District</InputLabel>
                  <Select
                    value={formik.values.companyDistrictName}
                    onChange={(e) => {
                      setSelectedDistrictEmployed(e.target.value);
                      formik.setFieldValue(
                        "companyDistrictName",
                        e.target.value
                      );
                      formik.setFieldValue("companySectorId", "");
                    }}
                    defaultValue={user?.organizationEmployed?.district?.id}
                  >
                    {districtsEmployed.map((item: residentDistrict) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            {(user?.organizationEmployed &&
              user?.organizationEmployed?.country?.id == "RW") ||
              (formik.values.companyCountry === "RW" && (
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 120, width: "100%" }}
                >
                  <InputLabel>Sector</InputLabel>
                  <Select
                    value={formik.values.companySectorId}
                    defaultValue={user?.organizationEmployed?.sector?.id}
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
                </FormControl>
              ))}
          </Box>
        )}
      </div>
    </div>
  );
}

export default UpdateEmployedInfo;
