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
import { useGetOneUserQuery } from "@/lib/features/userSlice";
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
import {
  useAddOrgMutation,
  useAssignOrgMutation,
  useOrganizationQuery,
  useOrganizationsQuery,
  useUpdateOrgMutation,
} from "@/lib/features/orgSlice";

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
  const [newOrg, setNewOrg] = useState("new");
  const [organization, setOrganization] = useState<organization>();

  const [organizations, setOrganizations] = useState([]);

  const [addOrg] = useAddOrgMutation();
  const [assignOrg] = useAssignOrgMutation();
  const [updateOrg] = useUpdateOrgMutation();
  const { data: UserData, refetch: RefetchUser } = useGetOneUserQuery<{
    data: User;
  }>(id || user?.id);
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: OrganizationsData, refetch: RefetchAll } =
    useOrganizationsQuery("");

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

  const { data: OrganizationData, refetch: RefetchOne } = useOrganizationQuery(
    user?.organizationFounded?.id,
    {
      skip: !user?.organizationFounded?.id,
    }
  );

  useEffect(() => {
    if (
      !UserData ||
      !OrganizationsData ||
      !CountryData ||
      !DistrictData ||
      !WorkingSectorsData
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    UserData,
    OrganizationsData,
    CountryData,
    DistrictData,
    WorkingSectorsData,
  ]);

  useEffect(() => {
    if (OrganizationData) {
      setOrganization(OrganizationData?.data);
      setNewOrg(OrganizationData?.data?.id);
    }
  }, [OrganizationData]);

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

  useEffect(() => {
    if (newOrg !== "new" && newOrg !== "") {
      setOrganization(
        organizations.find((org: organization) => org.id === newOrg)
      );
    }
  }, [newOrg, organizations]);

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
      let res;
      if (usr?.organizationEmployed) {
        res = await updateOrg({
          id: usr?.organizationEmployed?.id,
          name: values?.companyName,
          workingSector: values?.companySector,
          countryId: values?.companyCountry,
          state: values?.companyState,
          districtId: values?.companyDistrictName,
          sectorId: values?.companySectorId,
          website: values?.companyWebsite,
        }).unwrap();
      } else {
        res = await addOrg({
          name: formik.values?.companyName,
          workingSectorId: values?.companySector,
          countryId: values?.companyCountry,
          stateId: values?.companyState,
          districtId: values?.companyDistrictName,
          sectorId: values?.companySectorId,
          website: values?.companyWebsite,
        }).unwrap();
      }
      if (res.message) {
        RefetchAll();
        RefetchOne();
        const assign = await assignOrg({
          userId: usr?.id,
          organizationId: res?.data?.id,
          relationshipType: "employed",
          position: formik.values.companyPosition,
        }).unwrap();

        if (assign.status === 200) {
          setSuccess("Organization updated successfully!");
          RefetchUser();
        }
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
          <Select
            value={newOrg}
            onChange={(e) => {
              setNewOrg(e.target.value);
              setOrganization(
                organizations.find((org: organization) => org?.id === newOrg)
              );
            }}
          >
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
            defaultValue={organization?.name}
            value={formik.values.companyName}
            onChange={(e) =>
              formik.setFieldValue("companyName", e.target.value)
            }
          />

          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Working Sector</InputLabel>
            <Select
              defaultValue={organization?.workingSector?.id}
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
            defaultValue={usr?.positionInEmployed}
            label="Position"
            value={formik.values.companyPosition}
            onChange={(e) =>
              formik.setFieldValue("companyPosition", e.target.value)
            }
          />
          <TextField
            defaultValue={organization?.website}
            label="Website"
            value={formik.values.companyWebsite}
            onChange={(e) =>
              formik.setFieldValue("companyWebsite", e.target.value)
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Country</InputLabel>
            <Select
              defaultValue={organization?.country?.id}
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
          {(organization && organization?.country?.id !== "RW") ||
            (formik.values.companyCountry !== "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>State</InputLabel>
                <Select
                  value={formik.values.companyState}
                  defaultValue={organization?.state?.id}
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
          {(organization && organization?.country?.id == "RW") ||
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
                    formik.setFieldValue("companyDistrictName", e.target.value);
                    formik.setFieldValue("companySectorId", "");
                  }}
                  defaultValue={organization?.district?.id}
                >
                  {districtsEmployed.map((item: residentDistrict) => (
                    <MenuItem key={item?.id} value={item?.name}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          {(organization && organization?.country?.id == "RW") ||
            (formik.values.companyCountry === "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>Sector</InputLabel>
                <Select
                  value={formik.values.companySectorId}
                  defaultValue={organization?.sector?.id}
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
      </div>
    </div>
  );
}

export default UpdateEmployedInfo;
