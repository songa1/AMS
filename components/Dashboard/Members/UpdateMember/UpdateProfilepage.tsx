"use client";

import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  useCohortsQuery,
  useCountriesQuery,
  useDistrictsQuery,
  useGenderQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useTracksQuery,
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
  const [districts, setDistricts] = useState<residentDistrict[]>([]);
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [states, setStates] = useState([]);
  const [usr, setUsr] = useState<User>();

  const [updatedUser] = useUpdatedUserMutation();
  const { data: UserData, refetch: RefetchUser } = useGetOneUserQuery<{
    data: User;
  }>(id || user?.id);
  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: SectorsData } = useSectorsByDistrictQuery(
    districts.find((d: residentDistrict) => d.id === selectedDistrict)?.name,
    {
      skip: !selectedDistrict,
    }
  );

  const { data: TracksData } = useTracksQuery("");

  const { data: StatesData } = useStatesByCountryQuery(country, {
    skip: !country,
  });

  useEffect(() => {
    if (success || error) {
      setInterval(() => {
        setSuccess("");
        setError("");
      }, 10000);
    }
  }, [success, error]);

  useEffect(() => {
    if (UserData) {
      setUsr(UserData);
    }
  }, [UserData]);

  useEffect(() => {
    if (
      !UserData ||
      !GenderData ||
      !CountryData ||
      !DistrictData ||
      !CohortsData ||
      !TracksData
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    UserData,
    GenderData,
    CountryData,
    DistrictData,
    CohortsData,
    TracksData,
  ]);

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

  useEffect(() => {
    if (StatesData) {
      setStates(StatesData?.data);
    }
  }, [StatesData]);

  useEffect(() => {
    if (usr?.residentDistrictId) {
      setSelectedDistrict(usr?.residentDistrictId);
    }
  }, [usr]);

  useEffect(() => {
    if (usr?.residentCountry?.id) {
      setCountry(usr?.residentCountry?.id);
    }
  }, [usr]);

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
      gender: usr?.gender?.id,
      phoneNumber: usr?.phoneNumber,
      districtName: usr?.residentDistrict?.id,
      sectorId: usr?.residentSector?.id,
      residentCountryId: usr?.residentCountry?.id,
      fieldOfStudy: usr?.fieldOfStudy,
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
      email: Yup.string().email("Invalid email address"),
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
      fieldOfStudy: Yup.string(),
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

  const handleSubmit = async () => {
    if (formik.errors.email || formik?.errors?.bio) {
      setError(
        `Please solve this problem first: ${formik?.errors?.email || formik?.errors?.bio}`
      );
      return;
    }
    setIsLoading(true);
    const values: any = formik.values;
    try {
      const res = await updatedUser({
        user: {
          id: usr?.id,
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
          fieldOfStudy: values?.fieldOfStudy,
          whatsappNumber: values?.whatsAppNumber,
          genderId: values?.gender,
          nearestLandmark: values?.nearlestLandmark,
          cohortId: values?.cohortId,
          trackId: values?.track,
          residentDistrictId: values?.districtName,
          residentSectorId: values?.sectorId,
          residentCountryId: values?.residentCountryId,
          state: values?.state,
        },
      }).unwrap();
      if (res.message) {
        setSuccess("Profile updated successfully!");
        RefetchUser();
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
          error={formik?.errors?.bio ? true : false}
          onChange={(e) => formik.setFieldValue("bio", e.target.value)}
          className="w-full"
          placeholder="Enter the user's BIO..."
          helperText={formik?.errors?.bio}
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
            label="First Name"
            type="text"
            variant="filled"
            defaultValue={usr?.firstName}
            value={formik.values.firstName}
            onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
          />
          <TextField
            label="Middle Name"
            type="text"
            variant="filled"
            defaultValue={usr?.middleName}
            value={formik.values.middleName}
            onChange={(e) => formik.setFieldValue("middleName", e.target.value)}
          />
          <TextField
            label="Last Name"
            type="text"
            variant="filled"
            defaultValue={usr?.lastName}
            value={formik.values.lastName}
            onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            variant="filled"
            defaultValue={usr?.email}
            value={formik.values.email}
            error={formik?.errors?.email ? true : false}
            helperText={
              "Changing email will change your login credentials. Proceed with caution."
            }
            onChange={(e) => formik.setFieldValue("email", e.target.value)}
          />
          <TextField
            defaultValue={usr?.phoneNumber}
            value={formik.values.phoneNumber}
            label="Phone Number"
            type="number"
            variant="filled"
            onChange={(e) =>
              formik.setFieldValue("phoneNumber", e.target.value)
            }
            error={formik.errors.phoneNumber ? true : false}
            helperText={formik.errors.phoneNumber}
          />
          <TextField
            label="WhatsApp Number"
            type="number"
            variant="filled"
            value={formik.values.whatsAppNumber}
            defaultValue={usr?.whatsappNumber}
            onChange={(e) =>
              formik.setFieldValue("whatsAppNumber", e.target.value)
            }
            error={formik.errors.whatsAppNumber ? true : false}
            helperText={formik.errors.whatsAppNumber}
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel id="gender">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              variant="filled"
              defaultValue={usr?.gender?.id}
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
              variant="filled"
              defaultValue={usr?.residentCountry?.id}
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
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>{`State (If you are not in Rwanda)`}</InputLabel>
            <Select
              labelId="state-label"
              value={formik.values.state}
              defaultValue={usr?.state?.id}
              variant="filled"
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

          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>{`District (If you are in Rwanda)`}</InputLabel>
            <Select
              labelId="district-label"
              value={formik.values.districtName}
              defaultValue={usr?.residentDistrict?.id}
              variant="filled"
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                formik.setFieldValue("districtName", e.target.value);
                formik.setFieldValue("sectorId", "");
              }}
            >
              {districts.map((item: residentDistrict) => (
                <MenuItem key={item?.id} value={item.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>{`Sector (If you are in Rwanda)`}</InputLabel>
            <Select
              labelId="sector-label"
              value={formik.values.sectorId}
              variant="filled"
              defaultValue={usr?.residentSector?.id}
              onChange={(e) => formik.setFieldValue("sectorId", e.target.value)}
            >
              {sectors.map((item: residentSector) => (
                <MenuItem key={item?.id} value={item.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Cohort</InputLabel>
            <Select
              labelId="cohort-label"
              value={formik.values.cohortId}
              variant="filled"
              defaultValue={usr?.cohort?.id}
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
            defaultValue={usr?.nearestLandmark}
            variant="filled"
            onChange={(e) =>
              formik.setFieldValue("nearlestLandmark", e.target.value)
            }
          />
          <FormControl variant="outlined" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel>Track</InputLabel>
            <Select
              labelId="track-label"
              value={formik.values.track}
              defaultValue={usr?.track?.id}
              variant="filled"
              onChange={(e) => formik.setFieldValue("track", e.target.value)}
            >
              {tracks.map((item: Track) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Field of Study"
            defaultValue={usr?.fieldOfStudy}
            variant="filled"
            value={formik.values.fieldOfStudy}
            onChange={(e) =>
              formik.setFieldValue("fieldOfStudy", e.target.value)
            }
          />
          <TextField
            label="Facebook Account"
            defaultValue={usr?.facebook}
            variant="filled"
            value={formik.values.facebook}
            onChange={(e) => formik.setFieldValue("facebook", e.target.value)}
          />
          <TextField
            label="Instagram Account"
            defaultValue={usr?.instagram}
            variant="filled"
            value={formik.values.instagram}
            onChange={(e) => formik.setFieldValue("instagram", e.target.value)}
          />
          <TextField
            label="LinkedIn Account"
            defaultValue={usr?.linkedin}
            variant="filled"
            value={formik.values.linkedin}
            onChange={(e) => formik.setFieldValue("linkedin", e.target.value)}
          />
          <TextField
            label="Twitter Account"
            defaultValue={usr?.twitter}
            variant="filled"
            value={formik.values.twitter}
            onChange={(e) => formik.setFieldValue("twitter", e.target.value)}
          />
        </Box>
      </div>
    </div>
  );
}

export default UpdateProfilepage;
