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
  residentDistrict,
  residentSector,
  State,
  User,
  WorkingSector,
} from "@/types/user";
import {
  useAddOrgMutation,
  useAssignOrgMutation,
  useUpdateOrgMutation,
} from "@/lib/features/orgSlice";
import ChangeOrganization from "./ChangeOrganization";

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
  const [usr, setUsr] = useState<User>();

  const [addOrg] = useAddOrgMutation();
  const [assignOrg] = useAssignOrgMutation();
  const [updateOrg] = useUpdateOrgMutation();
  const { data: UserData, refetch: RefetchUser } = useGetOneUserQuery<{
    data: User;
  }>(id || user?.id);
  const userHasOrg = usr?.organizationEmployed ? true : false;
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
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
    if (UserData) {
      setUsr(UserData);
    }
  }, [UserData]);

  useEffect(() => {
    if (success || error) {
      setInterval(() => {
        setSuccess("");
        setError("");
      }, 10000);
    }
  }, [success, error]);

  useEffect(() => {
    if (!UserData || !CountryData || !DistrictData || !WorkingSectorsData) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [UserData, CountryData, DistrictData, WorkingSectorsData]);

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
    if (usr?.organizationFounded?.districtId) {
      setSelectedDistrictFounded(usr?.organizationFounded?.districtId);
    }
  }, [usr]);

  useEffect(() => {
    if (usr?.organizationFounded?.country?.id) {
      setFoundedCountry(usr?.organizationFounded?.country?.id);
    }
  }, [usr]);

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
      orgId: usr?.organizationFounded?.id,
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

  useEffect(() => {
    if (userHasOrg) {
      formik.setFieldValue("orgId", usr?.organizationEmployed?.id);
    }
  }, [userHasOrg, usr, formik]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const values: any = formik.values;
    console.log(values);
    try {
      let res;
      if (userHasOrg) {
        res = await updateOrg({
          id: values?.orgId,
          name: values?.initiativeName,
          workingSectorId: values?.mainSector,
          countryId: values?.foundedCountry,
          state: values?.foundedState,
          districtId: values?.foundedDistrictName,
          sectorId: values?.foundedSectorId,
          website: values?.foundedWebsite,
        }).unwrap();
      } else {
        res = await addOrg({
          name: values?.initiativeName,
          workingSectorId: values?.mainSector,
          countryId: values?.foundedCountry,
          stateId: values?.foundedState,
          districtId: values?.foundedDistrictName,
          sectorId: values?.foundedSectorId,
          website: values?.foundedWebsite,
        }).unwrap();
      }
      if (res?.data) {
        const assign = await assignOrg({
          userId: user?.id,
          organizationId: res?.data?.id,
          relationshipType: "founded",
          position: formik.values.foundedPosition,
        }).unwrap();
        setSuccess("Organization updated successfully!");
        RefetchUser();
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
            variant="filled"
            defaultValue={usr?.organizationFounded?.name}
            value={formik.values.initiativeName}
            onChange={(e) =>
              formik.setFieldValue("initiativeName", e.target.value)
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Working Sector</InputLabel>
            <Select
              defaultValue={usr?.organizationFounded?.workingSector?.id}
              value={formik.values.mainSector}
              variant="filled"
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
            variant="filled"
            onChange={(e) =>
              formik.setFieldValue("foundedPosition", e.target.value)
            }
          />
          <TextField
            label="Website"
            defaultValue={usr?.organizationFounded?.website}
            value={formik.values.foundedWebsite}
            variant="filled"
            onChange={(e) =>
              formik.setFieldValue("foundedWebsite", e.target.value)
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Country</InputLabel>
            <Select
              defaultValue={usr?.organizationFounded?.country?.id}
              value={formik.values.foundedCountry}
              variant="filled"
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
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>{`State (If you are not in Rwanda)`}</InputLabel>
            <Select
              value={formik.values.foundedState}
              variant="filled"
              defaultValue={usr?.organizationFounded?.state?.id}
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

          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>{`District  (If you are in Rwanda)`}</InputLabel>
            <Select
              value={formik.values.foundedDistrictName}
              variant="filled"
              defaultValue={usr?.organizationFounded?.district?.id}
              onChange={(e) => {
                setSelectedDistrictFounded(e.target.value);
                formik.setFieldValue("foundedDistrictName", e.target.value);
                formik.setFieldValue("foundedSectorId", "");
              }}
            >
              {districtsFounded.map((item: residentDistrict) => (
                <MenuItem key={item?.id} value={item?.name}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>{`Sector (If you are in Rwanda)`}</InputLabel>
            <Select
              value={formik.values.foundedSectorId}
              variant="filled"
              defaultValue={usr?.organizationFounded?.sector?.id}
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
        </Box>
        <ChangeOrganization refetch={RefetchUser} rel="founded" user={usr} />
      </div>
    </div>
  );
}

export default UpdateFoundedInfo;
