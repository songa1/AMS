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
  Alert,
  Box,
  Button,
  FormControl,
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
  User,
  WorkingSector,
} from "@/types/user";
import { useOrganizationsQuery } from "@/lib/features/orgSlice";

function UpdateFoundedInfo() {
  const { id } = useParams();
  const user = getUser();
  const [districtsFounded, setDistrictsFounded] = useState([]);
  const [countriesFounded, setCountriesFounded] = useState([]);
  const [sectorsFounded, setSectorsFounded] = useState([]);
  const [workingSectors, setWorkingSectors] = useState([]);
  const [selectedDistrictFounded, setSelectedDistrictFounded] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundedCountry, setFoundedCountry] = useState("");
  const [foundedStates, setFoundedStates] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [newOrg, setNewOrg] = useState("");

  const [updatedUser] = useUpdatedUserMutation();
  const { data: UserData, refetch } = useGetOneUserQuery<{ data: User }>(
    id || user?.id
  );
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: OrganizationsData } = useOrganizationsQuery("");
  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFounded,
    {
      skip: !selectedDistrictFounded,
    }
  );

  const { data: WorkingSectorsData } = useWorkingSectorQuery("");
  const { data: FoundedStatesData } = useStatesByCountryQuery(foundedCountry, {
    skip: !foundedCountry,
  });

  useEffect(() => {
    if (OrganizationsData) {
      setOrganizations(OrganizationsData?.data);
    }
  }, [OrganizationsData]);

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectors(WorkingSectorsData?.data);
    }
  }, [WorkingSectorsData]);

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

  useEffect(() => {
    if (FoundedStatesData) {
      setFoundedStates(FoundedStatesData?.data);
    }
  }, [FoundedStatesData]);

  const usr = UserData;

  const formik = useFormik({
    initialValues: {
      initiativeName: usr?.organizationFounded?.name,
      mainSector: usr?.organizationFounded?.workingSector?.id,
      foundedPosition: usr?.positionInFounded,
      foundedDistrictName: usr?.organizationFounded?.district?.id,
      foundedSectorId: usr?.organizationFounded?.sector?.id,
      foundedWebsite: usr?.organizationFounded?.website,
      foundedCountry: usr?.organizationFounded?.country?.id,
      foundedState: usr?.organizationFounded?.state?.id,
    },
    validationSchema: Yup.object({
      initiativeName: Yup.string(),
      mainSector: Yup.string(),
      foundedPosition: Yup.string(),
      foundedDistrictName: Yup.string(),
      foundedSectorId: Yup.string(),
      foundedWebsite: Yup.string().url("Invalid website URL"),
      foundedCountry: Yup.string(),
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
        organizationFounded: {
          id: usr?.organizationFounded?.id,
          name: values?.initiativeName,
          workingSector: values?.mainSector?.id,
          countryId: values?.foundedCountry?.id,
          state: values?.foundedState?.id,
          districtId: values?.foundedDistrictName?.name,
          sectorId: values?.foundedSectorId?.id,
          website: values?.foundedWebsite,
        },
      }).unwrap();
      if (res.message) {
        if (id) {
          globalThis.location.href = "/dashboard/users/" + id;
        } else {
          globalThis.location.href = "/dashboard/profile";
        }
        formik.resetForm();

        setSuccess("Organization updated successfully!");
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
              label="Initiative Name"
              defaultValue={user?.organizationFounded?.name}
              value={formik.values.initiativeName}
            />
            <TextField
              label="Main Sector"
              defaultValue={user?.organizationFounded?.workingSector?.name}
              value={formik.values.mainSector}
            />
            <FormControl
              variant="outlined"
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>Working Sector</InputLabel>
              <Select
                defaultValue={user?.organizationFounded?.workingSector?.id}
                value={formik.values.mainSector}
                onChange={(e) =>
                  formik.setFieldValue("mainSector", e.target.value)
                }
              >
                {workingSectors.map((item: WorkingSector) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              defaultValue={user?.positionInFounded}
              label="Position"
              value={formik.values.foundedPosition}
            />
            <TextField
              label="Website"
              defaultValue={user?.organizationFounded?.website}
              value={formik.values.foundedWebsite}
            />
            <FormControl
              variant="outlined"
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>Country</InputLabel>
              <Select
                defaultValue={user?.organizationFounded.country?.id}
                value={formik.values.foundedCountry}
                onChange={(e) => {
                  formik.setFieldValue("foundedCountry", e.target.value);
                  setFoundedCountry(e.target.value);
                }}
              >
                {countriesFounded.map((item: Country) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {(user?.organizationFounded &&
              user?.organizationFounded?.country?.id !== "RW") ||
              (formik.values.foundedCountry !== "RW" && (
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 120, width: "100%" }}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    value={formik.values.foundedState}
                    defaultValue={user?.organizationFounded?.state?.id}
                    onChange={(e) => {
                      formik.setFieldValue("foundedState", e.target.value);
                    }}
                  >
                    {foundedStates.map((item: State) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            {(user?.organizationFounded &&
              user?.organizationFounded?.country?.id === "RW") ||
              (formik.values.foundedCountry === "RW" && (
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 120, width: "100%" }}
                >
                  <InputLabel>District</InputLabel>
                  <Select
                    value={formik.values.foundedDistrictName}
                    onChange={(e) => {
                      setSelectedDistrictFounded(e.target.value);
                      formik.setFieldValue(
                        "foundedDistrictName",
                        e.target.value
                      );
                      formik.setFieldValue("foundedSectorId", "");
                    }}
                  >
                    {districtsFounded.map((item: residentDistrict) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            {(user?.organizationFounded &&
              user?.organizationFounded?.country?.id === "RW") ||
              (formik.values.foundedCountry === "RW" && (
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 120, width: "100%" }}
                >
                  <InputLabel>Sector</InputLabel>
                  <Select
                    value={formik.values.foundedSectorId}
                    defaultValue={user?.organizationFounded?.sector?.id}
                    onChange={(e) => {
                      formik.setFieldValue("foundedSectorId", e.target.value);
                    }}
                  >
                    {sectorsFounded.map((item: residentSector) => (
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

export default UpdateFoundedInfo;
