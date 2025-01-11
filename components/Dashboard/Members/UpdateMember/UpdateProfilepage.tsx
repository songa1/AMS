"use client";

import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  useCohortsQuery,
  useCountriesQuery,
  useDistrictsQuery,
  useGenderQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useTracksQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import {
  useGetOneUserQuery,
  useUpdatedUserMutation,
} from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import {
  cohort,
  Country,
  gender,
  residentDistrict,
  residentSector,
  State,
  Track,
  User,
} from "@/types/user";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
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

function UpdateProfilepage() {
  const { id } = useParams();
  const user = getUser();
  const [genders, setGenders] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [states, setStates] = useState([]);

  const [updatedUser] = useUpdatedUserMutation();
  const { data: UserData, refetch } = useGetOneUserQuery<{ data: User }>(
    id || user?.id
  );
  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: SectorsData } = useSectorsByDistrictQuery(selectedDistrict, {
    skip: !selectedDistrict,
  });

  const authorized = false;

  const { data: TracksData } = useTracksQuery("");

  const { data: StatesData } = useStatesByCountryQuery(country, {
    skip: !country,
  });

  useEffect(() => {
    if (TracksData) {
      setTracks(TracksData?.data);
    }
  }, [TracksData]);

  useEffect(() => {
    if (GenderData) {
      setGenders(GenderData?.data);
    }
  }, [GenderData]);

  useEffect(() => {
    if (CohortsData) {
      setCohorts(CohortsData?.data);
    }
  }, [CohortsData]);

  useEffect(() => {
    if (SectorsData) {
      setSectors(SectorsData?.data);
    }
  }, [SectorsData]);

  useEffect(() => {
    if (DistrictData) {
      setDistricts(DistrictData?.data);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) {
      setCountries(CountryData?.data);
    }
  }, [CountryData]);

  useEffect(() => {
    if (StatesData) {
      setStates(StatesData?.data);
    }
  }, [StatesData]);

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
      districtName: usr?.residentDistrict?.name,
      sectorId: usr?.residentSector?.id,
      residentCountryId: usr?.residentCountry?.id,
      state: usr?.state?.id,
      whatsAppNumber: usr?.whatsappNumber,
      nearlestLandmark: usr?.nearestLandmark,
      track: usr?.track?.id,
      cohortId: usr?.cohort?.id,
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
        user: {
          firstName: values?.firstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          email: values?.email,
          linkedin: values?.linkedin,
          instagram: values?.instagram,
          twitter: values?.twitter,
          facebook: values?.facebook,
          bio: values?.bio,
          phoneNumber: values?.phoneNumber,
          whatsappNumber: values?.whatsAppNumber,
          genderName: values?.gender?.name,
          nearestLandmark: values?.nearlestLandmark,
          cohortId: values?.cohortId?.id,
          trackId: values?.track?.id,
          residentDistrictId: values?.districtName?.id,
          residentSectorId: values?.sectorId?.id,
          residentCountryId: values?.residentCountryId?.id,
          state: values?.state?.id,
          profileImageId: values?.profileImageId?.id,
        },
      }).unwrap();
      if (res.message) {
        if (id) {
          globalThis.location.href = "/dashboard/users/" + id;
        } else {
          globalThis.location.href = "/dashboard/profile";
        }
        formik.resetForm();
        setSuccess("User updated successfully!");
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
        <TextField
          label="Biography"
          multiline
          rows={5}
          defaultValue={usr?.bio}
          value={formik.values.bio}
          disabled={authorized}
          onChange={(e) => formik.setFieldValue("bio", e.target.value)}
          className="w-full"
          placeholder="Enter the user's BIO..."
        />
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
            label="Email"
            defaultValue={user?.email}
            value={formik.values.email}
          />
          <TextField
            defaultValue={user?.phoneNumber}
            value={formik.values.phoneNumber}
            label="Phone Number"
          />
          <TextField
            label="WhatsApp Number"
            value={formik.values.whatsAppNumber}
            defaultValue={user?.whatsappNumber}
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel id="gender">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              defaultValue={user?.gender?.id}
              value={formik.values.gender}
              onChange={(e) => formik.setFieldValue("gender", e.target.value)}
            >
              {genders.map((gen: gender) => (
                <MenuItem key={gen?.id} value={gen.id}>
                  {gen?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel id="gender">Resident Country</InputLabel>
            <Select
              labelId="country-label"
              id="country"
              defaultValue={user?.residentCountry?.id}
              value={formik.values.residentCountryId}
              onChange={(e) => {
                formik.setFieldValue("residentCountryId", e.target.value);
                setCountry(e.target.value);
              }}
            >
              {countries.map((item: Country) => (
                <MenuItem key={item?.id} value={item.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(user?.residentCountry && user?.residentCountry?.id !== "RW") ||
            (formik.values.residentCountryId !== "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>State</InputLabel>
                <Select
                  labelId="state-label"
                  value={formik.values.state}
                  defaultValue={user?.state?.id}
                  onChange={(e) => {
                    console.log(e);
                    formik.setFieldValue("state", e.target.value);
                  }}
                >
                  {states.map((item: State) => (
                    <MenuItem key={item?.id} value={item.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          {(user?.residentCountry && user?.residentCountry?.id === "RW") ||
            (formik.values.residentCountryId === "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>District</InputLabel>
                <Select
                  labelId="district-label"
                  value={formik.values.districtName}
                  defaultValue={user?.residentDistrict?.name}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    formik.setFieldValue("districtName", e.target.value);
                    formik.setFieldValue("sectorId", "");
                  }}
                >
                  {districts.map((item: residentDistrict) => (
                    <MenuItem key={item?.id} value={item.name}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          {(user?.residentCountry && user?.residentCountry?.id === "RW") ||
            (formik.values.residentCountryId === "RW" && (
              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>Sector</InputLabel>
                <Select
                  labelId="sector-label"
                  value={formik.values.sectorId}
                  defaultValue={user?.residentSector?.id}
                  onChange={(e) =>
                    formik.setFieldValue("sectorId", e.target.value)
                  }
                >
                  {sectors.map((item: residentSector) => (
                    <MenuItem key={item?.id} value={item.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Cohort</InputLabel>
            <Select
              labelId="cohort-label"
              value={formik.values.cohortId}
              defaultValue={user?.cohort?.id}
              onChange={(e) => formik.setFieldValue("cohortId", e.target.value)}
            >
              {cohorts.map((item: cohort) => (
                <MenuItem key={item?.id} value={item.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Nearest Landmark"
            value={formik.values.nearlestLandmark}
            defaultValue={user?.nearestLandmark}
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Track</InputLabel>
            <Select
              labelId="track-label"
              value={formik.values.track}
              defaultValue={user?.track?.id}
              onChange={(e) => formik.setFieldValue("track", e.target.value)}
            >
              {tracks.map((item: Track) => (
                <MenuItem key={item?.id} value={item.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Facebook Account"
            defaultValue={user?.facebook}
            value={formik.values.facebook}
          />
          <TextField
            label="Instagram Account"
            defaultValue={user?.instagram}
            value={formik.values.instagram}
          />
          <TextField
            label="LinkedIn Account"
            defaultValue={user?.linkedin}
            value={formik.values.linkedin}
          />
          <TextField
            label="Twitter Account"
            defaultValue={user?.twitter}
            value={formik.values.twitter}
          />
        </Box>
      </div>
    </div>
  );
}

export default UpdateProfilepage;
