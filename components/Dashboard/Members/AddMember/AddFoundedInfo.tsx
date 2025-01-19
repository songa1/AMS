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
  Alert,
  Box,
  Button,
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
import {
  useAddOrgMutation,
  useAssignOrgMutation,
  useOrganizationsQuery,
} from "@/lib/features/orgSlice";

function AddFoundedInfo({ canMove, newUser }: { canMove: any; newUser: any }) {
  const [foundedCountry, setFoundedCountry] = useState("");
  const [foundedStates, setFoundedStates] = useState([]);
  const [countriesFounded, setCountriesFounded] = useState([]);
  const [sectorsFounded, setSectorsFounded] = useState([]);
  const [districtsFounded, setDistrictsFounded] = useState<residentDistrict[]>(
    []
  );
  const [organizations, setOrganizations] = useState([]);
  const [selectedDistrictFounded, setSelectedDistrictFounded] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addOrg] = useAddOrgMutation();
  const [assignOrg] = useAssignOrgMutation();

  const [workingSectors, setWorkingSectors] = useState([]);
  const { data: CountryData } = useCountriesQuery("");
  const { data: FoundedStatesData } = useStatesByCountryQuery(foundedCountry, {
    skip: !foundedCountry,
  });
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: OrganizationsData } = useOrganizationsQuery("");

  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFounded,
    {
      skip: !selectedDistrictFounded,
    }
  );
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  useEffect(() => {
    if (success || error) {
      setInterval(() => {
        setSuccess("");
        setError("");
      }, 10000);
    }
  }, [success, error]);

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectors(WorkingSectorsData?.data);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (OrganizationsData) {
      setOrganizations(OrganizationsData?.data);
    }
  }, [OrganizationsData]);

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

  useEffect(() => {
    if (newOrg === "") {
      canMove(false);
    } else {
      canMove(true);
    }
  }, [newOrg, canMove]);

  const formik = useFormik({
    initialValues: {
      initiativeName: "",
      mainSector: "",
      foundedPosition: "",
      foundedDistrictName: "",
      foundedSectorId: "",
      foundedWebsite: "",
      foundedCountry: "",
      foundedState: null,
    },
    validationSchema: Yup.object({
      initiativeName: Yup.string(),
      mainSector: Yup.string(),
      foundedPosition: Yup.string(),
      foundedDistrictName: Yup.string(),
      foundedSectorId: Yup.string(),
      foundedWebsite: Yup.string().url("Invalid website URL"),
      foundedCountry: Yup.string(),
      profileImageId: Yup.string(),
    }),
    onSubmit: async (values) => {
      // Being done in another function
    },
  });

  const handleSubmit = async () => {
    const values = formik.values;
    try {
      const res = await addOrg({
        name: values?.initiativeName,
        workingSectorId: values?.mainSector,
        countryId: values?.foundedCountry,
        stateId: values?.foundedState,
        districtId: values?.foundedDistrictName,
        sectorId: values?.foundedSectorId,
        website: values?.foundedWebsite,
      }).unwrap();
      const assign = await assignOrg({
        userId: newUser?.id,
        organizationId: res?.data?.id,
        relationshipType: "founded",
        position: formik.values.foundedPosition,
      }).unwrap();
      setSuccess("Organization added successfully!");
      canMove();
    } catch (error: any) {
      console.log(error);
      setError(error?.data?.error);
    }
  };

  return (
    <Box sx={{ marginTop: "15px" }}>
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
          Submit
        </Button>
      </div>
      {/* <FormControl
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
      </FormControl> */}

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
          label="Your Initiative Name:"
          variant="filled"
          value={formik.values.initiativeName}
          onChange={(e) =>
            formik.setFieldValue("initiativeName", e.target.value)
          }
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
            {workingSectors.map((item: WorkingSector) => (
              <MenuItem key={item?.id} value={item?.id}>
                {item?.name}
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
          onChange={(e) =>
            formik.setFieldValue("foundedWebsite", e.target.value)
          }
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
              setFoundedCountry(e.target.value);
            }}
          >
            {countriesFounded.map((item: Country) => (
              <MenuItem key={item?.id} value={item?.id}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.foundedCountry && formik.touched.foundedCountry && (
            <FormHelperText>{formik.errors.foundedCountry}</FormHelperText>
          )}
        </FormControl>
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
              formik.setFieldValue("foundedState", e.target.value);
            }}
          >
            {foundedStates.map((item: State) => (
              <MenuItem key={item?.id} value={item?.id}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.foundedState && formik.touched.foundedState && (
            <FormHelperText>{formik.errors.foundedState}</FormHelperText>
          )}
        </FormControl>
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
          {formik.errors.foundedDistrictName &&
            formik.touched.foundedDistrictName && (
              <FormHelperText>
                {formik.errors.foundedDistrictName}
              </FormHelperText>
            )}
        </FormControl>
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
            {sectorsFounded.map((item: residentSector) => (
              <MenuItem key={item?.id} value={item?.id}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.foundedSectorId && formik.touched.foundedSectorId && (
            <FormHelperText>{formik.errors.foundedSectorId}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </Box>
  );
}

export default AddFoundedInfo;
