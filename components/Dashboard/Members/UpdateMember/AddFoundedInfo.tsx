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
import {
  useAddOrgMutation,
  useAssignOrgMutation,
  useOrganizationQuery,
  useOrganizationsQuery,
  useUpdateOrgMutation,
} from "@/lib/features/orgSlice";

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
  const [organization, setOrganization] = useState<organization>();
  const [newOrg, setNewOrg] = useState("new");

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
  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFounded,
    {
      skip: !selectedDistrictFounded,
    }
  );

  const { data: OrganizationData, refetch: RefetchOne } = useOrganizationQuery(
    user?.organizationFounded?.id,
    {
      skip: !user?.organizationFounded?.id,
    }
  );

  const { data: WorkingSectorsData } = useWorkingSectorQuery("");
  const { data: FoundedStatesData } = useStatesByCountryQuery(foundedCountry, {
    skip: !foundedCountry,
  });

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
    if (OrganizationsData) {
      setOrganizations(OrganizationsData?.data);
    }
  }, [OrganizationsData]);

  useEffect(() => {
    if (OrganizationData) {
      setOrganization(OrganizationData?.data);
      setNewOrg(OrganizationData?.data?.id);
    }
  }, [OrganizationData]);

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
      let res;
      if (usr?.organizationFounded) {
        res = await updateOrg({
          id: usr?.organizationFounded?.id,
          name: values?.initiativeName,
          workingSector: values?.mainSector,
          countryId: values?.foundedCountry,
          state: values?.foundedState,
          districtId: values?.foundedDistrictName,
          sectorId: values?.foundedSectorId,
          website: values?.foundedWebsite,
        }).unwrap();
      } else {
        res = await addOrg({
          name: formik.values?.initiativeName,
          workingSectorId: values?.mainSector,
          countryId: values?.foundedCountry,
          stateId: values?.foundedState,
          districtId: values?.foundedDistrictName,
          sectorId: values?.foundedSectorId,
          website: values?.foundedWebsite,
        }).unwrap();
      }
      if (res.status === 200) {
        RefetchAll();
        RefetchOne();
        const assign = await assignOrg({
          userId: user?.id,
          organizationId: res.data.id,
          relationshipType: "founded",
          position: formik.values.foundedPosition,
        }).unwrap();

        if (assign.status === 200) {
          setSuccess("Organization updated successfully!");
          RefetchUser();
        }
      }
    } catch (error: any) {
      console.log(error);
      setError(error?.data?.error);
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
            label="Initiative Name"
            defaultValue={organization?.name}
            value={formik.values.initiativeName}
            onChange={(e) =>
              formik.setFieldValue("initiativeName", e.target.value)
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Working Sector</InputLabel>
            <Select
              defaultValue={organization?.workingSector?.id}
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
            defaultValue={usr?.positionInFounded}
            label="Position"
            value={formik.values.foundedPosition}
            onChange={(e) =>
              formik.setFieldValue("foundedPosition", e.target.value)
            }
          />
          <TextField
            label="Website"
            defaultValue={organization?.website}
            value={formik.values.foundedWebsite}
            onChange={(e) =>
              formik.setFieldValue("foundedWebsite", e.target.value)
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Country</InputLabel>
            <Select
              defaultValue={organization?.country?.id}
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
          {(organization && organization?.country?.id !== "RW") ||
            (formik.values.foundedCountry !== "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>State</InputLabel>
                <Select
                  value={formik.values.foundedState}
                  defaultValue={organization?.state?.id}
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
          {(organization && organization?.country?.id === "RW") ||
            (formik.values.foundedCountry === "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>District</InputLabel>
                <Select
                  value={formik.values.foundedDistrictName}
                  defaultValue={organization?.district?.id}
                  onChange={(e) => {
                    setSelectedDistrictFounded(e.target.value);
                    formik.setFieldValue("foundedDistrictName", e.target.value);
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
          {(organization && organization?.country?.id === "RW") ||
            (formik.values.foundedCountry === "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>Sector</InputLabel>
                <Select
                  value={formik.values.foundedSectorId}
                  defaultValue={organization?.sector?.id}
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
      </div>
    </div>
  );
}

export default UpdateFoundedInfo;
